import { describe, test, expect, beforeEach } from 'vitest';
import { loadPage } from './helpers.js';

function fillField(document, id, value) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Field #${id} not found in form`);
  el.value = value;
}

function submit(window) {
  window.submitForm({ preventDefault() {} });
}

describe('booking form', () => {
  let window;
  let document;

  beforeEach(() => {
    ({ window, document } = loadPage());
    window.localStorage.clear();
  });

  test('persists submitted lead to localStorage with all fields', () => {
    fillField(document, 'firstName', 'Jane');
    fillField(document, 'lastName', 'Doe');
    fillField(document, 'email', 'jane@example.com');
    fillField(document, 'phone', '555-1234');
    fillField(document, 'sessionType', 'signature');
    fillField(document, 'sessionCategory', 'family');
    fillField(document, 'preferredDate', '2026-06-15');
    fillField(document, 'referral', 'instagram');
    fillField(document, 'message', 'Outdoor session at golden hour.');

    submit(window);

    const leads = JSON.parse(window.localStorage.getItem('mb_leads'));
    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '555-1234',
      sessionType: 'signature',
      sessionCategory: 'family',
      preferredDate: '2026-06-15',
      referral: 'instagram',
      message: 'Outdoor session at golden hour.',
    });
    expect(typeof leads[0].submitted).toBe('string');
    expect(() => new Date(leads[0].submitted)).not.toThrow();
  });

  test('appends to localStorage instead of overwriting on repeat submit', () => {
    fillField(document, 'firstName', 'A');
    fillField(document, 'lastName', 'One');
    fillField(document, 'email', 'a@example.com');
    fillField(document, 'sessionType', 'mini');
    submit(window);

    fillField(document, 'firstName', 'B');
    fillField(document, 'lastName', 'Two');
    fillField(document, 'email', 'b@example.com');
    fillField(document, 'sessionType', 'luxe');
    submit(window);

    const leads = JSON.parse(window.localStorage.getItem('mb_leads'));
    expect(leads).toHaveLength(2);
    expect(leads[0].firstName).toBe('A');
    expect(leads[1].firstName).toBe('B');
  });

  test('navigates to a mailto: URL targeting the booking inbox', () => {
    fillField(document, 'firstName', 'Jane');
    fillField(document, 'lastName', 'Doe');
    fillField(document, 'email', 'jane@example.com');
    fillField(document, 'sessionType', 'signature');
    submit(window);

    expect(window.__navigatedTo).toMatch(
      /^mailto:hello@madisenbphotography\.com\?/,
    );
  });

  test('correctly URL-encodes names containing ampersands and special chars', () => {
    fillField(document, 'firstName', 'A&B');
    fillField(document, 'lastName', "O'Brien");
    fillField(document, 'email', 'test@example.com');
    fillField(document, 'sessionType', 'mini');
    fillField(document, 'message', 'Line 1\nLine 2 — with em dash & more');
    submit(window);

    const url = new URL(window.__navigatedTo);
    const subject = url.searchParams.get('subject');
    const body = url.searchParams.get('body');

    expect(subject).toBe('New Session Request — A&B O\'Brien');
    expect(body).toContain('Name: A&B O\'Brien');
    expect(body).toContain('Line 1\nLine 2 — with em dash & more');
  });

  test('falls back to N/A / Flexible / None for optional fields', () => {
    fillField(document, 'firstName', 'Solo');
    fillField(document, 'lastName', 'Tester');
    fillField(document, 'email', 'solo@example.com');
    fillField(document, 'sessionType', 'mini');
    submit(window);

    const body = new URL(window.__navigatedTo).searchParams.get('body');
    expect(body).toContain('Phone: N/A');
    expect(body).toContain('Session Type: N/A');
    expect(body).toContain('Preferred Date: Flexible');
    expect(body).toContain('Referral: N/A');
    expect(body).toContain('Message: None');
  });

  test('hides the form and reveals the success panel after submit', () => {
    fillField(document, 'firstName', 'Jane');
    fillField(document, 'lastName', 'Doe');
    fillField(document, 'email', 'jane@example.com');
    fillField(document, 'sessionType', 'signature');

    const formEl = document.getElementById('bookingForm').querySelector('form');
    const successEl = document.getElementById('formSuccess');

    expect(formEl.style.display).not.toBe('none');
    expect(successEl.style.display).not.toBe('block');

    submit(window);

    expect(formEl.style.display).toBe('none');
    expect(successEl.style.display).toBe('block');
  });

  test('preselectPackage writes the package value into the sessionType select', () => {
    window.preselectPackage('luxe');
    // The script uses setTimeout(...,300); jsdom timers fire when advanced.
    return new Promise((r) => setTimeout(r, 350)).then(() => {
      expect(document.getElementById('sessionType').value).toBe('luxe');
    });
  });
});
