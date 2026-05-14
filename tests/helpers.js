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
 * navigation captured instead of attempted.
 */
export function loadPage({ runScripts = true, viewportWidth = 800 } = {}) {
  // jsdom's window.location.href setter is non-configurable, so we can't
  // install a spy there. Instead, rewrite the inline script so navigation
  // writes to window.__navigatedTo, which the tests then assert against.
  // This is a test-only transform — index.html on disk is untouched.
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
    },
  });

  return { dom, window: dom.window, document: dom.window.document };
}
