import {describe,test,expect} from 'vitest';
import {loadPage} from './helpers.js';

describe('visitor interactions',()=>{
  test('mobile menu opens and closes after navigation',()=>{
    const {document}=loadPage();
    const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
    menu.click();
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    expect(nav.classList.contains('open')).toBe(true);
    nav.querySelector('a').click();
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(nav.classList.contains('open')).toBe(false);
  });
  test('portfolio images and names link directly to their collections',()=>{
    const {document}=loadPage();
    const cards=[...document.querySelectorAll('a.story')];
    expect(cards).toHaveLength(5);
    expect(document.querySelector('.collection-links')).toBeNull();
    for(const card of cards){
      expect(card.getAttribute('href')).toMatch(/^gallery\.html\?cat=(family|motherhood|portraits|couples|headshots)$/);
      expect(card.querySelector('img')).not.toBeNull();
      expect(card.querySelector('span:last-child').textContent.trim()).toBeTruthy();
    }
  });
  test('all supplied photographs have accessible descriptions',()=>{
    const {document}=loadPage();
    const photos=[...document.querySelectorAll('.photo img')];
    expect(photos.length).toBeGreaterThan(0);
    for(const photo of photos){
      expect(photo.getAttribute('alt')).toBeTruthy();
      expect(photo.getAttribute('src')).toMatch(/^photos\//);
    }
  });
});
