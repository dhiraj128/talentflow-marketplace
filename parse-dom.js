const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const builderHtml = fs.readFileSync('builder-dom.html', 'utf8');
const dom = new JSDOM(builderHtml);
const document = dom.window.document;

const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
console.log('Tabs found on builder page:', tabs.length);
tabs.forEach(t => console.log('- text:', t.textContent, '| id:', t.id, '| class:', t.className));

const myResumeHtml = fs.readFileSync('my-resume-dom.html', 'utf8');
const dom2 = new JSDOM(myResumeHtml);
const doc2 = dom2.window.document;
const fileInputs = Array.from(doc2.querySelectorAll('input[type="file"]'));
console.log('\nFile inputs on my-resume page:', fileInputs.length);
