<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PermisoRol;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'ver_dashboard',
            'gestionar_productos',
            'gestionar_clientes',
            'realizar_ventas',
            'ver_historial_ventas',
            'anular_ventas',
            'gestionar_usuarios',
            'configuracion_sistema',
            'configurar_privilegios',
            'ver_catalogo',
            'ver_kardex',
            'gestionar_mantenimiento',
        ];

        // Administrador: Todos los permisos activos por defecto
        foreach ($permissions as $perm) {
            PermisoRol::updateOrCreate(
                ['rol' => 'Administrador', 'permiso' => $perm],
                ['permitido' => true]
            );
        }

        // Cajero: Permisos limitados por defecto
        $cajeroPermissions = [
            'ver_dashboard' => true,
            'gestionar_productos' => false,
            'gestionar_clientes' => true,
            'realizar_ventas' => true,
            'ver_historial_ventas' => true,
            'anular_ventas' => false,
            'gestionar_usuarios' => false,
            'configuracion_sistema' => false,
            'configurar_privilegios' => false,
            'ver_catalogo' => true,
            'ver_kardex' => false,
            'gestionar_mantenimiento' => false,
        ];

        foreach ($cajeroPermissions as $perm => $allowed) {
            PermisoRol::updateOrCreate(
                ['rol' => 'Cajero', 'permiso' => $perm],
                ['permitido' => $allowed]
            );
        }
    }
}
