import {describe,test,expect,vi} from 'vitest';
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
  test('each portfolio button opens its matching supplied photograph',()=>{
    const {document}=loadPage();
    const dialog=document.querySelector('dialog');
    dialog.showModal=vi.fn(); dialog.close=vi.fn();
    for(const story of document.querySelectorAll('.story')){
      story.click();
      expect(dialog.querySelector('h2').textContent).toBe(story.dataset.story);
      expect(dialog.querySelector('img').getAttribute('src')).toBe(story.dataset.image);
      expect(dialog.querySelector('img').getAttribute('alt')).toBe(story.dataset.alt);
    }
    expect(dialog.showModal).toHaveBeenCalledTimes(4);
    dialog.querySelector('.close-dialog').click();
    expect(dialog.close).toHaveBeenCalledTimes(1);
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
