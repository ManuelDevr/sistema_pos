# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory.spec.mjs >> ⚖️  Ajustes - /inventario/ajustes >> 3.3 Búsqueda de producto en formulario de ajuste funciona
- Location: tests\playwright\inventory.spec.mjs:469:5

# Error details

```
Error: Campo Motivo debe aparecer

expect(locator).toBeVisible() failed

Locator: locator('input[placeholder*="Motivo"], input[placeholder*="motivo"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Campo Motivo debe aparecer with timeout 10000ms
  - waiting for locator('input[placeholder*="Motivo"], input[placeholder*="motivo"]').first()

```

```yaml
- complementary:
  - link "Logo CMA POS Ferretería":
    - /url: http://127.0.0.1:8000/dashboard
    - img "Logo"
    - heading "CMA POS" [level=1]
    - paragraph: Ferretería
  - navigation:
    - link "Inicio":
      - /url: http://127.0.0.1:8000/dashboard
    - link "Catálogo":
      - /url: http://127.0.0.1:8000/catalogo-productos
      - img
      - text: Catálogo
    - link "Venta Rápida":
      - /url: http://127.0.0.1:8000/venta-rapida
      - img
      - text: Venta Rápida
    - button "Inventario"
    - link "Gestión de Productos":
      - /url: http://127.0.0.1:8000/gestion-productos
    - link "Compras":
      - /url: http://127.0.0.1:8000/compras
    - link "Proveedores":
      - /url: http://127.0.0.1:8000/proveedores
    - link "Kardex":
      - /url: http://127.0.0.1:8000/inventario/kardex
    - link "Ajustes de Stock":
      - /url: http://127.0.0.1:8000/inventario/ajustes
    - link "Categorías y Marcas":
      - /url: http://127.0.0.1:8000/inventario/mantenimiento
    - button "Ventas"
    - link "Historial de Ventas":
      - /url: http://127.0.0.1:8000/gestion-ventas
    - link "Clientes":
      - /url: http://127.0.0.1:8000/gestion-clientes
      - img
      - text: Clientes
    - link "Cotizaciones":
      - /url: http://127.0.0.1:8000/cotizaciones
    - link "Notas de Crédito":
      - /url: http://127.0.0.1:8000/notas-credito
    - button "Contabilidad"
    - link "Reporte RVIE - Ventas":
      - /url: http://127.0.0.1:8000/reportes/rvie
    - link "Reporte RCE - Compras":
      - /url: http://127.0.0.1:8000/reportes/rce
    - button "Configuraciones"
    - link "Usuarios / Personal":
      - /url: http://127.0.0.1:8000/gestion-usuarios
      - img
      - text: Usuarios / Personal
    - link "Datos de Empresa":
      - /url: http://127.0.0.1:8000/configuracion
    - link "Sucursales":
      - /url: http://127.0.0.1:8000/sucursales
    - link "Privilegios":
      - /url: http://127.0.0.1:8000/configuracion/privilegios
  - button:
    - img
- banner:
  - heading "Sistema CMA" [level=1]
  - paragraph: Sistema de Gestión CMA
  - button "Notificaciones":
    - img
  - button "Carrito de Compras"
  - text: M
  - paragraph: Mirtha Almeyda Boza
  - paragraph: Administrador
  - button "Cerrar Sesión":
    - img
- main:
  - heading "Ajustes de Inventario" [level=1]
  - paragraph: Entradas y salidas manuales de stock
  - button "Cancelar"
  - heading "Registrar Ajuste Manual" [level=3]
  - textbox "Buscar producto por nombre o SKU..."
  - 'button "Amoladora Angular Bosch 4 1/2\"Stock: 254 Unidad"'
  - 'button "Cintas masking tape (1'''')Stock: 116 Unidad"'
  - 'button "Producto1Stock: 213 Unidad"'
  - 'button "Producto3Stock: 97 Unidad"'
  - 'button "Taladro Percutor Dewalt 20VStock: 47 Unidad"'
  - paragraph: Amoladora Angular Bosch 4 1/2"
  - paragraph: "Stock actual: 254 Unidad"
  - button "Cambiar"
  - button "Entrada"
  - button "Salida"
  - text: Cantidad
  - spinbutton
  - text: Motivo del Ajuste
  - 'textbox "Ej: Ajuste físico, merma, sobrante..."'
  - button "Cancelar"
  - button "Registrar Ajuste" [disabled]
  - heading "Historial de Ajustes" [level=3]
  - text: 3 registros
  - table:
    - rowgroup:
      - row "Fecha Producto Tipo Cantidad Stock Anterior Stock Actual Motivo Registrado por":
        - columnheader "Fecha"
        - columnheader "Producto"
        - columnheader "Tipo"
        - columnheader "Cantidad"
        - columnheader "Stock Anterior"
        - columnheader "Stock Actual"
        - columnheader "Motivo"
        - columnheader "Registrado por"
    - rowgroup:
      - row "09/07/2026 21:15 Amoladora Angular Bosch 4 1/2\" ENTRADA 10 244 254 rtyt Mirtha Almeyda Boza":
        - cell "09/07/2026 21:15"
        - cell "Amoladora Angular Bosch 4 1/2\""
        - cell "ENTRADA"
        - cell "10"
        - cell "244"
        - cell "254"
        - cell "rtyt"
        - cell "Mirtha Almeyda Boza"
      - row "09/07/2026 18:13 Amoladora Angular Bosch 4 1/2\" ENTRADA 100 144 244 ajuste Mirtha Almeyda Boza":
        - cell "09/07/2026 18:13"
        - cell "Amoladora Angular Bosch 4 1/2\""
        - cell "ENTRADA"
        - cell "100"
        - cell "144"
        - cell "244"
        - cell "ajuste"
        - cell "Mirtha Almeyda Boza"
      - row "09/07/2026 03:06 Producto3 SALIDA 3 100 97 merma Mirtha Almeyda Boza":
        - cell "09/07/2026 03:06"
        - cell "Producto3"
        - cell "SALIDA"
        - cell "3"
        - cell "100"
        - cell "97"
        - cell "merma"
        - cell "Mirtha Almeyda Boza"
- contentinfo: © 2026 Ferretería CMA - Sistema de Gestión
```

# Test source

```ts
  406 |             if (await cancelBtn.count() > 0) {
  407 |                 await cancelBtn.click();
  408 |                 await page.waitForTimeout(300);
  409 |                 await screenshot(page, '14-mantenimiento-categoria-form-closed');
  410 |             }
  411 |         } else {
  412 |             console.log('  ℹ️  No se encontró botón de nueva categoría');
  413 |         }
  414 | 
  415 |         await expect(page.locator('body')).toBeVisible();
  416 |     });
  417 | });
  418 | 
  419 | // ═══════════════════════════════════════════════════════════════
  420 | // TEST 3: AJUSTES DE INVENTARIO
  421 | // ═══════════════════════════════════════════════════════════════
  422 | test.describe('⚖️  Ajustes - /inventario/ajustes', () => {
  423 | 
  424 |     test('3.1 La página carga correctamente sin errores', async ({ page }) => {
  425 |         const errors = [];
  426 |         page.on('console', (msg) => {
  427 |             if (msg.type() === 'error' && !msg.text().includes('favicon')) {
  428 |                 errors.push(msg.text());
  429 |             }
  430 |         });
  431 |         page.on('crash', () => errors.push('PAGE CRASH DETECTED'));
  432 | 
  433 |         await page.goto('/inventario/ajustes');
  434 |         await waitForAppReady(page);
  435 |         await screenshot(page, '15-ajustes-initial');
  436 | 
  437 |         const title = await page.title();
  438 |         expect(title).not.toContain('500');
  439 |         expect(title).not.toContain('Error');
  440 |         await expect(page).toHaveTitle(/Ajustes|Inventario/i, { timeout: 8000 });
  441 | 
  442 |         const body = await page.locator('body').textContent();
  443 |         expect(body).toBeTruthy();
  444 | 
  445 |         if (errors.length > 0) {
  446 |             console.error('\n  ⚠️  Errores de consola detectados:');
  447 |             errors.forEach(e => console.error(`     → ${e}`));
  448 |         }
  449 |         expect(errors, `Errores de consola:\n${errors.join('\n')}`).toHaveLength(0);
  450 |     });
  451 | 
  452 |     test('3.2 Botón "Nuevo Ajuste" existe y abre el formulario', async ({ page }) => {
  453 |         await page.goto('/inventario/ajustes');
  454 |         await waitForAppReady(page);
  455 | 
  456 |         const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
  457 |         await expect(newAdjustmentBtn, 'El botón Nuevo Ajuste debe estar visible').toBeVisible({ timeout: 8000 });
  458 | 
  459 |         // Click para abrir formulario
  460 |         await newAdjustmentBtn.click();
  461 |         await page.waitForTimeout(500);
  462 |         await screenshot(page, '16-ajustes-form-open');
  463 | 
  464 |         // Verificar que el formulario aparece con campos esperados
  465 |         const searchInput = page.locator('input[placeholder*="Buscar producto"]').first();
  466 |         await expect(searchInput, 'El campo de búsqueda de producto debe aparecer').toBeVisible({ timeout: 5000 });
  467 |     });
  468 | 
  469 |     test('3.3 Búsqueda de producto en formulario de ajuste funciona', async ({ page }) => {
  470 |         await page.goto('/inventario/ajustes');
  471 |         await waitForAppReady(page);
  472 | 
  473 |         // Abrir formulario
  474 |         const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
  475 |         await newAdjustmentBtn.click();
  476 |         await page.waitForTimeout(500);
  477 | 
  478 |         // Buscar en el input de producto
  479 |         const searchInput = page.locator('input[placeholder*="Buscar producto"], input[placeholder*="nombre o SKU"]').first();
  480 |         
  481 |         if (await searchInput.count() > 0) {
  482 |             await searchInput.fill('a'); // Letra común para obtener resultados
  483 |             await page.waitForTimeout(400);
  484 |             await screenshot(page, '17-ajustes-product-search');
  485 | 
  486 |             const productButtons = page.locator('button[type="button"]').filter({ hasText: /Stock:/i });
  487 |             const count = await productButtons.count();
  488 |             console.log(`  ℹ️  Productos encontrados en búsqueda 'a': ${count}`);
  489 | 
  490 |             if (count > 0) {
  491 |                 // Seleccionar el primer producto
  492 |                 await productButtons.first().click();
  493 |                 await page.waitForTimeout(400);
  494 |                 await screenshot(page, '18-ajustes-product-selected');
  495 | 
  496 |                 // Verificar que aparecen los botones ENTRADA/SALIDA
  497 |                 const entradaBtn = page.locator('button', { hasText: /entrada/i }).first();
  498 |                 const salidaBtn = page.locator('button', { hasText: /salida/i }).first();
  499 |                 await expect(entradaBtn, 'Botón ENTRADA debe aparecer').toBeVisible();
  500 |                 await expect(salidaBtn, 'Botón SALIDA debe aparecer').toBeVisible();
  501 | 
  502 |                 // Verificar campo cantidad y motivo
  503 |                 const cantidadInput = page.locator('input[placeholder*="0.00"], input[type="number"]').first();
  504 |                 const motivoInput = page.locator('input[placeholder*="Motivo"], input[placeholder*="motivo"]').first();
  505 |                 await expect(cantidadInput, 'Campo Cantidad debe aparecer').toBeVisible();
> 506 |                 await expect(motivoInput, 'Campo Motivo debe aparecer').toBeVisible();
      |                                                                         ^ Error: Campo Motivo debe aparecer
  507 |             }
  508 |         }
  509 |     });
  510 | 
  511 |     test('3.4 Validación: submit sin datos muestra error (no crash)', async ({ page }) => {
  512 |         await page.goto('/inventario/ajustes');
  513 |         await waitForAppReady(page);
  514 | 
  515 |         // Abrir formulario
  516 |         const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
  517 |         await newAdjustmentBtn.click();
  518 |         await page.waitForTimeout(500);
  519 | 
  520 |         // Intentar enviar sin datos
  521 |         const submitBtn = page.locator('button[type="submit"]').first();
  522 |         if (await submitBtn.count() > 0) {
  523 |             const isDisabled = await submitBtn.isDisabled();
  524 |             console.log(`  ℹ️  Botón Submit deshabilitado sin datos: ${isDisabled}`);
  525 |             
  526 |             if (!isDisabled) {
  527 |                 await submitBtn.click();
  528 |                 await page.waitForTimeout(500);
  529 |                 await screenshot(page, '19-ajustes-submit-empty');
  530 |             }
  531 |         }
  532 | 
  533 |         // La página NO debe haberse crasheado
  534 |         await expect(page.locator('body')).toBeVisible();
  535 |         const title = await page.title();
  536 |         expect(title).not.toContain('500');
  537 |     });
  538 | 
  539 |     test('3.5 Formulario ENTRADA - llena todos los campos correctamente', async ({ page }) => {
  540 |         await page.goto('/inventario/ajustes');
  541 |         await waitForAppReady(page);
  542 | 
  543 |         // Abrir formulario
  544 |         const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
  545 |         await newAdjustmentBtn.click();
  546 |         await page.waitForTimeout(400);
  547 | 
  548 |         // Buscar y seleccionar primer producto disponible
  549 |         const searchInput = page.locator('input[placeholder*="Buscar producto"], input[placeholder*="nombre o SKU"]').first();
  550 |         if (await searchInput.count() === 0) {
  551 |             console.log('  ⚠️  Input de búsqueda no encontrado - skipping');
  552 |             return;
  553 |         }
  554 | 
  555 |         await searchInput.fill('a');
  556 |         await page.waitForTimeout(400);
  557 | 
  558 |         const productButtons = page.locator('button[type="button"]').filter({ hasText: /Stock:/i });
  559 |         if (await productButtons.count() === 0) {
  560 |             console.log('  ⚠️  No hay productos en la BD para testear - skipping');
  561 |             return;
  562 |         }
  563 | 
  564 |         await productButtons.first().click();
  565 |         await page.waitForTimeout(400);
  566 | 
  567 |         // Seleccionar tipo ENTRADA
  568 |         const entradaBtn = page.locator('button[type="button"]', { hasText: /entrada/i }).first();
  569 |         if (await entradaBtn.count() > 0) {
  570 |             await entradaBtn.click();
  571 |             await page.waitForTimeout(200);
  572 |         }
  573 | 
  574 |         // Llenar cantidad
  575 |         const cantidadInput = page.locator('input[type="number"]').first();
  576 |         if (await cantidadInput.count() > 0) {
  577 |             await cantidadInput.fill('5');
  578 |         }
  579 | 
  580 |         // Llenar motivo
  581 |         const motivoInput = page.locator('input[placeholder*="Motivo"], input[placeholder*="Ej:"]').first();
  582 |         if (await motivoInput.count() > 0) {
  583 |             await motivoInput.fill('Test Playwright - ajuste de prueba entrada');
  584 |         }
  585 | 
  586 |         await screenshot(page, '20-ajustes-form-filled-entrada');
  587 | 
  588 |         // Verificar que el botón submit está habilitado
  589 |         const submitBtn = page.locator('button[type="submit"]').first();
  590 |         if (await submitBtn.count() > 0) {
  591 |             const isEnabled = await submitBtn.isEnabled();
  592 |             console.log(`  ℹ️  Botón Submit habilitado con datos completos: ${isEnabled}`);
  593 |             expect(isEnabled, 'El botón Submit debe estar habilitado cuando todos los campos están llenos').toBeTruthy();
  594 |         }
  595 | 
  596 |         await expect(page.locator('body')).toBeVisible();
  597 |     });
  598 | 
  599 |     test('3.6 Tabla de historial de ajustes está presente', async ({ page }) => {
  600 |         await page.goto('/inventario/ajustes');
  601 |         await waitForAppReady(page);
  602 | 
  603 |         // Verificar historial de ajustes
  604 |         const historialSection = page.locator('text=/Historial de Ajustes/i').first();
  605 |         await expect(historialSection, 'Sección "Historial de Ajustes" debe estar visible').toBeVisible({ timeout: 8000 });
  606 | 
```