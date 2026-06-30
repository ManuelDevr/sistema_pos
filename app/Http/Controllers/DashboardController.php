<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $today = Carbon::today();

        // Datos básicos para todos los usuarios
        $data = [
            'stats' => [
                'ventasDelDia' => 0,
                'numeroDeVentas' => 0,
                'productosVendidos' => 0,
                'ventasSemanales' => []
            ]
        ];

        // Solo si es Administrador se cargan las métricas financieras
        if ($user->rol === 'Administrador') {
            $ventasDelDia = Venta::whereDate('created_at', $today)->where('estado', 'Pagado')->sum('total');
            $numeroDeVentas = Venta::whereDate('created_at', $today)->where('estado', 'Pagado')->count();
            $productosVendidos = DetalleVenta::whereHas('venta', function($query) use ($today) {
                $query->whereDate('created_at', $today)->where('estado', 'Pagado');
            })->sum('cantidad');

            // Una sola query agrupada en vez de 7 queries en loop
            $desde = Carbon::today()->subDays(6)->startOfDay();
            $ventasAgrupadas = Venta::selectRaw('DATE(created_at) as dia, SUM(total) as total')
                ->where('estado', 'Pagado')
                ->whereBetween('created_at', [$desde, Carbon::now()])
                ->groupBy('dia')
                ->pluck('total', 'dia');

            // Rellenar los 7 días (incluyendo días sin ventas con 0)
            $ventasSemanales = [];
            for ($i = 6; $i >= 0; $i--) {
                $fecha = Carbon::today()->subDays($i)->toDateString();
                $ventasSemanales[] = [
                    'dia'   => $fecha,
                    'total' => (float) ($ventasAgrupadas[$fecha] ?? 0),
                ];
            }

            $data['stats'] = [
                'ventasDelDia' => (float)$ventasDelDia,
                'numeroDeVentas' => $numeroDeVentas,
                'productosVendidos' => (int)$productosVendidos,
                'ventasSemanales' => $ventasSemanales
            ];
        }

        return Inertia::render('Dashboard', $data);
    }
}
