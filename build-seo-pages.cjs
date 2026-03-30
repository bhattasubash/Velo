const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');

const baseCss = fs.readFileSync(path.join(srcDir, 'styles', 'variables.css'), 'utf-8');

function buildPage(slug, title, metaDescription, articleHTML, cluster, keywords) {
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
  <meta name="keywords" content="${keywords}" />
  <link rel="canonical" href="https://getvelo.vercel.app/learn/${slug}/" />
  <meta property="og:title" content="${title} | Velo" />
  <meta property="og:description" content="${metaDescription}" />
  <meta property="og:url" content="https://getvelo.vercel.app/learn/${slug}/" />
  <meta property="og:type" content="article" />
  
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
        <a href="/">Home</a> &rsaquo; ${cluster}
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

module.exports = { buildPage };
