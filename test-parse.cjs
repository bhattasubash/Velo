const fs = require('fs');
const path = require('path');

const rawDir = path.join(__dirname, 'seo-articles-raw');
const file = 'a-simple-brain-hack-to-start-studying-in-5-seconds.txt';

const raw = fs.readFileSync(path.join(rawDir, file), 'utf-8');
const blocks = raw.split(/\n\s*\n\s*\n+/);

console.log(`Found ${blocks.length} blocks`);
blocks.forEach((b, i) => {
    console.log(`--- BLOCK ${i} ---`);
    console.log(b.substring(0, 50) + '...');
});
