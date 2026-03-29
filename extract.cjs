const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const inputDir = path.join(__dirname, 'seo articles');
const outputDir = path.join(__dirname, 'seo-articles-raw');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\.docx$/i, '')
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function extractAll() {
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.docx'));
    for (const file of files) {
        const slug = slugify(file);
        const inPath = path.join(inputDir, file);
        const outPath = path.join(outputDir, `${slug}.txt`);
        
        try {
            const result = await mammoth.extractRawText({ path: inPath });
            fs.writeFileSync(outPath, result.value);
            console.log(`Extracted: ${slug}`);
        } catch (e) {
            console.error(`Error with ${file}:`, e);
        }
    }
}

extractAll().then(() => console.log('Done'));
