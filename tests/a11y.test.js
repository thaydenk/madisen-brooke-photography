import { describe, test, expect } from 'vitest';
import { loadPage } from './helpers.js';

/**
 * axe-core in jsdom is limited — layout-dependent rules (color contrast,
 * focus order based on geometry) are skipped. We still catch a meaningful
 * subset: ARIA, labelling, landmark, name/role/value, and document-structure
 * rules. axe must be imported AFTER window/document are set as globals.
 */
describe('accessibility (axe-core, jsdom subset)', () => {
  test('renders with no axe-core violations at the wcag2a/wcag2aa level', async () => {
    const { window, document } = loadPage({ runScripts: false });

    globalThis.window = window;
    globalThis.document = document;
    globalThis.Node = window.Node;
    globalThis.Element = window.Element;
    globalThis.HTMLElement = window.HTMLElement;
    globalThis.getComputedStyle = window.getComputedStyle.bind(window);

    const { default: axe } = await import('axe-core');

    const results = await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      // Layout-dependent rules don't run meaningfully under jsdom; skip the
      // ones that probe canvas / computed style so the suite stays quiet.
      rules: { 'color-contrast': { enabled: false } },
      resultTypes: ['violations'],
    });

    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `[${v.id}] ${v.help} — ${v.nodes.length} node(s)\n  ${v.helpUrl}`)
        .join('\n');
      throw new Error(`axe-core found ${results.violations.length} violation(s):\n${summary}`);
    }

    expect(results.violations).toEqual([]);
  });
});
