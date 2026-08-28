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
                        ->orderBy('stock', 'asc')
                        ->take(15)
                        ->get()
                        ->map(function($p) {
                            $type = $p->stock <= 0 ? 'danger' : 'warning';
                            $title = $p->stock <= 0 ? 'Sin Stock' : 'Stock Bajo';
                            return [
                                'id'      => $p->id,
                                'type'    => $type,
                                'title'   => $title,
                                'message' => "El producto {$p->nombre} tiene solo " . (int)$p->stock . " unidades.",
                            ];
                        })
                        ->values()
                  )
                : [],
            'config' => Cache::remember('app_config', 3600, fn () => \App\Models\Configuracion::first()),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'last_sale' => session('last_sale_id') ? \App\Models\Venta::select('id', 'serie', 'numero', 'tipo_comprobante', 'total', 'cliente_id', 'created_at')
                    ->with([
                        'cliente:id,nombre,ruc_dni,direccion',
                        'user:id,name',
                        'detalles:id,venta_id,producto_id,unidad_id,cantidad,precio_unitario,subtotal',
                        'detalles.producto:id,nombre,sku',
                        'detalles.unidad:id,nombre,abreviatura'
                    ])->find(session('last_sale_id')) : null,
            ],
        ];
    }
}
