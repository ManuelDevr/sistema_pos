<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\KardexController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:ver_dashboard')
        ->name('dashboard');
    
    // POS / Ventas Rápidas
    Route::get('/venta-rapida', [SaleController::class, 'pos'])
        ->middleware('permission:realizar_ventas')
        ->name('venta-rapida');
    
    Route::post('/ventas', [SaleController::class, 'store'])
        ->middleware('permission:realizar_ventas')
        ->name('ventas.store');

    // Historial de Ventas
    Route::get('/mis-ventas', [SaleController::class, 'index'])
        ->middleware('permission:ver_historial_ventas')
        ->name('mis-ventas');
    
    Route::get('/gestion-ventas', [SaleController::class, 'index'])
        ->middleware('permission:ver_historial_ventas')
        ->name('gestion-ventas');

    Route::patch('/ventas/{venta}/cancel', [SaleController::class, 'cancel'])
        ->middleware('permission:anular_ventas')
        ->name('ventas.cancel');

    // Catálogo
    Route::get('/catalogo-productos', [ProductController::class, 'catalog'])
        ->middleware('permission:ver_catalogo')
        ->name('catalogo-productos');

    Route::get('/producto/{producto}', [ProductController::class, 'show'])
        ->middleware('permission:ver_catalogo')
        ->name('productos.show');

    // Kardex
    Route::get('/inventario/kardex', [KardexController::class, 'index'])
        ->middleware('permission:ver_kardex')
        ->name('kardex.index');

    // Mantenimiento de Inventario
    Route::get('/inventario/mantenimiento', [InventoryController::class, 'maintenance'])
        ->middleware('permission:gestionar_mantenimiento')
        ->name('inventory.maintenance');

    // Clientes
    Route::get('/gestion-clientes', [ClientController::class, 'index'])
        ->middleware('permission:gestionar_clientes')
        ->name('gestion-clientes');
    Route::get('/clientes/search', [ClientController::class, 'search'])->middleware('permission:realizar_ventas')->name('clientes.search');
    Route::post('/clientes', [ClientController::class, 'store'])->middleware('permission:gestionar_clientes')->name('clientes.store');
    Route::put('/clientes/{cliente}', [ClientController::class, 'update'])->middleware('permission:gestionar_clientes')->name('clientes.update');
    Route::patch('/clientes/{cliente}/toggle', [ClientController::class, 'toggleStatus'])->middleware('permission:gestionar_clientes')->name('clientes.toggle');

    // --- RUTAS DE ADMINISTRACIÓN ---
    Route::middleware(['admin'])->group(function () {
        
        // Productos e Inventario
        Route::get('/gestion-productos', [ProductController::class, 'index'])->middleware('permission:gestionar_productos')->name('gestion-productos');
        Route::post('/productos', [ProductController::class, 'store'])->middleware('permission:gestionar_productos')->name('productos.store');
        Route::put('/productos/{producto}', [ProductController::class, 'update'])->middleware('permission:gestionar_productos')->name('productos.update');
        Route::patch('/productos/{producto}/toggle', [ProductController::class, 'toggleStatus'])->middleware('permission:gestionar_productos')->name('productos.toggle');
        Route::post('/productos/{producto}/conversiones', [ProductController::class, 'storeConversion'])->middleware('permission:gestionar_productos')->name('productos.conversiones.store');
        Route::put('/conversiones/{conversion}', [ProductController::class, 'updateConversion'])->middleware('permission:gestionar_productos')->name('productos.conversiones.update');
        Route::patch('/conversiones/{conversion}/toggle', [ProductController::class, 'toggleStatusConversion'])->middleware('permission:gestionar_productos')->name('productos.conversiones.toggle');
        Route::delete('/conversiones/{conversion}', [ProductController::class, 'destroyConversion'])->middleware('permission:gestionar_productos')->name('productos.conversiones.destroy');

        // Mantenimiento
        Route::post('/marcas', [BrandController::class, 'store'])->middleware('permission:gestionar_mantenimiento')->name('marcas.store');
        Route::put('/marcas/{marca}', [BrandController::class, 'update'])->middleware('permission:gestionar_mantenimiento')->name('marcas.update');
        Route::patch('/marcas/{marca}/toggle', [BrandController::class, 'toggleStatus'])->middleware('permission:gestionar_mantenimiento')->name('marcas.toggle');
        Route::post('/categorias', [CategoryController::class, 'store'])->middleware('permission:gestionar_mantenimiento')->name('categorias.store');
        Route::put('/categorias/{categoria}', [CategoryController::class, 'update'])->middleware('permission:gestionar_mantenimiento')->name('categorias.update');
        Route::patch('/categorias/{categoria}/toggle', [CategoryController::class, 'toggleStatus'])->middleware('permission:gestionar_mantenimiento')->name('categorias.toggle');
        Route::post('/unidades', [UnitController::class, 'store'])->middleware('permission:gestionar_mantenimiento')->name('unidades.store');
        Route::put('/unidades/{unidad}', [UnitController::class, 'update'])->middleware('permission:gestionar_mantenimiento')->name('unidades.update');
        Route::patch('/unidades/{unidad}/toggle', [UnitController::class, 'toggleStatus'])->middleware('permission:gestionar_mantenimiento')->name('unidades.toggle');

        // Usuarios
        Route::get('/gestion-usuarios', [UserController::class, 'index'])->middleware('permission:gestionar_usuarios')->name('gestion-usuarios');
        Route::post('/usuarios', [UserController::class, 'store'])->middleware('permission:gestionar_usuarios')->name('usuarios.store');
        Route::put('/usuarios/{user}', [UserController::class, 'update'])->middleware('permission:gestionar_usuarios')->name('usuarios.update');
        Route::patch('/usuarios/{user}/toggle', [UserController::class, 'toggleStatus'])->middleware('permission:gestionar_usuarios')->name('usuarios.toggle');
        
        // Configuración y Privilegios
        Route::get('/configuracion', [SettingController::class, 'index'])->middleware('permission:configuracion_sistema')->name('configuracion');
        Route::post('/configuracion', [SettingController::class, 'update'])->middleware('permission:configuracion_sistema')->name('configuracion.update');
        
        Route::get('/configuracion/privilegios', [PermissionController::class, 'index'])->middleware('permission:configurar_privilegios')->name('privilegios.index');
        Route::post('/configuracion/privilegios', [PermissionController::class, 'update'])->middleware('permission:configurar_privilegios')->name('privilegios.update');
    });

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
