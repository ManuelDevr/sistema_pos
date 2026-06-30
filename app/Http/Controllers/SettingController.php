<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'configuracion' => Configuracion::first()
        ]);
    }

    public function update(Request $request)
    {
        $config = Configuracion::first() ?? new Configuracion();

        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:150',
            'ruc'            => 'nullable|string|max:20',
            'direccion'      => 'nullable|string',
            'telefono'       => 'nullable|string|max:20',
            'logo'           => 'nullable|image|max:1024', // 1MB Max
            'metodos_pago'   => 'nullable|array|min:1',
            'metodos_pago.*' => 'string|max:50',
        ]);

        if ($request->hasFile('logo')) {
            // Eliminar logo anterior si existe
            if ($config->logo_empresa && is_string($config->logo_empresa)) {
                Storage::disk('public')->delete($config->logo_empresa);
            }
            $path = $request->file('logo')->store('config', 'public');
            $validated['logo_empresa'] = $path;
        }

        $config->fill($validated);
        $config->save();

        // Invalidar cachés de configuración global y métodos de pago
        Cache::forget('app_config');
        Cache::forget('app_config_metodos_pago');

        return redirect()->back()->with('success', 'Configuración actualizada correctamente.');
    }
}
