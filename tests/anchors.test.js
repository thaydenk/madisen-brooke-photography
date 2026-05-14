import { describe, test, expect } from 'vitest';
import { loadPage } from './helpers.js';

describe('in-page anchor integrity', () => {
  const { document } = loadPage({ runScripts: false });

  const inPageLinks = [...document.querySelectorAll('a[href^="#"]')]
    .map((a) => a.getAttribute('href'))
    .filter((href) => href && href !== '#');

  test('there is at least one in-page anchor link', () => {
    expect(inPageLinks.length).toBeGreaterThan(0);
  });

  test.each([...new Set(inPageLinks)])(
    'anchor target %s exists somewhere in the document',
    (href) => {
      const id = href.slice(1);
      const target = document.getElementById(id);
      expect(target, `Expected an element with id="${id}" for link ${href}`).not.toBeNull();
    },
  );
});

describe('external link sanity', () => {
  const { document } = loadPage({ runScripts: false });

  test('every external http(s) link parses as a valid absolute URL', () => {
    const links = [...document.querySelectorAll('a[href^="http"]')].map(
      (a) => a.getAttribute('href'),
    );
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      expect(() => new URL(href), `Invalid URL: ${href}`).not.toThrow();
    }
  });

  test('all external links open in a new tab (target="_blank")', () => {
    const externals = [
      ...document.querySelectorAll('a[href^="http"]'),
    ];
    for (const a of externals) {
      expect(
        a.getAttribute('target'),
        `External link ${a.getAttribute('href')} is missing target="_blank"`,
      ).toBe('_blank');
    }
  });

  test('mailto link points to the booking inbox', () => {
    const mailtos = [...document.querySelectorAll('a[href^="mailto:"]')];
    expect(mailtos.length).toBeGreaterThan(0);
    for (const a of mailtos) {
      expect(a.getAttribute('href')).toMatch(/^mailto:hello@madisenbphotography\.com/);
    }
  });
});
