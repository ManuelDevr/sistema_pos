<?php

namespace Tests\Feature\Inventory;

use App\Models\Kardex;
use App\Models\Producto;
use App\Models\User;
use App\Services\KardexService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KardexTest extends TestCase
{
    use RefreshDatabase;

    public function test_entrada_increases_stock(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $producto = Producto::factory()->create(['stock' => 10]);

        KardexService::registrarMovimiento(
            $producto,
            'ENTRADA',
            5,
            'Compra de mercadería'
        );

        $this->assertEquals(15, $producto->fresh()->stock);
    }

    public function test_salida_decreases_stock(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $producto = Producto::factory()->create(['stock' => 10]);

        KardexService::registrarMovimiento(
            $producto,
            'SALIDA',
            3,
            'Venta de mercadería'
        );

        $this->assertEquals(7, $producto->fresh()->stock);
    }

    public function test_kardex_record_created_with_correct_fields(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $producto = Producto::factory()->create(['stock' => 10]);

        $kardex = KardexService::registrarMovimiento(
            $producto,
            'ENTRADA',
            5,
            'Compra de mercadería',
            'ORDEN_COMPRA',
            42
        );

        $this->assertDatabaseHas('kardex', [
            'producto_id' => $producto->id,
            'tipo_movimiento' => 'ENTRADA',
            'motivo' => 'Compra de mercadería',
            'cantidad' => 5,
            'stock_anterior' => 10,
            'stock_actual' => 15,
            'referencia_tipo' => 'ORDEN_COMPRA',
            'referencia_id' => 42,
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseCount('kardex', 1);
    }

    public function test_multiple_movements_update_stock_correctly(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $producto = Producto::factory()->create(['stock' => 10]);

        KardexService::registrarMovimiento(
            $producto,
            'ENTRADA',
            5,
            'Compra de mercadería'
        );

        $this->assertEquals(15, $producto->fresh()->stock);

        KardexService::registrarMovimiento(
            $producto,
            'SALIDA',
            3,
            'Venta de mercadería'
        );

        $this->assertEquals(12, $producto->fresh()->stock);
        $this->assertDatabaseCount('kardex', 2);
    }
}
