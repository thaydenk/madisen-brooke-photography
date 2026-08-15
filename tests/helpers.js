import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const indexPath = resolve(__dirname, '..', 'index.html');

export function readIndexHtml() {
  return readFileSync(indexPath, 'utf8');
}

export function getInlineScripts() {
  const html = readIndexHtml();
  const scripts = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) scripts.push(match[1]);
  return scripts;
}

/**
 * Build a jsdom Window for the site. By default we run inline scripts so
 * window.submitForm etc. are available, with the noisy desktop-only effects
 * (particles, parallax, cursor glow) disabled via a mobile viewport, and
 * a fetch stub that captures Netlify Form POSTs into window.__fetchCalls.
 *
 * We also rewrite `window.location.href=` in the inline script so the mailto
 * fallback (fired only if fetch rejects) writes to window.__navigatedTo
 * rather than triggering a jsdom navigation error.
 */
export function loadPage({
  runScripts = true,
  viewportWidth = 800,
  fetchResponse = { ok: true, status: 200 },
  fetchFailsWith = null,
} = {}) {
  const html = readIndexHtml().replace(
    /window\.location\.href\s*=\s*/g,
    'window.__navigatedTo=',
  );

  const dom = new JSDOM(html, {
    runScripts: runScripts ? 'dangerously' : 'outside-only',
    pretendToBeVisual: true,
    url: 'https://madisenbphotography.com/',
    beforeParse(window) {
      window.IntersectionObserver = class {
        observe() {}
        disconnect() {}
        unobserve() {}
        takeRecords() { return []; }
      };

      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: viewportWidth,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 600,
      });

      // Stub fetch to capture POST bodies without hitting the network.
      window.__fetchCalls = [];
      window.fetch = (url, init = {}) => {
        window.__fetchCalls.push({ url, init });
        if (fetchFailsWith) return Promise.reject(fetchFailsWith);
        return Promise.resolve(fetchResponse);
      };
    },
  });

  return { dom, window: dom.window, document: dom.window.document };
}

/**
 * Wait until the given predicate returns truthy or the timeout expires.
 * Handy for awaiting async DOM effects driven by Promise chains.
 */
export async function waitFor(fn, { timeout = 500, interval = 10 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const v = fn();
    if (v) return v;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`waitFor timed out after ${timeout}ms`);
}
