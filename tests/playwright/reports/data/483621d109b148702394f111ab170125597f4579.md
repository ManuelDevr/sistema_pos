# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory.spec.mjs >> 🔧 Mantenimiento - /inventario/mantenimiento >> 2.1 La página carga correctamente sin errores
- Location: tests\playwright\inventory.spec.mjs:294:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://127.0.0.1:8000/login", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * ============================================================
  3   |  *  TESTS DE INVENTARIO - Sistema POS Ferretería CMA
  4   |  *  Páginas cubiertas:
  5   |  *    1. /inventario/kardex        → Kardex.jsx
  6   |  *    2. /inventario/mantenimiento → Maintenance.jsx
  7   |  *    3. /inventario/ajustes       → Adjustments.jsx
  8   |  *
  9   |  *  Captura:
  10  |  *    - Errores de consola del navegador
  11  |  *    - Crashes / errores de página
  12  |  *    - Screenshots de cada estado
  13  |  *    - Comportamiento de filtros e interacciones UI
  14  |  * ============================================================
  15  |  */
  16  | 
  17  | import { test, expect } from '@playwright/test';
  18  | import path from 'path';
  19  | import fs from 'fs';
  20  | import { fileURLToPath } from 'url';
  21  | 
  22  | // ── Configuración de credenciales y rutas ────────────────────
  23  | const CREDENTIALS = {
  24  |     email: 'admin@example.com',
  25  |     password: 'admin123',
  26  | };
  27  | 
  28  | const __dirname = path.dirname(fileURLToPath(import.meta.url));
  29  | const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'inventory');
  30  | fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  31  | 
  32  | // ── Helper: capturar y guardar screenshot con nombre ─────────
  33  | async function screenshot(page, name) {
  34  |     const filepath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  35  |     await page.screenshot({ path: filepath, fullPage: true });
  36  |     console.log(`  📸 Screenshot guardado: ${name}.png`);
  37  |     return filepath;
  38  | }
  39  | 
  40  | // ── Helper: esperar hasta que Inertia/React cargue ───────────
  41  | async function waitForAppReady(page) {
  42  |     await page.waitForLoadState('domcontentloaded');
  43  |     // Esperar que no haya el spinner de carga de Inertia
  44  |     await page.waitForFunction(() => !document.querySelector('[data-inertia-loading]'), {
  45  |         timeout: 15000,
  46  |     }).catch(() => { /* Si no existe el selector, no hay spinner, todo bien */ });
  47  |     await page.waitForTimeout(800); // micro-pausa para animaciones React
  48  | }
  49  | 
  50  | // ── Fixture: login compartido entre todos los tests ──────────
  51  | test.beforeEach(async ({ page }, testInfo) => {
  52  |     // ── Capturar TODOS los mensajes de consola ─────────────────
  53  |     const consoleErrors = [];
  54  |     const consoleWarnings = [];
  55  | 
  56  |     page.on('console', (msg) => {
  57  |         const type = msg.type();
  58  |         const text = msg.text();
  59  | 
  60  |         if (type === 'error') {
  61  |             // Ignorar errores de red conocidos no críticos
  62  |             if (!text.includes('favicon') && !text.includes('net::ERR_BLOCKED')) {
  63  |                 consoleErrors.push(`[ERROR] ${text}`);
  64  |                 console.error(`  🔴 Console error: ${text}`);
  65  |             }
  66  |         } else if (type === 'warning') {
  67  |             // Ignorar warnings de React DevTools en dev
  68  |             if (!text.includes('Download the React DevTools')) {
  69  |                 consoleWarnings.push(`[WARN] ${text}`);
  70  |                 console.warn(`  🟡 Console warning: ${text}`);
  71  |             }
  72  |         }
  73  |     });
  74  | 
  75  |     // ── Capturar crashes de página ─────────────────────────────
  76  |     page.on('crash', () => {
  77  |         console.error('  💥 ¡LA PÁGINA CRASHEÓ!');
  78  |     });
  79  | 
  80  |     // ── Capturar errores de diálogo no esperados ───────────────
  81  |     page.on('dialog', async (dialog) => {
  82  |         console.warn(`  ⚠️  Diálogo inesperado (${dialog.type()}): ${dialog.message()}`);
  83  |         await dialog.dismiss();
  84  |     });
  85  | 
  86  |     // ── Capturar fallos de requests (500, 404, etc.) ───────────
  87  |     page.on('response', (response) => {
  88  |         const status = response.status();
  89  |         const url = response.url();
  90  |         if (status >= 400 && !url.includes('favicon')) {
  91  |             console.error(`  🔴 HTTP ${status}: ${url}`);
  92  |         }
  93  |     });
  94  | 
  95  |     // Almacenar los arrays en el contexto del test para assertions
  96  |     testInfo.annotations.push({ type: 'consoleErrors', description: JSON.stringify(consoleErrors) });
  97  | 
  98  |     // ── LOGIN ──────────────────────────────────────────────────
> 99  |     await page.goto('/login');
      |                ^ Error: page.goto: Target page, context or browser has been closed
  100 |     await waitForAppReady(page);
  101 | 
  102 |     // Verificar que la página de login cargó
  103 |     await expect(page.locator('input[name="email"]'), 
  104 |         'El campo email del login debe estar visible'
  105 |     ).toBeVisible({ timeout: 10000 });
  106 | 
  107 |     await page.fill('input[name="email"]', CREDENTIALS.email);
  108 |     await page.fill('input[name="password"]', CREDENTIALS.password);
  109 |     await page.click('button[type="submit"]');
  110 | 
  111 |     // Esperar redirección post-login (dashboard o cualquier página autenticada)
  112 |     await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  113 |     await waitForAppReady(page);
  114 | 
  115 |     console.log(`\n✅ Login exitoso. URL actual: ${page.url()}`);
  116 | });
  117 | 
  118 | // ═══════════════════════════════════════════════════════════════
  119 | // TEST 1: KARDEX
  120 | // ═══════════════════════════════════════════════════════════════
  121 | test.describe('📦 Kardex - /inventario/kardex', () => {
  122 | 
  123 |     test('1.1 La página carga correctamente sin errores', async ({ page }) => {
  124 |         const errors = [];
  125 |         page.on('console', (msg) => {
  126 |             if (msg.type() === 'error' && !msg.text().includes('favicon')) {
  127 |                 errors.push(msg.text());
  128 |             }
  129 |         });
  130 |         page.on('crash', () => errors.push('PAGE CRASH DETECTED'));
  131 | 
  132 |         await page.goto('/inventario/kardex');
  133 |         await waitForAppReady(page);
  134 |         await screenshot(page, '01-kardex-initial');
  135 | 
  136 |         // Verificar que no crasheó (debe tener contenido)
  137 |         const body = await page.locator('body').textContent();
  138 |         expect(body, 'La página no debe estar vacía (crash)').toBeTruthy();
  139 | 
  140 |         // Verificar que no hay error 500
  141 |         const title = await page.title();
  142 |         expect(title, 'No debe mostrar página de error del servidor').not.toContain('500');
  143 |         expect(title, 'No debe mostrar página de error del servidor').not.toContain('Error');
  144 | 
  145 |         // Verificar el título de la página
  146 |         await expect(page).toHaveTitle(/Kardex/i, { timeout: 8000 });
  147 | 
  148 |         // Reportar errores de consola (no falla el test, solo reporta)
  149 |         if (errors.length > 0) {
  150 |             console.error('\n  ⚠️  Errores de consola detectados:');
  151 |             errors.forEach(e => console.error(`     → ${e}`));
  152 |         }
  153 |         // Ahora sí falla si hay errores críticos de JS
  154 |         expect(errors, `Errores de consola encontrados:\n${errors.join('\n')}`).toHaveLength(0);
  155 |     });
  156 | 
  157 |     test('1.2 Elementos UI críticos están presentes', async ({ page }) => {
  158 |         await page.goto('/inventario/kardex');
  159 |         await waitForAppReady(page);
  160 | 
  161 |         // Buscar input de búsqueda
  162 |         const searchInput = page.locator('input[placeholder*="Filtrar"], input[placeholder*="nombre"], input[placeholder*="SKU"]').first();
  163 |         await expect(searchInput, 'Debe haber un input de búsqueda/filtro').toBeVisible({ timeout: 8000 });
  164 | 
  165 |         // Botón de filtrar
  166 |         const filterBtn = page.locator('button', { hasText: /filtrar/i }).first();
  167 |         await expect(filterBtn, 'Debe haber un botón Filtrar').toBeVisible();
  168 | 
  169 |         // Botón de descargar PDF
  170 |         const pdfBtn = page.locator('button', { hasText: /pdf|descargar/i }).first();
  171 |         await expect(pdfBtn, 'Debe haber un botón para descargar PDF').toBeVisible();
  172 | 
  173 |         // Tabla o mensaje vacío
  174 |         const hasTable = await page.locator('table').count() > 0;
  175 |         const hasEmptyMsg = await page.locator('text=/No se registran movimientos/i').count() > 0;
  176 |         expect(hasTable || hasEmptyMsg, 
  177 |             'Debe mostrar la tabla del Kardex o un mensaje de vacío'
  178 |         ).toBeTruthy();
  179 | 
  180 |         await screenshot(page, '02-kardex-ui-elements');
  181 |     });
  182 | 
  183 |     test('1.3 Filtro por tipo de movimiento (ENTRADA/SALIDA)', async ({ page }) => {
  184 |         await page.goto('/inventario/kardex');
  185 |         await waitForAppReady(page);
  186 | 
  187 |         // Seleccionar filtro tipo
  188 |         const tipoSelect = page.locator('select').first();
  189 |         const hasSelect = await tipoSelect.count() > 0;
  190 | 
  191 |         if (hasSelect) {
  192 |             // Si hay el select de productos, buscar el de tipo
  193 |             const allSelects = page.locator('select');
  194 |             const count = await allSelects.count();
  195 |             console.log(`  ℹ️  Selects encontrados: ${count}`);
  196 | 
  197 |             // Intentar seleccionar "ENTRADA" en algún select visible
  198 |             for (let i = 0; i < count; i++) {
  199 |                 const sel = allSelects.nth(i);
```