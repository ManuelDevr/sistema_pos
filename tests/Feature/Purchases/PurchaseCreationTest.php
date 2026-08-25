<?php

namespace Tests\Feature\Purchases;

use App\Models\Compra;
use App\Models\Configuracion;
use App\Models\DetalleCompra;
use App\Models\Kardex;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PurchaseCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        DB::table('permisos_roles')->insert([
            'rol' => 'Administrador',
            'permiso' => 'gestionar_productos',
            'permitido' => true,
        ]);

        $this->user = User::factory()->create(['rol' => 'Administrador']);
        $this->actingAs($this->user);

        Configuracion::create(['igv' => 18]);

        $this->producto = Producto::create([
            'nombre' => 'Tornillo 1"',
            'descripcion' => 'Tornillo de prueba',
            'precio_compra' => 4.00,
            'precio_venta' => 6.00,
            'stock' => 50,
            'stock_minimo' => 10,
            'unidad_medida' => 'pieza',
            'categoria_id' => null,
        ]);

        $this->payload = [
            'proveedor' => 'Test Provider',
            'ruc_dni' => '12345678901',
            'tipo_comprobante' => 'Boleta',
            'items' => [
                [
                    'producto_id' => $this->producto->id,
                    'cantidad' => 10,
                    'precio_compra' => 5.00,
                ],
            ],
        ];
    }

    public function test_can_create_purchase_and_increase_stock(): void
    {
        $this->postJson(route('compras.store'), $this->payload)->assertStatus(302);

        $this->producto->refresh();
        $this->assertEquals(60, $this->producto->stock);
    }

    public function test_purchase_creates_kardex_entrada_record(): void
    {
        $this->postJson(route('compras.store'), $this->payload)->assertStatus(302);

        $compra = Compra::latest()->first();
        $kardex = Kardex::where('producto_id', $this->producto->id)->first();

        $this->assertNotNull($kardex);
        $this->assertEquals('ENTRADA', $kardex->tipo_movimiento);
        $this->assertEquals("Compra {$compra->nro_comprobante}", $kardex->motivo);
        $this->assertEquals(10, $kardex->cantidad);
        $this->assertEquals(50, $kardex->stock_anterior);
        $this->assertEquals(60, $kardex->stock_actual);
        $this->assertEquals('COMPRA', $kardex->referencia_tipo);
        $this->assertEquals($compra->id, $kardex->referencia_id);
        $this->assertEquals($this->user->id, $kardex->user_id);
    }

    public function test_purchase_creates_compra_and_detalle_records(): void
    {
        $this->postJson(route('compras.store'), $this->payload)->assertStatus(302);

        $compra = Compra::latest()->first();
        $this->assertEquals('Test Provider', $compra->proveedor);
        $this->assertEquals('Boleta', $compra->tipo_comprobante);
        $this->assertEquals(50.00, $compra->subtotal);
        $this->assertEquals(9.00, $compra->igv);
        $this->assertEquals(59.00, $compra->total);
        $this->assertEquals($this->user->id, $compra->user_id);
        $this->assertMatchesRegularExpression('/^C\d{6}$/', $compra->nro_comprobante);

        $detalle = DetalleCompra::where('compra_id', $compra->id)->first();
        $this->assertNotNull($detalle);
        $this->assertEquals($this->producto->id, $detalle->producto_id);
        $this->assertEquals(10, $detalle->cantidad);
        $this->assertEquals(5.00, $detalle->precio_compra);
        $this->assertEquals(50.00, $detalle->subtotal);
    }

    public function test_cannot_create_purchase_without_items(): void
    {
        $payload = [
            'proveedor' => 'Test Provider',
            'tipo_comprobante' => 'Boleta',
            'items' => [],
        ];

        $this->postJson(route('compras.store'), $payload)->assertStatus(422);
    }
}
