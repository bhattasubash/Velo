const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');

const baseCss = fs.readFileSync(path.join(srcDir, 'styles', 'variables.css'), 'utf-8');

function buildPage(slug, title, metaDescription, articleHTML, cluster, heroImage, datePublished = '2026-03-29', dateModified = '2026-11-14') {
    const pageDir = path.join(publicDir, 'learn', slug);
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Velo</title>
  <meta name="description" content="${metaDescription}" />
  <link rel="canonical" href="https://getvelo.vercel.app/learn/${slug}/" />

  <!-- ═══ Open Graph ═══ -->
  <meta property="og:title" content="${title} | Velo" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:url" content="https://getvelo.vercel.app/learn/${slug}/" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${heroImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Velo" />

  <!-- ═══ Twitter Card ═══ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title} | Velo" />
  <meta name="twitter:description" content="${metaDescription}" />
  <meta name="twitter:image" content="${heroImage}" />

  <!-- ═══ Structured Data (JSON-LD Article Schema) ═══ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(title)},
    "description": ${JSON.stringify(metaDescription)},
    "image": "${heroImage}",
    "author": {
      "@type": "Person",
      "name": "Subash Bhatta",
      "sameAs": [
        "https://www.linkedin.com/in/subash-bhatta",
        "https://github.com/bhattasubash"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Velo",
      "url": "https://getvelo.vercel.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getvelo.vercel.app/icon-192.png"
      }
    },
    "datePublished": "${datePublished}",
    "dateModified": "${dateModified}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://getvelo.vercel.app/learn/${slug}/"
    }
  }
  </script>
  
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  
  <style>
    ${baseCss}

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    html, body {
      background: #FAFAFA;
      color: #222;
      overflow-x: hidden;
      overflow-y: auto !important;
      min-height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 400;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* ─── Reading Progress Bar ─── */
    .progress-bar {
      position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, #3B82F6, #8B5CF6); z-index: 200; transition: width 0.1s linear;
    }

    /* ─── Navigation ─── */
    .top-bar {
      display: flex; justify-content: space-between; align-items: center; padding: 0 40px; height: 64px;
      background: rgba(250, 250, 250, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100;
    }
    .top-bar .brand { font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 800; color: #111; text-decoration: none; letter-spacing: -0.02em; }
    .top-bar .nav-cta { text-decoration: none; font-weight: 500; font-size: 14px; color: #fff; background: #111; padding: 10px 20px; border-radius: 6px; transition: 0.2s ease; }
    .top-bar .nav-cta:hover { background: #333; }

    /* ─── Layout Structure ─── */
    .layout-wrapper {
      max-width: 1080px;
      margin: 0 auto;
      padding: 64px 24px 120px;
      display: flex;
      gap: 60px;
      align-items: flex-start;
      animation: fadeIn 0.8s ease forwards;
    }

    .main-content {
      flex: 1;
      max-width: 680px;
      width: 100%;
    }

    .sidebar {
      width: 300px;
      flex-shrink: 0;
      position: sticky;
      top: 100px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* ─── Main Content Styling ─── */
    .breadcrumbs {
      margin-bottom: 32px; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #888;
    }
    .breadcrumbs a { color: #888; text-decoration: none; transition: 0.15s; }
    .breadcrumbs a:hover { color: #222; }

    .main-content h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 42px;
      font-weight: 800;
      color: #111;
      line-height: 1.15;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }

    .main-content h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 700;
      color: #111;
      margin-top: 40px;
      margin-bottom: 16px;
      line-height: 1.35;
      letter-spacing: -0.01em;
    }

    .main-content p {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 18px;
      line-height: 1.75;
      color: #1a1a1a;
      margin-bottom: 24px;
      font-weight: 400;
    }
    
    .main-content ul {
      margin-bottom: 24px;
      padding-left: 24px;
      font-size: 18px;
      line-height: 1.75;
      color: #1a1a1a;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .main-content li {
      margin-bottom: 8px;
    }
    .main-content strong {
      font-weight: 600;
      color: #111;
    }

    .main-content a {
      color: #111; text-decoration: underline; text-decoration-color: rgba(17, 17, 17, 0.2); text-underline-offset: 3px; transition: 0.2s;
    }
    .main-content a:hover { text-decoration-color: #111; }

    .article-meta {
      display: flex; align-items: center; gap: 16px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #EAEAEA;
    }
    .author-photo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background: #eee; }
    .author-info strong { display: block; font-size: 14px; font-weight: 600; color: #333; }
    .author-info span { font-size: 13px; color: #777; margin-top: 4px; display: block; }

    .hero-image {
      width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 10px; margin-bottom: 48px; display: block; box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }

    /* ─── Key Takeaways Callout ─── */
    .key-takeaways {
      background: #F8F7FC;
      border: 1px solid #E9E5F5;
      border-left: 4px solid #8B5CF6;
      border-radius: 10px;
      padding: 22px 24px;
      margin-bottom: 36px;
    }
    .key-takeaways-title {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #7C3AED;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .key-takeaways ul {
      margin: 0 !important;
      padding-left: 20px !important;
      font-size: 16px !important;
      line-height: 1.65 !important;
      color: #2D2D2D !important;
    }
    .key-takeaways li {
      margin-bottom: 8px !important;
    }
    .key-takeaways li:last-child {
      margin-bottom: 0 !important;
    }
    .key-takeaways strong {
      color: #111;
    }

    /* ─── Sidebar Widgets ─── */
    .sidebar-widget {
      background: #fff;
      border: 1px solid #EAEAEA;
      border-radius: 12px;
      padding: 32px 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: box-shadow 0.2s;
    }
    .sidebar-widget:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.06); }

    .velo-promo { border-top: 4px solid #111; }
    .velo-promo .promo-title {
      font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; color: #111; margin-bottom: 12px;
    }
    .velo-promo .promo-desc {
      font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;
    }
    .velo-promo .promo-features { list-style: none; margin-bottom: 24px; }
    .velo-promo .promo-features li {
      font-size: 13px; color: #555; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; font-weight: 500;
    }
    .velo-promo .promo-features li::before { content: "✓"; color: #000; font-weight: 800; }
    
    .velo-promo .promo-btn {
      display: block; text-align: center; text-decoration: none; font-weight: 600; font-size: 14px; color: #fff; background: #111; padding: 14px; border-radius: 6px; transition: 0.2s ease;
    }
    .velo-promo .promo-btn:hover { background: #333; transform: translateY(-1px); }

    .ad-container { padding: 16px; background: #F8F8F8; border: 1px solid #EEEEEE; border-radius: 8px; text-align: center; box-shadow: none; border-top: 1px solid #EEEEEE; }
    .ad-container:hover { box-shadow: none; }
    .ad-container .ad-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.15em; display: block; margin-bottom: 16px; font-weight: 600; }
    .ad-container .ad-placeholder { width: 100%; height: 250px; background: #EEE; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #AAA; font-size: 12px; border: 1px dashed #CCC; }

    /* ─── Related Articles (Cluster) ─── */
    .article-footer-hr {
      margin: 80px 0 60px 0;
      border-top: 1px solid #EAEAEA;
    }
    
    .cluster-links { margin-bottom: 40px; }
    .cluster-links h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 700;
      color: #111;
      margin-bottom: 32px;
      letter-spacing: -0.01em;
    }
    .cluster-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
    }
    .cluster-card {
      display: flex;
      flex-direction: column;
      text-decoration: none !important;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }
    .cluster-card:hover { 
      transform: translateY(-4px); 
      box-shadow: 0 12px 24px rgba(0,0,0,0.07); 
    }
    .card-doodle {
      position: absolute;
      bottom: -20px;
      right: -20px;
      width: 150px;
      height: 150px;
      opacity: 0.08;
      pointer-events: none;
      z-index: 0;
    }
    .card-doodle svg { width: 100%; height: 100%; }
    
    .cluster-card-img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      background: #eee;
      border-bottom: 1px solid rgba(0,0,0,0.04);
      z-index: 1;
      position: relative;
    }
    .cluster-card-content {
      padding: 24px;
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .cluster-tag {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8B5CF6;
      margin-bottom: 12px;
      display: inline-block;
      align-self: flex-start;
      background: rgba(139, 92, 246, 0.1);
      padding: 4px 10px;
      border-radius: 100px;
    }
    .cluster-title {
      font-family: 'Inter', sans-serif;
      font-size: 19px;
      font-weight: 700;
      color: #111;
      line-height: 1.35;
      margin-bottom: 12px;
    }
    .cluster-desc {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }

    /* ─── Animations & Responsive ─── */
    @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 992px) {
      .layout-wrapper { flex-direction: column; }
      .sidebar { width: 100%; position: static; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; border-top: 1px solid #EAEAEA; padding-top: 48px; }
    }
    @media (max-width: 768px) {
      .layout-wrapper { padding: 40px 20px 80px; }
      .main-content h1 { font-size: 36px; }
      .main-content h2 { font-size: 26px; }
      .sidebar { grid-template-columns: 1fr; border-top: none; margin-top: 24px; padding-top: 24px; }
      .cluster-grid { grid-template-columns: 1fr; gap: 24px; }
      .top-bar { padding: 0 20px; }
    }
  </style>

  <!-- Microsoft Clarity -->
  <script type="text/javascript">
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "w3oyhz2619");
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3712834243686011"
     crossorigin="anonymous"></script>
</head>
<body>

  <div class="progress-bar" id="progressBar"></div>

  <header class="top-bar">
    <a href="/" class="brand">Velo.</a>
    <a href="https://getvelo.vercel.app/#/" class="nav-cta">Try Velo</a>
  </header>

  <div class="layout-wrapper">
    <article class="main-content">
      <div class="breadcrumbs">
        <a href="/">Home</a> &rsaquo; <a href="/learn/">Learn</a> &rsaquo; ${cluster}
      </div>

      ${articleHTML}
    </article>

    <aside class="sidebar">
      <div class="sidebar-widget velo-promo">
        <div class="promo-title">Try Velo</div>
        <p class="promo-desc">Ready to turn these insights into action? Start your focused study session without friction.</p>
        <ul class="promo-features">
          <li>One-click focus timer</li>
          <li>Distraction-free mode</li>
          <li>No sign-up required</li>
        </ul>
        <a href="https://getvelo.vercel.app/#/" class="promo-btn">Start Studying Now</a>
      </div>

      <div class="sidebar-widget ad-container">
        <span class="ad-label">Advertisement</span>
        <div class="ad-placeholder">Ad Space</div>
      </div>
      
      <div class="sidebar-widget ad-container" style="margin-top: 12px;">
         <span class="ad-label">Advertisement</span>
         <div class="ad-placeholder" style="height: 400px;">Ad Space</div>
      </div>
    </aside>
  </div>

  <script>
    window.addEventListener('scroll', function() {
      const article = document.querySelector('.main-content');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, (scrolled / total) * 100);
      document.getElementById('progressBar').style.width = pct + '%';
    }, { passive: true });

    // Save reading progress to local storage so dashboard can pick it up
    try {
      localStorage.setItem('velo_last_read', JSON.stringify({
        title: "${title}",
        slug: "${slug}",
        cluster: "${cluster}",
        timestamp: Date.now()
      }));
    } catch (e) {}
  </script>

</body>
</html>`;

    fs.writeFileSync(path.join(pageDir, 'index.html'), html);
}

function buildLearnIndex(allPages, clusters) {
    const learnDir = path.join(publicDir, 'learn');
    if (!fs.existsSync(learnDir)) {
        fs.mkdirSync(learnDir, { recursive: true });
    }

    const title = "Evidence-Based Study Guides & Productivity Frameworks | Velo";
    const metaDescription = "Explore Velo's library of 29 evidence-based study guides tackling procrastination, mental fatigue, focus distractions, and building consistent daily study habits.";
    const canonical = "https://getvelo.vercel.app/learn/";
    const ogImage = "https://getvelo.vercel.app/og-image.png";

    const itemListElements = allPages.map((page, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": page.title,
        "url": `https://getvelo.vercel.app/learn/${page.slug}/`
    }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Velo Study Technique & Productivity Guides",
        "description": metaDescription,
        "url": canonical,
        "publisher": {
            "@type": "Organization",
            "name": "Velo",
            "url": "https://getvelo.vercel.app/",
            "logo": {
                "@type": "ImageObject",
                "url": "https://getvelo.vercel.app/icon-192.png"
            }
        },
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": itemListElements
        }
    };

    const clusterOrder = ['The Starting Problem', 'Focus & Distractions', 'Habit & Consistency'];
    const clusterDescriptions = {
        'The Starting Problem': 'Beat initial study hesitation, bypass prefrontal excuses, and start sessions in seconds.',
        'Focus & Distractions': 'Eliminate cognitive switching, protect working memory, and sustain deep concentration.',
        'Habit & Consistency': 'Build sustainable study rituals, master daily discipline, and eliminate motivation dependency.'
    };
    const clusterEmojis = {
        'The Starting Problem': '🚀',
        'Focus & Distractions': '⏱️',
        'Habit & Consistency': '🧠'
    };

    let clustersHtml = '';
    for (const clusterName of clusterOrder) {
        const slugs = clusters[clusterName] || [];
        const clusterPages = allPages.filter(p => slugs.includes(p.slug));
        if (clusterPages.length === 0) continue;

        clustersHtml += `
        <section class="cluster-section" id="${clusterName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
            <div class="cluster-section-header">
                <h2>${clusterEmojis[clusterName]} ${clusterName}</h2>
                <p>${clusterDescriptions[clusterName]}</p>
            </div>
            <div class="cluster-grid">
                ${clusterPages.map(p => `
                <a href="/learn/${p.slug}/" class="cluster-card">
                    <img src="${p.heroImage}" alt="${p.title}" class="cluster-card-img" loading="lazy">
                    <div class="cluster-card-content">
                        <span class="cluster-tag">${p.cluster}</span>
                        <div class="cluster-title">${p.title}</div>
                        <div class="cluster-desc">${p.desc}</div>
                        <div class="cluster-read-time">${p.readTime} min read &rarr;</div>
                    </div>
                </a>
                `).join('')}
            </div>
        </section>
        `;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${metaDescription}" />
  <link rel="canonical" href="${canonical}" />

  <!-- ═══ Open Graph ═══ -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:site_name" content="Velo" />

  <!-- ═══ Twitter Card ═══ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${metaDescription}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- ═══ Structured Data (JSON-LD CollectionPage) ═══ -->
  <script type="application/ld+json">
  ${JSON.stringify(jsonLd, null, 2)}
  </script>

  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    ${baseCss}

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }

    html, body {
      background: #FAFAFA;
      color: #222;
      overflow-x: hidden;
      overflow-y: auto !important;
      min-height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
    }

    /* ─── Navigation ─── */
    .top-bar {
      display: flex; justify-content: space-between; align-items: center; padding: 0 40px; height: 64px;
      background: rgba(250, 250, 250, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0,0,0,0.06); position: sticky; top: 0; z-index: 100;
    }
    .top-bar .brand { font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 800; color: #111; text-decoration: none; letter-spacing: -0.02em; }
    .top-bar .nav-cta { text-decoration: none; font-weight: 600; font-size: 14px; color: #fff; background: #111; padding: 10px 20px; border-radius: 6px; transition: 0.2s ease; }
    .top-bar .nav-cta:hover { background: #333; }

    /* ─── Hero ─── */
    .hub-hero {
      max-width: 1080px;
      margin: 0 auto;
      padding: 60px 24px 40px;
      text-align: center;
    }
    .hub-breadcrumbs {
      font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 16px;
    }
    .hub-breadcrumbs a { color: #888; text-decoration: none; }
    .hub-breadcrumbs a:hover { color: #111; }
    .hub-hero h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 44px;
      font-weight: 800;
      color: #111;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .hub-hero p {
      max-width: 640px;
      margin: 0 auto 32px;
      font-size: 18px;
      color: #555;
      line-height: 1.6;
    }

    /* ─── Anchor Filter Pills ─── */
    .hub-nav-pills {
      display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 48px;
    }
    .hub-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 18px; border-radius: 100px;
      background: #fff; border: 1px solid #E5E5EB;
      color: #333; text-decoration: none; font-size: 14px; font-weight: 600;
      transition: all 0.2s;
    }
    .hub-pill:hover { border-color: #8B5CF6; color: #8B5CF6; transform: translateY(-1px); }

    /* ─── Container ─── */
    .hub-container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 0 24px 100px;
    }

    .cluster-section {
      margin-bottom: 64px;
    }
    .cluster-section-header {
      margin-bottom: 24px;
    }
    .cluster-section-header h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 28px;
      font-weight: 700;
      color: #111;
      margin-bottom: 8px;
    }
    .cluster-section-header p {
      font-size: 15px;
      color: #666;
    }

    .cluster-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
    }
    .cluster-card {
      display: flex;
      flex-direction: column;
      text-decoration: none !important;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.06);
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .cluster-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(0,0,0,0.08);
    }
    .cluster-card-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      background: #eee;
    }
    .cluster-card-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .cluster-tag {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #8B5CF6;
      background: rgba(139, 92, 246, 0.1);
      padding: 4px 10px;
      border-radius: 100px;
      align-self: flex-start;
      margin-bottom: 12px;
    }
    .cluster-title {
      font-size: 18px;
      font-weight: 700;
      color: #111;
      line-height: 1.35;
      margin-bottom: 8px;
    }
    .cluster-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.55;
      margin-bottom: 16px;
      flex: 1;
    }
    .cluster-read-time {
      font-size: 13px;
      font-weight: 600;
      color: #8B5CF6;
      margin-top: auto;
    }

    /* ─── Footer ─── */
    .hub-footer {
      border-top: 1px solid #EAEAEA;
      padding: 48px 24px;
      text-align: center;
      background: #fafafa;
    }
    .hub-footer p { font-size: 14px; color: #666; margin-bottom: 16px; }
    .hub-footer-links {
      display: flex; justify-content: center; gap: 20px; font-size: 13px; font-weight: 500;
    }
    .hub-footer-links a { color: #555; text-decoration: none; }
    .hub-footer-links a:hover { color: #111; text-decoration: underline; }

    @media (max-width: 768px) {
      .hub-hero h1 { font-size: 32px; }
      .hub-hero p { font-size: 16px; }
      .cluster-grid { grid-template-columns: 1fr; }
      .top-bar { padding: 0 20px; }
    }
  </style>

  <!-- Microsoft Clarity -->
  <script type="text/javascript">
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "w3oyhz2619");
  </script>

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3712834243686011"
     crossorigin="anonymous"></script>
</head>
<body>

  <header class="top-bar">
    <a href="/" class="brand">Velo.</a>
    <a href="https://getvelo.vercel.app/#/" class="nav-cta">Open App</a>
  </header>

  <section class="hub-hero">
    <div class="hub-breadcrumbs">
      <a href="/">Home</a> &rsaquo; Study Guides
    </div>
    <h1>Evidence-Based Study Techniques &amp; Academic Frameworks</h1>
    <p>A curated directory of 29 research-backed guides designed to eliminate procrastination, prevent cognitive fatigue, and build indestructible daily study focus.</p>

    <div class="hub-nav-pills">
      <a href="#the-starting-problem" class="hub-pill">🚀 The Starting Problem (8)</a>
      <a href="#focus-distractions" class="hub-pill">⏱️ Focus &amp; Distractions (8)</a>
      <a href="#habit-consistency" class="hub-pill">🧠 Habit &amp; Consistency (13)</a>
    </div>
  </section>

  <main class="hub-container">
    ${clustersHtml}
  </main>

  <footer class="hub-footer">
    <p>&copy; 2026 Velo. Free, distraction-free student companion.</p>
    <div class="hub-footer-links">
      <a href="/">Home</a>
      <a href="/#/timer">Focus Timer</a>
      <a href="/#/calendar">Calendar</a>
      <a href="/privacy.html">Privacy Policy</a>
      <a href="/terms.html">Terms of Service</a>
      <a href="https://github.com/bhattasubash/Velo" target="_blank" rel="noopener">GitHub</a>
    </div>
  </footer>

</body>
</html>`;

    fs.writeFileSync(path.join(learnDir, 'index.html'), html);
}

module.exports = { buildPage, buildLearnIndex };
