import { describe, test, expect } from 'vitest';
import { HtmlValidate } from 'html-validate';
import { readIndexHtml, indexPath } from './helpers.js';

describe('index.html validity', () => {
  test('passes html-validate with the project ruleset', async () => {
    const validator = new HtmlValidate({
      root: true,
      extends: ['html-validate:recommended'],
      rules: {
        'no-inline-style': 'off',
        'no-raw-characters': 'off',
        'require-sri': 'off',
        'long-title': 'off',
        'void-style': 'off',
        'attribute-boolean-style': 'off',
        'wcag/h32': 'off',
        'wcag/h36': 'off',
        'wcag/h37': 'off',
        'wcag/h67': 'off',
        'wcag/h63': 'off',
        'wcag/h71': 'off',
        'attr-quotes': 'off',
        'element-required-attributes': 'off',
        'no-trailing-whitespace': 'off',
        'prefer-button': 'off',
        'no-implicit-button-type': 'off',
      },
    });
    const report = await validator.validateString(readIndexHtml(), indexPath);

    if (!report.valid) {
      const summary = report.results
        .flatMap((r) =>
          r.messages.map(
            (m) => `${r.filePath}:${m.line}:${m.column} [${m.ruleId}] ${m.message}`,
          ),
        )
        .join('\n');
      throw new Error(`html-validate found issues:\n${summary}`);
    }
    expect(report.valid).toBe(true);
  });
});

describe('required <head> metadata', () => {
  test('has a non-empty <title>', () => {
    const html = readIndexHtml();
    const m = html.match(/<title>([^<]+)<\/title>/i);
    expect(m, 'Missing <title> tag').not.toBeNull();
    expect(m[1].trim().length).toBeGreaterThan(0);
  });

  test('has a meta description', () => {
    const html = readIndexHtml();
    expect(html).toMatch(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}["']/i);
  });

  test('has a viewport meta tag', () => {
    const html = readIndexHtml();
    expect(html).toMatch(/<meta[^>]+name=["']viewport["']/i);
  });
});
