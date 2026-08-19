const fs = require('fs');
const path = require('path');
const http = require('http');

const root = path.resolve(__dirname, '..');
const baseUrl = 'http://localhost:8123/';

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '_partials') continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, files);
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

function get(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode);
    }).on('error', (e) => resolve('ERR:' + e.message));
  });
}

(async () => {
  const pages = walk(root).map(p => path.relative(root, p));
  const checked = new Map();
  const broken = [];

  for (const page of pages) {
    const pageUrlPath = page.split(path.sep).join('/');
    const content = fs.readFileSync(path.join(root, page), 'utf-8');
    const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    const pageDir = path.posix.dirname(pageUrlPath);

    for (let href of hrefs) {
      if (/^(https?:|#|tel:|mailto:)/.test(href)) continue;
      let [h, anchor] = href.split('#');
      if (!h) continue;
      const resolved = path.posix.normalize(path.posix.join(pageDir, h));
      const url = baseUrl + resolved;
      let status;
      if (checked.has(url)) status = checked.get(url);
      else { status = await get(url); checked.set(url, status); }
      if (status !== 200) broken.push([page, href, url, status]);
    }
  }

  console.log(`Checked ${checked.size} unique URLs from ${pages.length} pages.`);
  if (broken.length) {
    console.log('BROKEN LINKS:');
    broken.forEach(b => console.log(b.join(' | ')));
  } else {
    console.log('All internal links OK (200).');
  }
})();
