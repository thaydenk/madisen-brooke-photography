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
  test('portfolio opens the selected photo and navigates between photographs',()=>{
    const {window,document}=loadPage();
    const dialog=document.querySelector('dialog');
    dialog.showModal=vi.fn(); dialog.close=vi.fn();
    const stories=[...document.querySelectorAll('.story')];
    for(const story of stories){
      story.click();
      expect(dialog.querySelector('h2').textContent).toBe(story.dataset.story);
      expect(dialog.querySelector('img').getAttribute('src')).toBe(story.dataset.image);
    }
    expect(dialog.showModal).toHaveBeenCalledTimes(4);
    document.querySelector('#photo-next').click();
    expect(dialog.querySelector('img').getAttribute('src')).toBe(stories[0].dataset.image);
    dialog.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
    expect(dialog.querySelector('img').getAttribute('src')).toBe(stories[3].dataset.image);
    dialog.querySelector('.close-dialog').click();
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });
  test('all supplied photos have accessible descriptions and reference images are gone',()=>{
    const {document}=loadPage();
    const photos=[...document.querySelectorAll('.photo img')];
    expect(photos.length).toBe(6);
    for(const image of photos) expect(image.alt).toBeTruthy();
    const sources=new Set(photos.map(image=>image.getAttribute('src')));
    expect(sources.size).toBe(4);
    expect(document.body.textContent).not.toContain('supplied brand board');
    expect(document.querySelector('[data-crop]')).toBeNull();
  });
});
