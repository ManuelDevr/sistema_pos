import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'screenshots');

import fs from 'fs';
fs.mkdirSync(screenshotsDir, { recursive: true });

const BASE_URL = 'http://127.0.0.1:8000';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const page = await context.newPage();

  // Login
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(screenshotsDir, '01-login.png'), fullPage: false });

  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Dashboard screenshot
  await page.screenshot({ path: path.join(screenshotsDir, '02-dashboard.png'), fullPage: false });

  // Check header elements
  const header = await page.locator('header').first();
  await header.screenshot({ path: path.join(screenshotsDir, '03-header-only.png') });

  // Check specific elements
  const headerHTML = await header.innerHTML();
  const hasNotifications = headerHTML.includes('Notificaciones');
  const hasCart = headerHTML.includes('Carrito');
  const hasUserName = headerHTML.includes('Mirtha');
  const hasLogout = headerHTML.includes('Cerrar');

  console.log('=== HEADER VERIFICATION ===');
  console.log(`Notifications icon visible: ${hasNotifications}`);
  console.log(`Cart icon visible: ${hasCart}`);
  console.log(`User name visible: ${hasUserName}`);
  console.log(`Logout button visible: ${hasLogout}`);

  // Also take a full page screenshot at 1280px to test narrower viewport
  await page.setViewportSize({ width: 1280, height: 768 });
  await page.screenshot({ path: path.join(screenshotsDir, '04-dashboard-1280.png'), fullPage: false });

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.screenshot({ path: path.join(screenshotsDir, '05-dashboard-1024.png'), fullPage: false });

  console.log('\nScreenshots saved to:', screenshotsDir);
  await browser.close();
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
