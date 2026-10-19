import {describe,test,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const html=readFileSync('gallery.html','utf8');
describe('curated photo collections',()=>{
 test.each([['family',5],['motherhood',2],['portraits',4],['headshots',1],['couples',1],['unknown',5]])('%s opens the correct photographs', (category,count)=>{
  const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://madisenbphotography.com/gallery.html?cat='+category,beforeParse(w){w.IntersectionObserver=class{observe(){}}}});
  const doc=dom.window.document;
  const images=[...doc.querySelectorAll('#galleryPhotos img')];
  expect(images).toHaveLength(count);
  for(const image of images){expect(image.alt).toBeTruthy();expect(existsSync(resolve(image.getAttribute('src')))).toBe(true)}
  expect(doc.querySelector('#inquireLink').getAttribute('href')).toBe('/#contact');
  expect(doc.querySelector('#exploreTiles a[href*="newborn"]')).toBeNull();
  dom.window.close();
 });
});
