<?php

namespace Tests\Feature\Products;

use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use RefreshDatabase;

    private function setupPermissions(): void
    {
        DB::table('permisos_roles')->insert([
            'rol' => 'Administrador',
            'permiso' => 'gestionar_productos',
            'permitido' => true,
        ]);
    }

    private function createAdminUser(): User
    {
        return User::factory()->create([
            'rol' => 'Administrador',
        ]);
    }

    public function test_can_create_product(): void
    {
        $this->setupPermissions();
        $user = $this->createAdminUser();
        $this->actingAs($user);

        $categoria = Categoria::factory()->create();
        $marca = Marca::factory()->create();

        $payload = [
            'nombre' => 'Martillo Pro',
            'sku' => 'MART-001',
            'precio_compra' => 10.50,
            'precio_venta' => 18.99,
            'stock' => 100,
            'stock_minimo' => 10,
            'categoria_id' => $categoria->id,
            'marca_id' => $marca->id,
            'unidad_medida' => 'Unidad',
        ];

        $response = $this->postJson(route('productos.store'), $payload);

        $response->assertStatus(302);

        $this->assertDatabaseHas('productos', [
            'nombre' => 'Martillo Pro',
            'sku' => 'MART-001',
            'precio_venta' => 18.99,
        ]);
    }

    public function test_cannot_create_product_without_required_fields(): void
    {
        $this->setupPermissions();
        $user = $this->createAdminUser();
        $this->actingAs($user);

        $response = $this->postJson(route('productos.store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['nombre']);
    }

    public function test_can_update_product(): void
    {
        $this->setupPermissions();
        $user = $this->createAdminUser();
        $this->actingAs($user);

        $categoria = Categoria::factory()->create();
        $producto = Producto::factory()->create([
            'categoria_id' => $categoria->id,
        ]);

        $payload = [
            'nombre' => 'Martillo Pro Actualizado',
            'precio_compra' => 10.50,
            'precio_venta' => 25.00,
            'stock' => 50,
            'stock_minimo' => 10,
            'estado' => 'Activo',
            'categoria_id' => $categoria->id,
            'unidad_medida' => 'Unidad',
        ];

        $response = $this->putJson(route('productos.update', $producto->id), $payload);

        $response->assertStatus(302);

        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'nombre' => 'Martillo Pro Actualizado',
            'precio_venta' => 25.00,
            'stock' => 50,
        ]);
    }

    public function test_can_toggle_product_status(): void
    {
        $this->setupPermissions();
        $user = $this->createAdminUser();
        $this->actingAs($user);

        $producto = Producto::factory()->create(['estado' => 'Activo']);

        $response = $this->patchJson(route('productos.toggle', $producto->id));

        $response->assertStatus(302);

        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'estado' => 'Inactivo',
        ]);

        $response = $this->patchJson(route('productos.toggle', $producto->id));

        $response->assertStatus(302);

        $this->assertDatabaseHas('productos', [
            'id' => $producto->id,
            'estado' => 'Activo',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_products(): void
    {
        $response = $this->postJson(route('productos.store'), []);

        $response->assertStatus(401);
    }
}
