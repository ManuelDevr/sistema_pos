<?php

namespace App\Http\Controllers;

use App\Models\PermisoRol;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class PermissionController extends Controller
{
    private $availablePermissions = [
        ['key' => 'ver_dashboard', 'label' => 'Ver Dashboard'],
        ['key' => 'ver_catalogo', 'label' => 'Ver Catálogo de Productos'],
        ['key' => 'ver_kardex', 'label' => 'Ver Kardex Permanente'],
        ['key' => 'gestionar_mantenimiento', 'label' => 'Gestionar Categorías y Marcas'],
        ['key' => 'gestionar_productos', 'label' => 'Gestionar Productos'],
        ['key' => 'gestionar_clientes', 'label' => 'Gestionar Clientes'],
        ['key' => 'realizar_ventas', 'label' => 'Realizar Ventas (POS)'],
        ['key' => 'ver_historial_ventas', 'label' => 'Ver Historial de Ventas'],
        ['key' => 'anular_ventas', 'label' => 'Anular Ventas'],
        ['key' => 'gestionar_usuarios', 'label' => 'Gestionar Usuarios'],
        ['key' => 'configuracion_sistema', 'label' => 'Configuración de Empresa'],
        ['key' => 'configurar_privilegios', 'label' => 'Configurar Privilegios'],
    ];

    public function index()
    {
        return Inertia::render('Settings/Privileges', [
            'availablePermissions' => $this->availablePermissions,
            'permisosExistentes' => PermisoRol::all(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'privilegios' => 'required|array',
            'privilegios.*.rol' => 'required|string',
            'privilegios.*.permiso' => 'required|string',
            'privilegios.*.permitido' => 'required|boolean',
        ]);

        foreach ($request->privilegios as $priv) {
            PermisoRol::updateOrCreate(
                ['rol' => $priv['rol'], 'permiso' => $priv['permiso']],
                ['permitido' => $priv['permitido']]
            );
        }

        // Limpiar caché de permisos solo para los roles que fueron modificados
        $rolesAfectados = collect($request->privilegios)->pluck('rol')->unique();
        foreach ($rolesAfectados as $rol) {
            Cache::forget("role_permissions_{$rol}");
        }

        return redirect()->route('privilegios.index')->with('success', 'Privilegios actualizados correctamente en todo el sistema.');
    }
}
