<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Unidad;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function maintenance()
    {
        return Inertia::render('Inventory/Maintenance', [
            'categorias' => Categoria::with('children')->whereNull('parent_id')->get(),
            'marcas' => Marca::all(),
            'unidades' => Unidad::all(),
        ]);
    }
}
