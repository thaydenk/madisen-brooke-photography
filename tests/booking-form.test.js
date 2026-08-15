import { describe, test, expect, beforeEach } from 'vitest';
import { loadPage, waitFor } from './helpers.js';

function fillField(document, id, value) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Field #${id} not found in form`);
  el.value = value;
}

function submit(window) {
  window.submitForm({ preventDefault() {} });
}

async function fillAndSubmit(window, document, overrides = {}) {
  const defaults = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    sessionType: 'signature',
  };
  const values = { ...defaults, ...overrides };
  Object.entries(values).forEach(([k, v]) => fillField(document, k, v));
  submit(window);
  // wait for fetch().then() to resolve
  await waitFor(() => window.__fetchCalls.length > 0);
  await new Promise((r) => setTimeout(r, 20));
}

describe('booking form (Netlify Forms POST)', () => {
  let window;
  let document;

  beforeEach(() => {
    ({ window, document } = loadPage());
    window.localStorage.clear();
  });

  test('persists submitted lead to localStorage with all fields', async () => {
    await fillAndSubmit(window, document, {
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

  test('appends to localStorage instead of overwriting on repeat submit', async () => {
    await fillAndSubmit(window, document, { firstName: 'A', lastName: 'One', email: 'a@example.com', sessionType: 'mini' });

    // Second submission — reopen form (real user flow: after 8s reset)
    document.getElementById('bookingForm').querySelector('form').style.display = 'block';
    document.getElementById('formSuccess').style.display = 'none';

    await fillAndSubmit(window, document, { firstName: 'B', lastName: 'Two', email: 'b@example.com', sessionType: 'luxe' });

    const leads = JSON.parse(window.localStorage.getItem('mb_leads'));
    expect(leads).toHaveLength(2);
    expect(leads[0].firstName).toBe('A');
    expect(leads[1].firstName).toBe('B');
  });

  test('POSTs a URL-encoded form body to / with the form-name field', async () => {
    await fillAndSubmit(window, document, {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      sessionType: 'signature',
    });

    expect(window.__fetchCalls).toHaveLength(1);
    const call = window.__fetchCalls[0];
    expect(call.url).toBe('/');
    expect(call.init.method).toBe('POST');
    expect(call.init.headers['Content-Type']).toBe('application/x-www-form-urlencoded');

    const body = new URLSearchParams(call.init.body);
    expect(body.get('form-name')).toBe('booking');
    expect(body.get('firstName')).toBe('Jane');
    expect(body.get('lastName')).toBe('Doe');
    expect(body.get('email')).toBe('jane@example.com');
    expect(body.get('sessionType')).toBe('signature');
  });

  test('preserves ampersands, em-dashes, and newlines through URL encoding', async () => {
    await fillAndSubmit(window, document, {
      firstName: 'A&B',
      lastName: "O'Brien",
      email: 'test@example.com',
      sessionType: 'mini',
      message: 'Line 1\nLine 2 — with em dash & more',
    });

    const body = new URLSearchParams(window.__fetchCalls[0].init.body);
    expect(body.get('firstName')).toBe('A&B');
    expect(body.get('lastName')).toBe("O'Brien");
    expect(body.get('message')).toBe('Line 1\nLine 2 — with em dash & more');
  });

  test('hides the form and reveals the success panel after successful POST', async () => {
    const formEl = document.getElementById('bookingForm').querySelector('form');
    const successEl = document.getElementById('formSuccess');

    expect(formEl.style.display).not.toBe('none');
    expect(successEl.style.display).not.toBe('block');

    await fillAndSubmit(window, document);

    expect(formEl.style.display).toBe('none');
    expect(successEl.style.display).toBe('block');
  });

  test('falls back to a mailto: navigation if the POST fails', async () => {
    ({ window, document } = loadPage({ fetchFailsWith: new Error('offline') }));
    window.localStorage.clear();

    fillField(document, 'firstName', 'Jane');
    fillField(document, 'lastName', 'Doe');
    fillField(document, 'email', 'jane@example.com');
    fillField(document, 'sessionType', 'signature');
    submit(window);

    await waitFor(() => window.__navigatedTo);
    expect(window.__navigatedTo).toMatch(/^mailto:hello@madisenbphotography\.com\?/);
    const url = new URL(window.__navigatedTo);
    expect(url.searchParams.get('subject')).toBe('New Session Request — Jane Doe');
  });

  test('preselectPackage writes the package value into the sessionType select', async () => {
    window.preselectPackage('luxe');
    await new Promise((r) => setTimeout(r, 350));
    expect(document.getElementById('sessionType').value).toBe('luxe');
  });

  test('preselectCategory writes the category value into the sessionCategory select', async () => {
    window.preselectCategory('newborn');
    await new Promise((r) => setTimeout(r, 350));
    expect(document.getElementById('sessionCategory').value).toBe('newborn');
  });
});
