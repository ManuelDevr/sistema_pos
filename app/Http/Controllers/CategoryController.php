<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
            'parent_id' => 'nullable|exists:categorias,id',
        ]);

        Categoria::create($validated);

        return redirect()->back()->with('success', 'Categoría creada correctamente.');
    }

    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categorias,nombre,' . $categoria->id,
            'descripcion' => 'nullable|string',
            'parent_id' => [
                'nullable',
                'exists:categorias,id',
                function ($attribute, $value, $fail) use ($categoria) {
                    if ($value == $categoria->id) {
                        $fail('Una categoría no puede ser su propio padre.');
                    }
                }
            ],
            'estado' => 'required|in:Activo,Inactivo',
        ]);

        $categoria->update($validated);

        return redirect()->back()->with('success', 'Categoría actualizada.');
    }

    public function toggleStatus(Categoria $categoria)
    {
        $categoria->estado = $categoria->estado === 'Activo' ? 'Inactivo' : 'Activo';
        $categoria->save();

        return redirect()->back()->with('success', 'Estado de la categoría actualizado.');
    }
}
