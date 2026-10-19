import { describe, test, expect } from 'vitest';
import { loadPage } from './helpers.js';

describe('email inquiry', () => {
  test('preserves inquiry details and special characters in an email draft', () => {
    const {window,document}=loadPage();
    const form=document.querySelector('#inquiry');
    for(const [name,value] of Object.entries({name:"Jane & O’Brien",email:'jane@example.com',session:'Petite Session',type:'Couples',message:'Line one\nLine two & memories'})) form.elements.namedItem(name).value=value;
    form.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
    const url=new URL(window.__navigatedTo);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('hello@madisenbphotography.com');
    expect(url.searchParams.get('subject')).toBe('Photography inquiry — Petite Session');
    const body=url.searchParams.get('body');
    for(const value of ["Jane & O’Brien",'jane@example.com','Petite Session','Couples','Line one\nLine two & memories']) expect(body).toContain(value);
    expect(document.querySelector('#form-status').textContent).toContain('send it from your email app');
    expect(window.__fetchCalls).toHaveLength(0);
    expect(window.localStorage.length).toBe(0);
  });
  test('requires name, email, and vision before normal browser submission',()=>{
    const {document}=loadPage();
    const form=document.querySelector('#inquiry');
    expect(form.checkValidity()).toBe(false);
    for(const name of ['name','email','message']) expect(form.elements.namedItem(name).required).toBe(true);
    expect(form.elements.namedItem('email').type).toBe('email');
  });
  test.each(['Professional Headshots','Senior Portraits','Family Portraits','Petite Session'])('%s link selects the corresponding session',name=>{
    const {document}=loadPage();
    document.querySelector(`[data-package="${name}"]`).click();
    expect(document.querySelector('select[name="session"]').value).toBe(name);
  });
});
