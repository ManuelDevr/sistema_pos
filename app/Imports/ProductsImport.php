<?php

namespace App\Imports;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Marca;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Str;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use Importable;

    private $errors = [];
    private $rowNumber = 0;

    public function model(array $row)
    {
        $this->rowNumber++;

        $categoria = null;
        if (!empty($row['categoria'])) {
            $categoria = Categoria::firstOrCreate(
                ['nombre' => trim($row['categoria'])],
                ['estado' => 'Activo']
            );
        }

        $marca = null;
        if (!empty($row['marca'])) {
            $marca = Marca::firstOrCreate(
                ['nombre' => trim($row['marca'])],
                ['estado' => 'Activo']
            );
        }

        return new Producto([
            'nombre'          => trim($row['nombre']),
            'sku'             => trim($row['sku']),
            'descripcion'     => trim($row['descripcion'] ?? ''),
            'precio_compra'   => $row['precio_compra'],
            'precio_venta'    => $row['precio_venta'],
            'stock'           => $row['stock'],
            'stock_minimo'    => $row['stock_minimo'],
            'unidad_medida'   => trim($row['unidad_medida'] ?? 'Unidad'),
            'categoria_id'    => $categoria?->id,
            'marca_id'        => $marca?->id,
            'estado'          => 'Activo',
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre'         => 'required|string|max:150',
            'sku'            => 'required|string|max:50|unique:productos,sku',
            'descripcion'    => 'required|string',
            'precio_compra'  => 'required|numeric|min:0',
            'precio_venta'   => 'required|numeric|min:0',
            'stock'          => 'required|numeric|min:0',
            'stock_minimo'   => 'required|numeric|min:0',
            'categoria'      => 'required|string|max:150',
            'marca'          => 'required|string|max:150',
            'unidad_medida'  => 'required|string|max:50',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nombre.required'        => 'El nombre es obligatorio.',
            'sku.required'           => 'El SKU es obligatorio.',
            'sku.unique'             => 'El SKU ya existe en la base de datos.',
            'descripcion.required'   => 'La descripción es obligatoria.',
            'precio_compra.required' => 'El precio de compra es obligatorio.',
            'precio_venta.required'  => 'El precio de venta es obligatorio.',
            'stock.required'         => 'El stock es obligatorio.',
            'stock_minimo.required'  => 'El stock mínimo es obligatorio.',
            'categoria.required'     => 'La categoría es obligatoria.',
            'marca.required'         => 'La marca es obligatoria.',
            'unidad_medida.required' => 'La unidad de medida es obligatoria.',
        ];
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $row = $failure->row();
            $attribute = $failure->attribute();
            $errors = $failure->errors();
            $this->errors[] = "Fila {$row}: {$attribute} - " . implode(', ', $errors);
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
