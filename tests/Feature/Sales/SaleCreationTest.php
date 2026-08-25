<?php

namespace Tests\Feature\Sales;

use App\Models\Producto;
use App\Models\Venta;
use App\Models\Configuracion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SaleCreationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('permisos_roles')->insert([
            ['rol' => 'Administrador', 'permiso' => 'realizar_ventas', 'permitido' => true],
            ['rol' => 'Administrador', 'permiso' => 'anular_ventas', 'permitido' => true],
            ['rol' => 'Administrador', 'permiso' => 'gestionar_productos', 'permitido' => true],
        ]);

        Configuracion::create([
            'igv' => 18.00,
            'metodos_pago' => ['Efectivo', 'Yape', 'BCP', 'Plin'],
            'ruc' => '12345678901',
            'nombre_empresa' => 'Ferreteria CMA',
        ]);

        $this->user = User::factory()->create(['rol' => 'Administrador']);
        $this->actingAs($this->user);
    }

    private function createProduct(array $overrides = []): Producto
    {
        return Producto::create(array_merge([
            'nombre' => fake()->words(2, true),
            'sku' => fake()->unique()->bothify('SKU-####'),
            'descripcion' => fake()->sentence(),
            'stock' => 50.0000,
            'stock_minimo' => 5.0000,
            'precio_compra' => 10.00,
            'precio_venta' => 20.00,
            'margen_ganancia' => 50.00,
            'unidad_medida' => 'Unidad',
            'tasa_descuento' => 0,
            'estado' => 'Activo',
            'categoria_id' => null,
            'marca_id' => null,
        ], $overrides));
    }

    private function makeSalePayload(Producto $producto, int $cantidad = 1): array
    {
        return [
            'total' => round($cantidad * (float) $producto->precio_venta, 2),
            'metodo_pago' => 'Efectivo',
            'items' => [
                [
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'unidad_id' => null,
                    'precio_unitario' => (float) $producto->precio_venta,
                ],
            ],
        ];
    }

    public function test_sale_creation_reduces_stock(): void
    {
        $producto = $this->createProduct(['stock' => 50.0000]);

        $payload = $this->makeSalePayload($producto, 10);

        $this->postJson(route('ventas.store'), $payload)
            ->assertRedirect();

        $producto->refresh();
        $this->assertEquals(40.0000, $producto->stock);
    }

    public function test_sale_creation_creates_kardex_movement(): void
    {
        $producto = $this->createProduct(['stock' => 50.0000]);

        $payload = $this->makeSalePayload($producto, 10);

        $this->postJson(route('ventas.store'), $payload)
            ->assertRedirect();

        $venta = Venta::latest()->first();

        $this->assertDatabaseHas('kardex', [
            'producto_id' => $producto->id,
            'tipo_movimiento' => 'SALIDA',
            'cantidad' => 10.0000,
            'stock_anterior' => 50.0000,
            'stock_actual' => 40.0000,
            'referencia_tipo' => 'Venta',
            'referencia_id' => $venta->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_sale_cancellation_restores_stock(): void
    {
        $producto = $this->createProduct(['stock' => 50.0000]);

        $payload = $this->makeSalePayload($producto, 10);

        $this->postJson(route('ventas.store'), $payload)
            ->assertRedirect();

        $venta = Venta::latest()->first();

        $this->patchJson(route('ventas.cancel', $venta->id))
            ->assertRedirect();

        $producto->refresh();
        $this->assertEquals(50.0000, $producto->stock);
    }

    public function test_sale_cancellation_creates_kardex_entrada(): void
    {
        $producto = $this->createProduct(['stock' => 50.0000]);

        $payload = $this->makeSalePayload($producto, 10);

        $this->postJson(route('ventas.store'), $payload)
            ->assertRedirect();

        $venta = Venta::latest()->first();

        $this->patchJson(route('ventas.cancel', $venta->id))
            ->assertRedirect();

        $this->assertDatabaseHas('kardex', [
            'producto_id' => $producto->id,
            'tipo_movimiento' => 'ENTRADA',
            'cantidad' => 10.0000,
            'stock_anterior' => 40.0000,
            'stock_actual' => 50.0000,
            'motivo' => 'Anulación Venta: ' . $venta->nro_comprobante,
            'referencia_tipo' => 'Venta',
            'referencia_id' => $venta->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_sale_insufficient_stock_returns_error(): void
    {
        $producto = $this->createProduct(['stock' => 5.0000]);

        $payload = $this->makeSalePayload($producto, 10);

        $this->postJson(route('ventas.store'), $payload)
            ->assertStatus(302);

        $producto->refresh();
        $this->assertEquals(5.0000, $producto->stock);

        $this->assertDatabaseCount('ventas', 0);
    }
}
