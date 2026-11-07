// Screenshot each mock scenario's rendered result card.
import puppeteer from 'puppeteer-core';

const scenarios = ['normal', 'injection', 'disagree', 'fillfail', 'masked'];
const server = (scen) => ({
  proc: Bun ? null : null,
});

const { spawn } = await import('node:child_process');

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1100,1000'],
});

for (const scen of scenarios) {
  const srv = spawn('node', ['test/mock-harness.mjs', scen], { cwd: new URL('..', import.meta.url).pathname, stdio: 'pipe' });
  await new Promise((r) => setTimeout(r, 800));
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1100, height: 1000 });
    await page.goto('http://127.0.0.1:8797/', { waitUntil: 'domcontentloaded' });
    await page.click('#go');
    await page.waitForFunction(() => document.querySelector('#out table') || document.querySelector('#err').textContent.length > 0, { timeout: 8000 });
    await new Promise((r) => setTimeout(r, 300));
    const el = await page.$('#out');
    await el.screenshot({ path: 'test/shot-' + scen + '.png' });
    const txt = await page.evaluate(() => document.querySelector('#out').innerText.slice(0, 400));
    console.log('=== ' + scen + ' ===\n' + txt + '\n');
    await page.close();
  } finally {
    srv.kill();
  }
}
await browser.close();
console.log('SHOTS DONE');
