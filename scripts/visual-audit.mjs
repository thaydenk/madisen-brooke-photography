#!/usr/bin/env node
/**
 * Visual audit — screenshots index.html at common breakpoints so layout
 * regressions (e.g. copy changes that overflow the hero, nav, or footer)
 * are easy to spot in PR review.
 *
 * Usage:
 *   npm run audit
 *
 * Requires Playwright + Chromium installed locally (`npx playwright
 * install chromium`). The repo's CI sandbox blocks browser downloads,
 * so this is a developer-machine tool, not a CI gate.
 */

import { spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'screenshots');

const BREAKPOINTS = [
  { name: 'mobile-iphone-se', width: 320, height: 568 },
  { name: 'mobile-iphone-14', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
];

const TARGETS = [
  { name: 'full', selector: null, fullPage: true },
  { name: 'nav', selector: '#mainNav' },
  { name: 'hero', selector: '#home' },
  { name: 'footer', selector: 'footer' },
  { name: 'sessions', selector: '#sessions' },
  { name: 'inquire', selector: '#inquire' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function startServer(port) {
  return new Promise((resolveStart) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost');
        const path = url.pathname === '/' ? '/index.html' : url.pathname;
        const file = resolve(root, '.' + path);
        if (!file.startsWith(root)) {
          res.writeHead(403).end();
          return;
        }
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404).end('Not found');
      }
    });
    server.listen(port, '127.0.0.1', () => resolveStart(server));
  });
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
    process.exit(1);
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const port = 8765;
  const server = await startServer(port);
  const url = `http://127.0.0.1:${port}/index.html`;
  console.log(`Serving ${root} at ${url}`);

  const browser = await chromium.launch();
  try {
    for (const bp of BREAKPOINTS) {
      const ctx = await browser.newContext({
        viewport: { width: bp.width, height: bp.height },
        deviceScaleFactor: 2,
        reducedMotion: 'reduce',
      });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      // Let scroll-reveal classes settle before snapping
      await page.waitForTimeout(400);

      for (const t of TARGETS) {
        const file = resolve(outDir, `${bp.name}-${t.name}.png`);
        if (t.fullPage) {
          await page.screenshot({ path: file, fullPage: true });
        } else {
          const el = await page.$(t.selector);
          if (!el) {
            console.warn(`  [skip] ${bp.name}/${t.name} — selector "${t.selector}" not found`);
            continue;
          }
          await el.screenshot({ path: file });
        }
        console.log(`  wrote ${file.replace(root + '/', '')}`);
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\nDone. ${BREAKPOINTS.length * TARGETS.length} screenshots written to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
