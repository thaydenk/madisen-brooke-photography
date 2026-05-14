import { describe, test, expect } from 'vitest';
import { loadPage, getInlineScripts } from './helpers.js';

/**
 * The inline script in index.html references DOM nodes by hard-coded ID and
 * CSS selectors. If somebody renames or removes one in the HTML without
 * updating the JS (or vice versa), the site silently breaks. These tests
 * extract every literal ID/selector referenced from the script and assert it
 * resolves against the rendered DOM.
 */
describe('script ↔ HTML DOM contract', () => {
  const scripts = getInlineScripts().join('\n');
  const { document } = loadPage({ runScripts: false });

  const idMatches = [...scripts.matchAll(/getElementById\(\s*['"]([^'"]+)['"]\s*\)/g)];
  const idsReferenced = [...new Set(idMatches.map((m) => m[1]))];

  test.each(idsReferenced)('#%s exists in the rendered HTML', (id) => {
    expect(document.getElementById(id)).not.toBeNull();
  });

  const selectorMatches = [
    ...scripts.matchAll(/querySelector(?:All)?\(\s*['"]([^'"]+)['"]\s*\)/g),
  ];
  const selectorsReferenced = [
    ...new Set(selectorMatches.map((m) => m[1])),
  ];

  test.each(selectorsReferenced)('selector "%s" matches at least one element', (sel) => {
    const found = document.querySelector(sel);
    expect(found, `Expected selector "${sel}" to resolve to an element`).not.toBeNull();
  });
});

describe('booking form ↔ submit handler contract', () => {
  const { document } = loadPage({ runScripts: false });

  // submitForm reads these from FormData by name, so every key it references
  // must correspond to a named field in the form.
  const requiredNames = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'sessionType',
    'sessionCategory',
    'preferredDate',
    'referral',
    'message',
  ];

  test.each(requiredNames)('form has a field named "%s"', (name) => {
    const el = document.querySelector(`#leadForm [name="${name}"]`);
    expect(el, `Expected #leadForm to contain a field named "${name}"`).not.toBeNull();
  });

  test('every package CTA preselects a value that exists in the dropdown', () => {
    const select = document.getElementById('sessionType');
    const optionValues = [...select.querySelectorAll('option')].map((o) => o.value);

    const ctaCalls = [
      ...document.querySelectorAll('[onclick^="preselectPackage"]'),
    ].map((el) => {
      const m = el.getAttribute('onclick').match(/preselectPackage\(\s*['"]([^'"]+)['"]\s*\)/);
      return m && m[1];
    });

    expect(ctaCalls.length).toBeGreaterThan(0);
    for (const value of ctaCalls) {
      expect(optionValues, `CTA preselects "${value}" but no <option> has that value`).toContain(value);
    }
  });
});
