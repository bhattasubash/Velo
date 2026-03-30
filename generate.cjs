const fs = require('fs');
const path = require('path');
const { buildPage } = require('./build-seo-pages.cjs');

const rawDir = path.join(__dirname, 'seo-articles-raw');
const publicDir = path.join(__dirname, 'public');

const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.txt'));

const clusters = {
    'The Starting Problem': ['a-simple-brain-hack-to-start-studying-in-5-seconds', 'how-to-start-studying-when-you-dont', 'why-starting-is-the-hardest-part-of-studying', 'why-you-cant-start-studying', 'the-real-reason-you-cant-start-studying', 'this-one-trick-helped-me-start-studying-every-day', 'how-to-start-studying-when-you-feel-mentally-tired', 'how-to-start-studying-when-you-feel-overwhelmed'],
    'Focus & Distractions': ['how-decision-fatigue-is-ruining-your-study-session', 'how-to-focus-while-studying-and-not-get-distracted', 'how-to-get-into-focus-mode-instantly', 'how-to-remove-distractions-while-studying', 'how-to-study-when-you-keep-getting-distracted-by-your-phone', 'why-focusing-on-one-task-makes-students-better', 'how-to-stop-overthinking-and-just-start-studying', 'how-to-study-without-overthinking'],
    'Habit & Consistency': ['best-study-routine-for-students-who-can', 'how-to-build-a-habit-of-studying', 'how-to-build-discipline-to-study', 'how-to-start-studying-after-a-long-break', 'how-to-start-studying-late-at-night', 'how-to-stay-consistent-with-studying-every-day', 'how-to-stop-procrastinating-and-start-studying', 'how-to-study-when-you-have-no-motivation', 'how-to-study-without-over-planning-everything', 'the-study-hack-that-fixes-procrastination-instantly', 'how-to-break-the-mental-block-that-stops-you-from-studying', 'use-this-5-second-rule-to-start-studying-instantly', 'why-your-brain-avoids-studying']
};

function getCluster(slug) {
    for (const [clusterName, slugs] of Object.entries(clusters)) {
        if (slugs.includes(slug)) return clusterName;
    }
    return 'The Starting Problem';
}

const articleImages = {
    'a-simple-brain-hack-to-start-studying-in-5-seconds': 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
    'how-to-start-studying-when-you-dont': 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80',
    'why-starting-is-the-hardest-part-of-studying': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    'why-you-cant-start-studying': 'https://images.unsplash.com/photo-1513128034602-7571f0b14e24?auto=format&fit=crop&w=1200&q=80',
    'the-real-reason-you-cant-start-studying': 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=1200&q=80',
    'this-one-trick-helped-me-start-studying-every-day': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    'how-to-start-studying-when-you-feel-mentally-tired': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    'how-to-start-studying-when-you-feel-overwhelmed': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
    'how-decision-fatigue-is-ruining-your-study-session': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    'how-to-focus-while-studying-and-not-get-distracted': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    'how-to-get-into-focus-mode-instantly': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    'how-to-remove-distractions-while-studying': 'https://images.unsplash.com/photo-1494599948593-3dafe8338d71?auto=format&fit=crop&w=1200&q=80',
    'how-to-study-when-you-keep-getting-distracted-by-your-phone': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    'why-focusing-on-one-task-makes-students-better': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    'how-to-stop-overthinking-and-just-start-studying': 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1200&q=80',
    'how-to-study-without-overthinking': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    'best-study-routine-for-students-who-can': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    'how-to-build-a-habit-of-studying': 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
    'how-to-build-discipline-to-study': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
    'how-to-start-studying-after-a-long-break': 'https://images.unsplash.com/photo-1456406644174-8eb4f6c40621?auto=format&fit=crop&w=1200&q=80',
    'how-to-start-studying-late-at-night': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    'how-to-stay-consistent-with-studying-every-day': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    'how-to-stop-procrastinating-and-start-studying': 'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&w=1200&q=80',
    'how-to-study-when-you-have-no-motivation': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    'how-to-study-without-over-planning-everything': 'https://images.unsplash.com/photo-1513128034602-7571f0b14e24?auto=format&fit=crop&w=1200&q=80',
    'the-study-hack-that-fixes-procrastination-instantly': 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80',
    'how-to-break-the-mental-block-that-stops-you-from-studying': 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=1200&q=80',
    'use-this-5-second-rule-to-start-studying-instantly': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    'why-your-brain-avoids-studying': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
};

const fallbackHero = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80';

function getHeroImage(slug) {
    return articleImages[slug] || fallbackHero;
}

// Clean formatting is now done inline in the main loop

let sitemapUrls = [];
let allPages = [];

// Pre-read titles and descriptions
for (const file of files) {
    const slug = file.replace('.txt', '');
    const raw = fs.readFileSync(path.join(rawDir, file), 'utf-8');
    const blocks = raw.split(/\n\s*\n\s*\n+/).map(b => b.trim()).filter(b => b);
    if(blocks.length > 0) {
        const firstBlockLines = blocks[0].split(/\r?\n/).map(l => l.trim()).filter(l => l);
        const title = firstBlockLines[0];
        
        let desc = "";
        if (firstBlockLines.length > 1) {
            desc = firstBlockLines.slice(1).join(' ').substring(0, 140).trim();
            if(desc.length >= 140) desc += "…";
        }
        
        const cluster = getCluster(slug);
        const heroImage = getHeroImage(slug);
        allPages.push({ slug, title, desc, cluster, heroImage });
    }
}

for (const file of files) {
    const slug = file.replace('.txt', '');
    const cluster = getCluster(slug);
    
    const siblings = clusters[cluster].filter(s => s !== slug).slice(0, 4);
    let clusterHtml = `<div class="cluster-grid">`;
    const doodlePaths = [
      `<circle cx="100" cy="100" r="80" fill="#8B5CF6"/>`,
      `<path d="M20,50 Q80,-20 180,50 T340,50" stroke="#8B5CF6" stroke-width="40" fill="none" stroke-linecap="round"/>`,
      `<path d="M10,100 C30,30 150,150 190,50" stroke="#8B5CF6" stroke-width="50" fill="none" stroke-linecap="round"/>`,
      `<rect x="40" y="40" width="120" height="120" rx="40" fill="#8B5CF6" transform="rotate(45 100 100)"/>`
    ];
    let doodleIndex = 0;
    
    for(const sib of siblings) {
        const sibPage = allPages.find(p => p.slug === sib);
        if(sibPage) {
            const currentDoodle = doodlePaths[doodleIndex % doodlePaths.length];
            doodleIndex++;
            clusterHtml += `
            <a href="/${sibPage.slug}/" class="cluster-card">
              <div class="card-doodle">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${currentDoodle}</svg>
              </div>
              <img src="${sibPage.heroImage}" alt="${sibPage.title}" class="cluster-card-img" loading="lazy">
              <div class="cluster-card-content">
                <span class="cluster-tag">${sibPage.cluster}</span>
                <div class="cluster-title">${sibPage.title}</div>
                <div class="cluster-desc">${sibPage.desc}</div>
              </div>
            </a>`;
        }
    }
    clusterHtml += `</div>`;

    const raw = fs.readFileSync(path.join(rawDir, file), 'utf-8');
    
    // 1. Get title and meta description robustly
    const legacyBlocks = raw.split(/\n\s*\n\s*\n+/).map(b => b.trim()).filter(b => b);
    if (legacyBlocks.length === 0) continue;
    
    const firstBlockLines = legacyBlocks[0].split(/\r?\n/).map(l => l.trim()).filter(l => l);
    const title = firstBlockLines.shift(); 
    const heroImage = getHeroImage(slug);
    let metaDescription = firstBlockLines.join(' ').substring(0, 155).trim() + "...";

    let html = `<h1>${title}</h1>
    <div class="article-meta">
        <img src="/author.png" alt="Subash Bhatta" class="author-photo">
        <div class="author-info">
            <strong>Subash Bhatta</strong>
            <span>Updated March 2026 &bull; 5 min read</span>
        </div>
    </div>
    <img src="${heroImage}" alt="${title}" class="hero-image" loading="lazy">
    <div class="article-content">
    `;
    
    // 2. Fix literal escaped newlines and parse intelligently to remove fragmentation
    let text = raw.replace(/\\n/g, '\n');
    let rawLines = text.split(/\r?\n/);
    
    let blocks = [];
    let blankCount = 0;
    for (let line of rawLines) {
        let trimmed = line.trim();
        if (trimmed === '') {
            blankCount++;
        } else {
            // Filter CTA to keep pure editorial reading flow
            if (!trimmed.includes('getvelo.vercel') && !trimmed.toLowerCase().includes('simpler way to start')) {
                blocks.push({ text: trimmed, blanksBefore: blankCount });
            }
            blankCount = 0;
        }
    }
    
    // Remove title from the body sequence
    if (blocks.length > 0 && (blocks[0].text === title || blocks[0].text === `# ${title}`)) {
        blocks.shift();
    }
    
    let pBuffer = [];
    let inList = false;
    let pCount = 0;
    
    function flushP() {
        if (pBuffer.length > 0) {
            html += `<p>${pBuffer.join(' ')}</p>\n`;
            pBuffer = [];
            pCount++;
            
            // Inject AdSense in-article ad after the 3rd paragraph
            if (pCount === 3) {
                html += `
<!-- Google AdSense In-Article -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3712834243686011"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-3712834243686011"
     data-ad-slot="3069675214"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
`;
            }
        }
    }
    
    for (let i = 0; i < blocks.length; i++) {
        let b = blocks[i];
        let inlineText = b.text.replace(/^\s*#+\s*/, '').replace(/\*\*/g, '');
        
        // Detect H2: 2 or more preceding blank lines indicate a major section separation by the AI
        let isMajorHeading = b.blanksBefore >= 2 && inlineText.length < 80 && !inlineText.match(/[.!?]$/);
        
        // Detect List Items: active list, short text, no terminating punctuation
        let isListItem = inList && inlineText.length < 90 && !inlineText.match(/[.!?]$/) && !isMajorHeading;
        let triggersList = inlineText.endsWith(':');
        
        if (isMajorHeading) {
            if (inList) { html += `</ul>\n`; inList = false; }
            flushP();
            html += `<h2>${inlineText}</h2>\n`;
            continue;
        }
        
        if (triggersList) {
            flushP();
            if (inList) { html += `</ul>\n`; }
            html += `<p>${inlineText}</p>\n<ul>\n`;
            inList = true;
            continue;
        }
        
        if (inList) {
            if (isListItem) {
                html += `<li>${inlineText}</li>\n`;
                continue;
            } else {
                html += `</ul>\n`;
                inList = false;
            }
        }
        
        // Minor sub-points generated by the AI without punctuation -> Treat as inline strong text
        if (!inList && inlineText.length < 50 && !inlineText.match(/[.!?]$/)) {
            inlineText = `<strong>${inlineText}</strong>`;
        }
        
        pBuffer.push(inlineText);
        
        // Combine related ideas! Flush paragraph when it gets substantial (forced thick 5+ line requirement)
        let joined = pBuffer.join(' ');
        if (joined.length > 700 || joined.split(/[.!?]+/).length > 7) {
            flushP();
        }
    }
    
    if (inList) html += `</ul>\n`;
    flushP();
    
    html += `</div> <!-- end article-content -->
    
    <div class="article-footer-hr"></div>
    <section class="cluster-links">
        <h3>Read Next from Velo</h3>
        ${clusterHtml}
    </section>
    `;

    buildPage(slug, title, metaDescription, html, cluster, title.split(' ').join(', '));
    sitemapUrls.push(`https://getvelo.vercel.app/${slug}/`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getvelo.vercel.app/</loc>
    <priority>1.0</priority>
  </url>
${sitemapUrls.map(url => `  <url>\n    <loc>${url}</loc>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://getvelo.vercel.app/sitemap.xml`;
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
