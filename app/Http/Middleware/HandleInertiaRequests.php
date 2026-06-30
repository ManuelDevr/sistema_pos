<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user()
                    ? Cache::remember("role_permissions_{$request->user()->rol}", 600, fn () =>
                        \App\Models\PermisoRol::where('rol', $request->user()->rol)
                            ->where('permitido', true)
                            ->pluck('permiso')
                            ->toArray()
                      )
                    : [],
            ],
            'notifications' => $request->user()
                ? Cache::remember('low_stock_alerts', 120, fn () =>
                    \App\Models\Producto::where('stock', '<=', DB::raw('stock_minimo'))
                        ->where('estado', 'Activo')
                        ->get()
                        ->map(fn($p) => [
                            'id'      => $p->id,
                            'type'    => 'warning',
                            'title'   => 'Stock Bajo',
                            'message' => "El producto {$p->nombre} tiene solo {$p->stock} unidades.",
                        ])
                        ->values()
                  )
                : [],
            'config' => Cache::remember('app_config', 3600, fn () => \App\Models\Configuracion::first()),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'last_sale' => session('last_sale_id') ? \App\Models\Venta::with([
                    'cliente:id,nombre,ruc_dni,direccion',
                    'user:id,name',
                    'detalles.producto:id,nombre,sku',
                    'detalles.unidad:id,nombre,abreviatura'
                ])->find(session('last_sale_id')) : null,
            ],
        ];
    }
}
