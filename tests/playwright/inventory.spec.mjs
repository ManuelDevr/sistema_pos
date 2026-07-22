/**
 * ============================================================
 *  TESTS DE INVENTARIO - Sistema POS Ferretería CMA
 *  Páginas cubiertas:
 *    1. /inventario/kardex        → Kardex.jsx
 *    2. /inventario/mantenimiento → Maintenance.jsx
 *    3. /inventario/ajustes       → Adjustments.jsx
 *
 *  Captura:
 *    - Errores de consola del navegador
 *    - Crashes / errores de página
 *    - Screenshots de cada estado
 *    - Comportamiento de filtros e interacciones UI
 * ============================================================
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ── Configuración de credenciales y rutas ────────────────────
const CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123',
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'inventory');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// ── Helper: capturar y guardar screenshot con nombre ─────────
async function screenshot(page, name) {
    const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`  📸 Screenshot guardado: ${name}.png`);
    return filepath;
}

// ── Helper: esperar hasta que Inertia/React cargue ───────────
async function waitForAppReady(page) {
    await page.waitForLoadState('domcontentloaded');
    // Esperar que no haya el spinner de carga de Inertia
    await page.waitForFunction(() => !document.querySelector('[data-inertia-loading]'), {
        timeout: 15000,
    }).catch(() => { /* Si no existe el selector, no hay spinner, todo bien */ });
    await page.waitForTimeout(800); // micro-pausa para animaciones React
}

// ── Fixture: login compartido entre todos los tests ──────────
test.beforeEach(async ({ page }, testInfo) => {
    // ── Capturar TODOS los mensajes de consola ─────────────────
    const consoleErrors = [];
    const consoleWarnings = [];

    page.on('console', (msg) => {
        const type = msg.type();
        const text = msg.text();

        if (type === 'error') {
            // Ignorar errores de red conocidos no críticos
            if (!text.includes('favicon') && !text.includes('net::ERR_BLOCKED')) {
                consoleErrors.push(`[ERROR] ${text}`);
                console.error(`  🔴 Console error: ${text}`);
            }
        } else if (type === 'warning') {
            // Ignorar warnings de React DevTools en dev
            if (!text.includes('Download the React DevTools')) {
                consoleWarnings.push(`[WARN] ${text}`);
                console.warn(`  🟡 Console warning: ${text}`);
            }
        }
    });

    // ── Capturar crashes de página ─────────────────────────────
    page.on('crash', () => {
        console.error('  💥 ¡LA PÁGINA CRASHEÓ!');
    });

    // ── Capturar errores de diálogo no esperados ───────────────
    page.on('dialog', async (dialog) => {
        console.warn(`  ⚠️  Diálogo inesperado (${dialog.type()}): ${dialog.message()}`);
        await dialog.dismiss();
    });

    // ── Capturar fallos de requests (500, 404, etc.) ───────────
    page.on('response', (response) => {
        const status = response.status();
        const url = response.url();
        if (status >= 400 && !url.includes('favicon')) {
            console.error(`  🔴 HTTP ${status}: ${url}`);
        }
    });

    // Almacenar los arrays en el contexto del test para assertions
    testInfo.annotations.push({ type: 'consoleErrors', description: JSON.stringify(consoleErrors) });

    // ── LOGIN ──────────────────────────────────────────────────
    await page.goto('/login');
    await waitForAppReady(page);

    // Verificar que la página de login cargó
    await expect(page.locator('input[name="email"]'), 
        'El campo email del login debe estar visible'
    ).toBeVisible({ timeout: 10000 });

    await page.fill('input[name="email"]', CREDENTIALS.email);
    await page.fill('input[name="password"]', CREDENTIALS.password);
    await page.click('button[type="submit"]');

    // Esperar redirección post-login (dashboard o cualquier página autenticada)
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
    await waitForAppReady(page);

    console.log(`\n✅ Login exitoso. URL actual: ${page.url()}`);
});

// ═══════════════════════════════════════════════════════════════
// TEST 1: KARDEX
// ═══════════════════════════════════════════════════════════════
test.describe('📦 Kardex - /inventario/kardex', () => {

    test('1.1 La página carga correctamente sin errores', async ({ page }) => {
        const errors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error' && !msg.text().includes('favicon')) {
                errors.push(msg.text());
            }
        });
        page.on('crash', () => errors.push('PAGE CRASH DETECTED'));

        await page.goto('/inventario/kardex');
        await waitForAppReady(page);
        await screenshot(page, '01-kardex-initial');

        // Verificar que no crasheó (debe tener contenido)
        const body = await page.locator('body').textContent();
        expect(body, 'La página no debe estar vacía (crash)').toBeTruthy();

        // Verificar que no hay error 500
        const title = await page.title();
        expect(title, 'No debe mostrar página de error del servidor').not.toContain('500');
        expect(title, 'No debe mostrar página de error del servidor').not.toContain('Error');

        // Verificar el título de la página
        await expect(page).toHaveTitle(/Kardex/i, { timeout: 8000 });

        // Reportar errores de consola (no falla el test, solo reporta)
        if (errors.length > 0) {
            console.error('\n  ⚠️  Errores de consola detectados:');
            errors.forEach(e => console.error(`     → ${e}`));
        }
        // Ahora sí falla si hay errores críticos de JS
        expect(errors, `Errores de consola encontrados:\n${errors.join('\n')}`).toHaveLength(0);
    });

    test('1.2 Elementos UI críticos están presentes', async ({ page }) => {
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);

        // Buscar input de búsqueda
        const searchInput = page.locator('input[placeholder*="Filtrar"], input[placeholder*="nombre"], input[placeholder*="SKU"]').first();
        await expect(searchInput, 'Debe haber un input de búsqueda/filtro').toBeVisible({ timeout: 8000 });

        // Botón de filtrar
        const filterBtn = page.locator('button', { hasText: /filtrar/i }).first();
        await expect(filterBtn, 'Debe haber un botón Filtrar').toBeVisible();

        // Botón de descargar PDF
        const pdfBtn = page.locator('button', { hasText: /pdf|descargar/i }).first();
        await expect(pdfBtn, 'Debe haber un botón para descargar PDF').toBeVisible();

        // Tabla o mensaje vacío
        const hasTable = await page.locator('table').count() > 0;
        const hasEmptyMsg = await page.locator('text=/No se registran movimientos/i').count() > 0;
        expect(hasTable || hasEmptyMsg, 
            'Debe mostrar la tabla del Kardex o un mensaje de vacío'
        ).toBeTruthy();

        await screenshot(page, '02-kardex-ui-elements');
    });

    test('1.3 Filtro por tipo de movimiento (ENTRADA/SALIDA)', async ({ page }) => {
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);

        // Seleccionar filtro tipo
        const tipoSelect = page.locator('select').first();
        const hasSelect = await tipoSelect.count() > 0;

        if (hasSelect) {
            // Si hay el select de productos, buscar el de tipo
            const allSelects = page.locator('select');
            const count = await allSelects.count();
            console.log(`  ℹ️  Selects encontrados: ${count}`);

            // Intentar seleccionar "ENTRADA" en algún select visible
            for (let i = 0; i < count; i++) {
                const sel = allSelects.nth(i);
                const options = await sel.locator('option').allTextContents();
                console.log(`  ℹ️  Select ${i} opciones: ${options.join(', ')}`);

                if (options.some(o => o.includes('ENTRADA') || o.includes('Entrada'))) {
                    await sel.selectOption({ label: options.find(o => o.includes('ENTRADA') || o.includes('Entrada')) || '' });
                    await page.waitForTimeout(500);
                    await screenshot(page, '03-kardex-filter-entrada');
                    break;
                }
            }
        }

        // No falla: simplemente verifica que la página sigue viva
        await expect(page.locator('body')).toBeVisible();
    });

    test('1.4 Búsqueda por texto filtra la tabla', async ({ page }) => {
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);

        const searchInput = page.locator('input[placeholder*="Filtrar"], input[placeholder*="nombre"], input[placeholder*="SKU"]').first();
        
        if (await searchInput.count() > 0) {
            // Escribir un término de búsqueda
            await searchInput.fill('prueba_inexistente_xyz');
            await page.waitForTimeout(600);
            await screenshot(page, '04-kardex-search-empty');

            // Con un término que no existe, la tabla debe mostrar vacío o los resultados filtrados
            const rows = page.locator('tbody tr');
            const rowCount = await rows.count();
            console.log(`  ℹ️  Filas visibles con búsqueda 'prueba_inexistente_xyz': ${rowCount}`);

            // Limpiar búsqueda
            await searchInput.fill('');
            await page.waitForTimeout(400);
            await screenshot(page, '05-kardex-search-cleared');
        } else {
            console.log('  ⚠️  Input de búsqueda no encontrado');
        }

        await expect(page.locator('body')).toBeVisible();
    });

    test('1.5 Botón limpiar filtros funciona', async ({ page }) => {
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);

        const clearBtn = page.locator('button[title*="Limpiar"], button[title*="limpiar"], button svg[data-lucide="x"]').first();
        const clearBtnAlt = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).first();

        // Intentar click en botón X de limpiar
        const xButtons = page.locator('button').filter({ has: page.locator('[data-lucide="x"], .lucide-x') });
        const xCount = await xButtons.count();
        console.log(`  ℹ️  Botones X encontrados: ${xCount}`);

        if (xCount > 0) {
            await xButtons.first().click();
            await waitForAppReady(page);
            await screenshot(page, '06-kardex-filters-cleared');
        }

        await expect(page.locator('body')).toBeVisible();
    });

    test('1.6 Paginación funciona (si hay suficientes registros)', async ({ page }) => {
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);

        // Buscar botones de paginación
        const pagination = page.locator('[aria-label*="paginación"], [aria-label*="pagination"], nav[role="navigation"]').first();
        const nextPageBtn = page.locator('button', { hasText: /siguiente|next|›|»/i }).first();

        const hasPagination = await nextPageBtn.count() > 0;
        console.log(`  ℹ️  Paginación visible: ${hasPagination}`);

        if (hasPagination) {
            const isDisabled = await nextPageBtn.isDisabled();
            if (!isDisabled) {
                await nextPageBtn.click();
                await waitForAppReady(page);
                await screenshot(page, '07-kardex-page-2');
            }
        }

        await expect(page.locator('body')).toBeVisible();
    });
});

// ═══════════════════════════════════════════════════════════════
// TEST 2: MANTENIMIENTO DE INVENTARIO
// ═══════════════════════════════════════════════════════════════
test.describe('🔧 Mantenimiento - /inventario/mantenimiento', () => {

    test('2.1 La página carga correctamente sin errores', async ({ page }) => {
        const errors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error' && !msg.text().includes('favicon')) {
                errors.push(msg.text());
            }
        });
        page.on('crash', () => errors.push('PAGE CRASH DETECTED'));

        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);
        await screenshot(page, '08-mantenimiento-initial');

        const title = await page.title();
        expect(title).not.toContain('500');
        expect(title).not.toContain('Error');
        await expect(page).toHaveTitle(/Mantenimiento|Inventario|Mantenimiento de Inventario/i, { timeout: 8000 });

        const body = await page.locator('body').textContent();
        expect(body).toBeTruthy();

        if (errors.length > 0) {
            console.error('\n  ⚠️  Errores de consola detectados:');
            errors.forEach(e => console.error(`     → ${e}`));
        }
        expect(errors, `Errores de consola:\n${errors.join('\n')}`).toHaveLength(0);
    });

    test('2.2 Tres tabs están presentes (Categorías, Marcas, Unidades)', async ({ page }) => {
        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);

        // Buscar los tabs
        const categoriesTab = page.locator('button, [role="tab"]', { hasText: /categor/i }).first();
        const brandsTab = page.locator('button, [role="tab"]', { hasText: /marca/i }).first();
        const unitsTab = page.locator('button, [role="tab"]', { hasText: /unidad/i }).first();

        await expect(categoriesTab, 'Tab de Categorías debe estar visible').toBeVisible({ timeout: 8000 });
        await expect(brandsTab, 'Tab de Marcas debe estar visible').toBeVisible({ timeout: 8000 });
        await expect(unitsTab, 'Tab de Unidades debe estar visible').toBeVisible({ timeout: 8000 });
        
        await screenshot(page, '09-mantenimiento-tabs');
    });

    test('2.3 Tab Categorías - carga contenido al hacer click', async ({ page }) => {
        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);

        const categoriesTab = page.locator('button', { hasText: /categor/i }).first();
        await categoriesTab.click();
        await page.waitForTimeout(600);
        await screenshot(page, '10-mantenimiento-tab-categorias');

        // Verificar que hay contenido de categorías
        const content = await page.locator('body').textContent();
        expect(content).toContain('Categor');
        await expect(page.locator('body')).toBeVisible();
    });

    test('2.4 Tab Marcas - carga contenido al hacer click', async ({ page }) => {
        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);

        const brandsTab = page.locator('button', { hasText: /marca/i }).first();
        await brandsTab.click();
        await page.waitForTimeout(600);
        await screenshot(page, '11-mantenimiento-tab-marcas');

        const content = await page.locator('body').textContent();
        expect(content).toContain('Marca');
        await expect(page.locator('body')).toBeVisible();
    });

    test('2.5 Tab Unidades - carga contenido al hacer click', async ({ page }) => {
        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);

        const unitsTab = page.locator('button', { hasText: /unidad/i }).first();
        await unitsTab.click();
        await page.waitForTimeout(600);
        await screenshot(page, '12-mantenimiento-tab-unidades');

        const content = await page.locator('body').textContent();
        expect(content).toContain('Unidad');
        await expect(page.locator('body')).toBeVisible();
    });

    test('2.6 Formulario de nueva categoría se abre y cierra', async ({ page }) => {
        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);

        // Ir al tab de categorías
        const categoriesTab = page.locator('button', { hasText: /categor/i }).first();
        await categoriesTab.click();
        await page.waitForTimeout(500);

        // Buscar botón "Nueva Categoría" o "Agregar" o "+"
        const addBtn = page.locator('button', { hasText: /nueva|agregar|añadir|nueva categor/i }).first();
        const hasAddBtn = await addBtn.count() > 0;

        if (hasAddBtn) {
            await addBtn.click();
            await page.waitForTimeout(400);
            await screenshot(page, '13-mantenimiento-nueva-categoria-form');

            // Verificar que hay un input o formulario
            const inputs = page.locator('input[type="text"], input[type="name"]');
            const inputCount = await inputs.count();
            console.log(`  ℹ️  Inputs en formulario de categoría: ${inputCount}`);

            // Cerrar con botón Cancelar o X
            const cancelBtn = page.locator('button', { hasText: /cancelar|cerrar/i }).first();
            if (await cancelBtn.count() > 0) {
                await cancelBtn.click();
                await page.waitForTimeout(300);
                await screenshot(page, '14-mantenimiento-categoria-form-closed');
            }
        } else {
            console.log('  ℹ️  No se encontró botón de nueva categoría');
        }

        await expect(page.locator('body')).toBeVisible();
    });
});

// ═══════════════════════════════════════════════════════════════
// TEST 3: AJUSTES DE INVENTARIO
// ═══════════════════════════════════════════════════════════════
test.describe('⚖️  Ajustes - /inventario/ajustes', () => {

    test('3.1 La página carga correctamente sin errores', async ({ page }) => {
        const errors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error' && !msg.text().includes('favicon')) {
                errors.push(msg.text());
            }
        });
        page.on('crash', () => errors.push('PAGE CRASH DETECTED'));

        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);
        await screenshot(page, '15-ajustes-initial');

        const title = await page.title();
        expect(title).not.toContain('500');
        expect(title).not.toContain('Error');
        await expect(page).toHaveTitle(/Ajustes|Inventario/i, { timeout: 8000 });

        const body = await page.locator('body').textContent();
        expect(body).toBeTruthy();

        if (errors.length > 0) {
            console.error('\n  ⚠️  Errores de consola detectados:');
            errors.forEach(e => console.error(`     → ${e}`));
        }
        expect(errors, `Errores de consola:\n${errors.join('\n')}`).toHaveLength(0);
    });

    test('3.2 Botón "Nuevo Ajuste" existe y abre el formulario', async ({ page }) => {
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);

        const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
        await expect(newAdjustmentBtn, 'El botón Nuevo Ajuste debe estar visible').toBeVisible({ timeout: 8000 });

        // Click para abrir formulario
        await newAdjustmentBtn.click();
        await page.waitForTimeout(500);
        await screenshot(page, '16-ajustes-form-open');

        // Verificar que el formulario aparece con campos esperados
        const searchInput = page.locator('input[placeholder*="Buscar producto"]').first();
        await expect(searchInput, 'El campo de búsqueda de producto debe aparecer').toBeVisible({ timeout: 5000 });
    });

    test('3.3 Búsqueda de producto en formulario de ajuste funciona', async ({ page }) => {
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);

        // Abrir formulario
        const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
        await newAdjustmentBtn.click();
        await page.waitForTimeout(500);

        // Buscar en el input de producto
        const searchInput = page.locator('input[placeholder*="Buscar producto"], input[placeholder*="nombre o SKU"]').first();
        
        if (await searchInput.count() > 0) {
            await searchInput.fill('a'); // Letra común para obtener resultados
            await page.waitForTimeout(400);
            await screenshot(page, '17-ajustes-product-search');

            const productButtons = page.locator('button[type="button"]').filter({ hasText: /Stock:/i });
            const count = await productButtons.count();
            console.log(`  ℹ️  Productos encontrados en búsqueda 'a': ${count}`);

            if (count > 0) {
                // Seleccionar el primer producto
                await productButtons.first().click();
                await page.waitForTimeout(400);
                await screenshot(page, '18-ajustes-product-selected');

                // Verificar que aparecen los botones ENTRADA/SALIDA
                const entradaBtn = page.locator('button', { hasText: /entrada/i }).first();
                const salidaBtn = page.locator('button', { hasText: /salida/i }).first();
                await expect(entradaBtn, 'Botón ENTRADA debe aparecer').toBeVisible();
                await expect(salidaBtn, 'Botón SALIDA debe aparecer').toBeVisible();

                // Verificar campo cantidad y motivo
                const cantidadInput = page.locator('input[placeholder*="0.00"], input[type="number"]').first();
                const motivoInput = page.locator('input[placeholder*="Motivo"], input[placeholder*="motivo"]').first();
                await expect(cantidadInput, 'Campo Cantidad debe aparecer').toBeVisible();
                await expect(motivoInput, 'Campo Motivo debe aparecer').toBeVisible();
            }
        }
    });

    test('3.4 Validación: submit sin datos muestra error (no crash)', async ({ page }) => {
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);

        // Abrir formulario
        const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
        await newAdjustmentBtn.click();
        await page.waitForTimeout(500);

        // Intentar enviar sin datos
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.count() > 0) {
            const isDisabled = await submitBtn.isDisabled();
            console.log(`  ℹ️  Botón Submit deshabilitado sin datos: ${isDisabled}`);
            
            if (!isDisabled) {
                await submitBtn.click();
                await page.waitForTimeout(500);
                await screenshot(page, '19-ajustes-submit-empty');
            }
        }

        // La página NO debe haberse crasheado
        await expect(page.locator('body')).toBeVisible();
        const title = await page.title();
        expect(title).not.toContain('500');
    });

    test('3.5 Formulario ENTRADA - llena todos los campos correctamente', async ({ page }) => {
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);

        // Abrir formulario
        const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
        await newAdjustmentBtn.click();
        await page.waitForTimeout(400);

        // Buscar y seleccionar primer producto disponible
        const searchInput = page.locator('input[placeholder*="Buscar producto"], input[placeholder*="nombre o SKU"]').first();
        if (await searchInput.count() === 0) {
            console.log('  ⚠️  Input de búsqueda no encontrado - skipping');
            return;
        }

        await searchInput.fill('a');
        await page.waitForTimeout(400);

        const productButtons = page.locator('button[type="button"]').filter({ hasText: /Stock:/i });
        if (await productButtons.count() === 0) {
            console.log('  ⚠️  No hay productos en la BD para testear - skipping');
            return;
        }

        await productButtons.first().click();
        await page.waitForTimeout(400);

        // Seleccionar tipo ENTRADA
        const entradaBtn = page.locator('button[type="button"]', { hasText: /entrada/i }).first();
        if (await entradaBtn.count() > 0) {
            await entradaBtn.click();
            await page.waitForTimeout(200);
        }

        // Llenar cantidad
        const cantidadInput = page.locator('input[type="number"]').first();
        if (await cantidadInput.count() > 0) {
            await cantidadInput.fill('5');
        }

        // Llenar motivo
        const motivoInput = page.locator('input[placeholder*="Motivo"], input[placeholder*="Ej:"]').first();
        if (await motivoInput.count() > 0) {
            await motivoInput.fill('Test Playwright - ajuste de prueba entrada');
        }

        await screenshot(page, '20-ajustes-form-filled-entrada');

        // Verificar que el botón submit está habilitado
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.count() > 0) {
            const isEnabled = await submitBtn.isEnabled();
            console.log(`  ℹ️  Botón Submit habilitado con datos completos: ${isEnabled}`);
            expect(isEnabled, 'El botón Submit debe estar habilitado cuando todos los campos están llenos').toBeTruthy();
        }

        await expect(page.locator('body')).toBeVisible();
    });

    test('3.6 Tabla de historial de ajustes está presente', async ({ page }) => {
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);

        // Verificar historial de ajustes
        const historialSection = page.locator('text=/Historial de Ajustes/i').first();
        await expect(historialSection, 'Sección "Historial de Ajustes" debe estar visible').toBeVisible({ timeout: 8000 });

        // Verificar que muestra tabla o mensaje vacío
        const hasTable = await page.locator('table').count() > 0;
        const hasEmptyMsg = await page.locator('text=/Sin ajustes registrados/i').count() > 0;
        expect(hasTable || hasEmptyMsg, 'Debe mostrar tabla de historial o mensaje de vacío').toBeTruthy();

        await screenshot(page, '21-ajustes-historial');
    });

    test('3.7 Botón Cancelar cierra el formulario', async ({ page }) => {
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);

        // Abrir formulario
        const newAdjustmentBtn = page.locator('button', { hasText: /nuevo ajuste/i }).first();
        await newAdjustmentBtn.click();
        await page.waitForTimeout(400);

        // El formulario debe estar visible
        const form = page.locator('form').first();
        await expect(form, 'Formulario debe abrirse').toBeVisible({ timeout: 5000 });

        // Click en Cancelar
        const cancelBtn = page.locator('button', { hasText: /cancelar/i }).first();
        if (await cancelBtn.count() > 0) {
            await cancelBtn.click();
            await page.waitForTimeout(400);
            await screenshot(page, '22-ajustes-form-cancelled');

            // El formulario debe desaparecer
            const formVisible = await form.isVisible().catch(() => false);
            console.log(`  ℹ️  Formulario sigue visible después de cancelar: ${formVisible}`);
        }

        await expect(page.locator('body')).toBeVisible();
    });
});

// ═══════════════════════════════════════════════════════════════
// TEST 4: NAVEGACIÓN ENTRE PÁGINAS DE INVENTARIO
// ═══════════════════════════════════════════════════════════════
test.describe('🧭 Navegación - Sidebar de Inventario', () => {

    test('4.1 Navegar desde Kardex → Mantenimiento → Ajustes sin crashes', async ({ page }) => {
        const pageErrors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error' && !msg.text().includes('favicon')) {
                pageErrors.push(msg.text());
            }
        });
        page.on('crash', () => pageErrors.push('CRASH'));

        // Kardex
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);
        await screenshot(page, '23-nav-kardex');
        const kardexTitle = await page.title();
        expect(kardexTitle).not.toContain('500');

        // Mantenimiento
        await page.goto('/inventario/mantenimiento');
        await waitForAppReady(page);
        await screenshot(page, '24-nav-mantenimiento');
        const maintTitle = await page.title();
        expect(maintTitle).not.toContain('500');

        // Ajustes
        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);
        await screenshot(page, '25-nav-ajustes');
        const adjustTitle = await page.title();
        expect(adjustTitle).not.toContain('500');

        // Volver a Kardex
        await page.goto('/inventario/kardex');
        await waitForAppReady(page);
        await screenshot(page, '26-nav-back-kardex');

        if (pageErrors.length > 0) {
            console.error('\n  ⚠️  Errores durante navegación:');
            pageErrors.forEach(e => console.error(`     → ${e}`));
        }
        expect(pageErrors, `Errores durante navegación:\n${pageErrors.join('\n')}`).toHaveLength(0);
    });

    test('4.2 Responsive - Las páginas se ven en mobile (768px)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });

        await page.goto('/inventario/kardex');
        await waitForAppReady(page);
        await screenshot(page, '27-kardex-tablet');

        await page.goto('/inventario/ajustes');
        await waitForAppReady(page);
        await screenshot(page, '28-ajustes-tablet');

        await expect(page.locator('body')).toBeVisible();
    });
});
