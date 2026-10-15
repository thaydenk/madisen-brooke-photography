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
  test('each portfolio button opens its matching reference photograph',()=>{
    const {document}=loadPage();
    const dialog=document.querySelector('dialog');
    dialog.showModal=vi.fn(); dialog.close=vi.fn();
    for(const story of document.querySelectorAll('.story')){
      story.click();
      expect(dialog.querySelector('h2').textContent).toBe(story.dataset.story);
      expect(dialog.querySelector('svg').getAttribute('viewBox')).toBe(story.dataset.crop);
    }
    expect(dialog.showModal).toHaveBeenCalledTimes(4);
    dialog.querySelector('.close-dialog').click();
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });
  test('all reference photographs have accessible descriptions',()=>{
    const {document}=loadPage();
    const photos=[...document.querySelectorAll('.photo[data-crop]')];
    expect(photos.length).toBeGreaterThan(0);
    for(const photo of photos){
      expect(photo.querySelector('svg').getAttribute('aria-label')).toBeTruthy();
      expect(photo.querySelector('image').getAttribute('href')).toBe('brand-reference.png');
    }
  });
});
