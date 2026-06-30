<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Unidad;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/Index', [
            'productos' => Producto::with([
                    'categoria:id,nombre', 
                    'marca:id,nombre',
                    'conversiones.unidad:id,nombre,abreviatura'
                ])
                ->orderBy('nombre')
                ->get(),
            'categorias' => Categoria::select('id', 'nombre', 'parent_id')->with('children:id,nombre,parent_id')->whereNull('parent_id')->get(),
            'marcas' => Marca::select('id', 'nombre')->get(),
            'unidades' => Unidad::select('id', 'nombre', 'abreviatura')->get(),
        ]);
    }

    public function catalog()
    {
        return Inertia::render('Products/Catalog', [
            'productos' => Producto::select('id', 'nombre', 'sku', 'codigo_barras', 'stock', 'precio_venta', 'unidad_medida', 'marca_id', 'categoria_id')
                ->with(['marca:id,nombre', 'categoria:id,nombre'])
                ->where('estado', 'Activo')
                ->orderBy('nombre')
                ->get(),
            'categorias' => Categoria::select('id', 'nombre', 'parent_id')->with('children:id,nombre,parent_id')->whereNull('parent_id')->get(),
            'marcas' => Marca::select('id', 'nombre')->get(),
        ]);
    }

    public function show(Producto $producto)
    {
        $producto->load(['categoria:id,nombre', 'marca:id,nombre', 'conversiones.unidad:id,nombre,abreviatura']);
        
        // Productos similares (misma categoría)
        $similares = Producto::select('id', 'nombre', 'sku', 'stock', 'precio_venta', 'unidad_medida', 'marca_id', 'categoria_id')
            ->with(['marca:id,nombre'])
            ->where('categoria_id', $producto->categoria_id)
            ->where('id', '!=', $producto->id)
            ->where('estado', 'Activo')
            ->limit(4)
            ->get();

        return Inertia::render('Products/Show', [
            'producto' => $producto,
            'similares' => $similares
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        Producto::create($request->validated());

        return redirect()->back()->with('success', 'Producto creado correctamente.');
    }

    public function update(UpdateProductRequest $request, Producto $producto)
    {
        $producto->update($request->validated());

        return redirect()->back()->with('success', 'Producto actualizado.');
    }

    public function toggleStatus(Producto $producto)
    {
        $producto->estado = $producto->estado === 'Activo' ? 'Inactivo' : 'Activo';
        $producto->save();

        return redirect()->back()->with('success', 'Estado del producto actualizado.');
    }

    public function storeConversion(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'unidad_id' => [
                'required',
                'exists:unidades,id',
                \Illuminate\Validation\Rule::unique('conversiones_unidad_producto')->where(function ($query) use ($producto) {
                    return $query->where('producto_id', $producto->id);
                })
            ],
            'cantidad' => 'required|integer|min:1',
            'factor' => 'required|numeric|min:0.0001',
            'codigo_barras' => 'nullable|string|max:50|unique:conversiones_unidad_producto,codigo_barras',
            'precio_compra' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
        ], [
            'unidad_id.unique' => 'Este producto ya tiene registrada una conversión para esta unidad de medida.',
        ]);

        $producto->conversiones()->create($validated);

        return redirect()->back()->with('success', 'Conversión añadida correctamente.');
    }

    public function updateConversion(Request $request, \App\Models\ConversionUnidadProducto $conversion)
    {
        $validated = $request->validate([
            'unidad_id' => [
                'required',
                'exists:unidades,id',
                \Illuminate\Validation\Rule::unique('conversiones_unidad_producto')->where(function ($query) use ($conversion) {
                    return $query->where('producto_id', $conversion->producto_id);
                })->ignore($conversion->id)
            ],
            'cantidad' => 'required|integer|min:1',
            'factor' => 'required|numeric|min:0.0001',
            'codigo_barras' => 'nullable|string|max:50|unique:conversiones_unidad_producto,codigo_barras,' . $conversion->id,
            'precio_compra' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
        ]);

        $conversion->update($validated);

        return redirect()->back()->with('success', 'Conversión actualizada correctamente.');
    }

    public function toggleStatusConversion(\App\Models\ConversionUnidadProducto $conversion)
    {
        $conversion->estado = $conversion->estado === 'Activo' ? 'Inactivo' : 'Activo';
        $conversion->save();

        return redirect()->back()->with('success', 'Estado de la conversión actualizado.');
    }

    public function destroyConversion(\App\Models\ConversionUnidadProducto $conversion)
    {
        $conversion->delete();
        return redirect()->back()->with('success', 'Conversión eliminada.');
    }
}
