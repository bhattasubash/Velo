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

const takeawaysMap = {
    'a-simple-brain-hack-to-start-studying-in-5-seconds': [
        'Count down 5-4-3-2-1 and take immediate physical action before your brain generates excuses.',
        'Focus on a frictionless first step like opening your notebook or starting a 5-minute timer.',
        'Counting shifts brain activity from passive hesitation to active, prefrontal execution.',
        'Momentum builds naturally once the first micro-action is completed.'
    ],
    'best-study-routine-for-students-who-can': [
        'Rigid, multi-hour study schedules fail because they ignore cognitive energy fluctuations.',
        'Anchor sessions around minimum daily non-negotiables (e.g., one 25-minute Pomodoro) rather than ideal targets.',
        'Schedule study blocks at consistent times to remove the mental friction of deciding when to begin.',
        'Prioritize starting consistency over session length to build sustainable long-term study momentum.'
    ],
    'how-decision-fatigue-is-ruining-your-study-session': [
        'Every micro-decision (what to study, where to start, what playlist to play) drains willpower before actual work begins.',
        'Plan your exact study subject and initial task the night before to eliminate morning hesitation.',
        'Standardize your study setup and timer intervals so execution requires zero real-time decisions.',
        'Preserve mental energy for high-order comprehension rather than session logistics.'
    ],
    'how-to-break-the-mental-block-that-stops-you-from-studying': [
        'Mental blocks are emotional threat responses to perceived task difficulty, failure anxiety, or perfectionism.',
        'Lower the activation threshold by committing to a draft that is intentionally rough or messy.',
        'Deconstruct large assignments into single, 2-minute actionable steps to disarm task overwhelm.',
        'A short physical change of environment (switching rooms, stepping outside) resets mental stalling.'
    ],
    'how-to-build-a-habit-of-studying': [
        'Habits depend on clear cues and immediate rewards, not fluctuating daily willpower.',
        'Tie studying to an existing daily trigger (e.g., right after morning coffee or arriving back from class).',
        'Start with an easy 15-minute daily baseline until the behavior becomes automated and instinctive.',
        'Track completion streaks visually to reinforce your identity as a consistent student.'
    ],
    'how-to-build-discipline-to-study': [
        'Discipline is an engineered operating system, while motivation is an unreliable emotional state.',
        'Create physical separation from high-dopamine distractions before opening your study materials.',
        'Focus on honoring your start time regardless of emotional readiness or mood.',
        'Consistency creates competence, which eventually generates natural intrinsic motivation.'
    ],
    'how-to-focus-while-studying-and-not-get-distracted': [
        'Attention is easily hijacked when alternative stimuli are immediately accessible within reach.',
        'Practice single-tasking by keeping only one tab, one window, or one notebook page open at a time.',
        'Keep a distraction scratchpad nearby to write down unrelated thoughts for later without leaving your task.',
        'Use structured work sprints (25–50 minutes) paired with intentional, screen-free rest intervals.'
    ],
    'how-to-get-into-focus-mode-instantly': [
        'Flow state requires an established transition ritual that signals the brain it is time to concentrate.',
        'Clear your immediate visual workspace to eliminate subliminal environmental triggers.',
        'Define a singular, unambiguous objective for the session before starting your timer.',
        'Use consistent audio cues like instrumental focus tracks or brown noise to anchor attention.'
    ],
    'how-to-remove-distractions-while-studying': [
        'Friction determines behavior: increase friction for distractions and decrease friction for studying.',
        'Place your smartphone in another room or inside a drawer to eliminate proximity-induced checking.',
        'Use website blockers to seal off distracting social and video feeds during study hours.',
        'Communicate boundaries to roommates or family members before beginning deep focus sessions.'
    ],
    'how-to-start-studying-after-a-long-break': [
        'Returning after a break triggers resistance because your study endurance and routines have decayed.',
        'Do not attempt your peak pre-break workload on day one; ramp up progressively over several days.',
        'Begin by reviewing previous notes or organizing upcoming materials to build comfort with the material.',
        'Forgive the temporary drop in speed and focus purely on establishing daily study cadence.'
    ],
    'how-to-start-studying-late-at-night': [
        'Late-night studying requires careful cognitive management to counter declining prefrontal stamina.',
        'Switch to active recall and problem-solving rather than passive reading to stay alert.',
        'Optimize lighting by avoiding dim environments that stimulate melatonin production.',
        'Set a strict cutoff time to protect sleep quality, which is essential for memory consolidation.'
    ],
    'how-to-start-studying-when-you-dont': [
        'Emotional reluctance to study is normal; you do not need to feel like studying in order to begin.',
        'Commit to the 5-Minute Rule: sit down and engage with the material for just 300 seconds.',
        'Begin with low-friction tasks (organizing flashcards, skimming headings) to break initial inertia.',
        'Once the initial barrier is crossed, cognitive resistance drops and continuation feels natural.'
    ],
    'how-to-start-studying-when-you-feel-mentally-tired': [
        'Mental exhaustion impairs heavy analytical thinking but can still support lighter cognitive tasks.',
        'Adjust task intensity: switch from complex problem sets to flashcard review or educational video review.',
        'Hydrate, step away from screens for a 10-minute walk, and wash your face to reset sensory alertness.',
        'Keep study blocks short (15–20 minutes) with frequent physical movement breaks.'
    ],
    'how-to-start-studying-when-you-feel-overwhelmed': [
        'Overwhelm happens when your working memory attempts to process entire semesters simultaneously.',
        'Conduct a rapid brain dump on paper to externalize all pending tasks and looming deadlines.',
        'Select exactly one task, hide everything else from view, and work on that single piece.',
        'Remember that taking any concrete action immediately shrinks the emotional weight of panic.'
    ],
    'how-to-stay-consistent-with-studying-every-day': [
        'Consistency is preserved by setting achievable floor targets rather than ambitious ceiling targets.',
        'Never break the chain twice: if life disrupts one day, resume the routine immediately the next day.',
        'Anchor study sessions to fixed daily events (like post-breakfast or post-workout) to build automaticity.',
        'Prioritize daily frequency and habit strength over marathon, irregular cramming sessions.'
    ],
    'how-to-stop-overthinking-and-just-start-studying': [
        'Overthinking is a covert form of procrastination disguised as preparation.',
        'Replace complex planning rituals with immediate, imperfect physical action.',
        'Set a 2-minute decision timer to choose what to study and commit without second-guessing.',
        'Treat the first draft or study session as an experiment where flaws and mistakes are welcomed.'
    ],
    'how-to-stop-procrastinating-and-start-studying': [
        'Procrastination is an emotional regulation problem, not a character flaw or time management issue.',
        'Identify the underlying fear (fear of failure, fear of judgment, or dread of boredom) fueling avoidance.',
        'Shrink the initial step until resistance vanishes (e.g., read just one paragraph or solve one equation).',
        'Use timed focus sprints to bypass anticipation dread and prove to yourself that the work is manageable.'
    ],
    'how-to-study-when-you-have-no-motivation': [
        'Motivation is a feeling that follows action, not a requirement that must precede it.',
        'Rely on environmental constraints and routines to carry you through low-willpower days.',
        'Use micro-commitments: tell yourself you can stop after 10 minutes if you genuinely want to.',
        'Focus on the identity of being someone who shows up, regardless of emotional weather.'
    ],
    'how-to-study-when-you-keep-getting-distracted-by-your-phone': [
        'Willpower cannot compete against notification algorithms engineered for dopamine capture.',
        'Introduce physical distance by keeping your phone in another room or inside a backpack.',
        'Turn on grayscale mode to remove the visual appeal of colorful app icons and alerts.',
        'Replace the phone-checking reflex with an analog alternative, like jotting down notes on paper.'
    ],
    'how-to-study-without-over-planning-everything': [
        'Over-planning gives a false sense of achievement while keeping actual learning at zero.',
        'Cap planning time to a maximum of 5–10 minutes per day using a simple bullet-point checklist.',
        'Focus on the next single hour rather than creating intricate schedules weeks into the future.',
        'Measure productivity by questions solved and pages understood, not by schedule aesthetic.'
    ],
    'how-to-study-without-overthinking': [
        'Analysis paralysis occurs when your mind obsesses over the overall magnitude of the syllabus.',
        'Shift focus from the finish line to the immediate micro-action happening right now.',
        'Ground runaway thoughts using concrete sensory anchors (writing by hand, speaking aloud).',
        'Accept that imperfect, messy studying produces infinitely higher retention than zero studying.'
    ],
    'the-real-reason-you-cant-start-studying': [
        'The true barrier to starting is the emotional discomfort of transitioning from low to high effort.',
        'Your brain is biologically wired to conserve glucose and energy, treating intense study as friction.',
        'Recognizing this transition resistance as temporary biology removes personal guilt and hesitation.',
        'The discomfort peaks during the first 3–5 minutes and drops sharply once immersion occurs.'
    ],
    'the-study-hack-that-fixes-procrastination-instantly': [
        'Lower the barrier of entry by defining a ridiculously easy first step that requires zero effort.',
        'Pair the start of study with a sensory ritual (lighting a desk lamp, opening a focus app, playing lo-fi).',
        'Reframe the goal from finishing the chapter to simply starting the clock for 10 minutes.',
        'Action creates clarity and motivation; do not wait for motivation to spark action.'
    ],
    'this-one-trick-helped-me-start-studying-every-day': [
        'Anchor study initiation to a microscopic, failure-proof trigger (the 2-minute rule).',
        'Prepare your desk and learning materials the evening before so your morning has zero setup friction.',
        'Focus on showing up at your desk at the appointed time rather than the volume of output.',
        'Consistency in start time trains your circadian rhythm to expect mental exertion automatically.'
    ],
    'use-this-5-second-rule-to-start-studying-instantly': [
        'There is a 5-second window between an impulse to study and the brain’s rationalization to delay.',
        'Counting backward 5-4-3-2-1 interrupts excuse generation and forces prefrontal engagement.',
        'Move physically on 1 (open your notebook, launch your study timer, or put on headphones).',
        'Repeated daily use turns the countdown into an automated psychological trigger for deep work.'
    ],
    'why-focusing-on-one-task-makes-students-better': [
        'Multitasking splits cognitive bandwidth, leaving attention residue that degrades retention and speed.',
        'Single-tasking allows full working memory allocation to deep conceptual comprehension.',
        'Mono-focus completes assignments significantly faster with dramatically fewer errors.',
        'Protect your focus stream by closing unrelated browser tabs, background chats, and social feeds.'
    ],
    'why-starting-is-the-hardest-part-of-studying': [
        'Static friction in physics is always higher than kinetic friction; studying obeys the same principle.',
        'The psychological dread of an assignment is almost always worse than the actual work itself.',
        'Once you break the starting threshold, neurochemicals like dopamine sustain your engagement.',
        'Design your study strategy around making the first 60 seconds as effortless as humanly possible.'
    ],
    'why-you-cant-start-studying': [
        'Inability to start stems from vague goals, fear of failure, or acute cognitive fatigue.',
        'Turn vague intentions into concrete, bite-sized tasks (e.g., read pages 42-45).',
        'Reduce intimidation by working in short, manageable 20–25 minute intervals.',
        'Forgive past procrastination immediately; self-compassion boosts subsequent task engagement.'
    ],
    'why-your-brain-avoids-studying': [
        'The brain evolved to seek high-dopamine, low-effort rewards to conserve energy for survival.',
        'Academic studying offers delayed rewards and high cognitive strain, triggering avoidance reflexes.',
        'Overcome evolutionary resistance by creating artificial immediate rewards and clear milestones.',
        'Structure work into bite-sized Pomodoros so your brain perceives the effort as safe and limited.'
    ]
};

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
        const wordCount = raw.split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));
        allPages.push({ slug, title, desc, cluster, heroImage, readTime });
    }
}

const articlesDataContent = `// AUTO-GENERATED BY generate.cjs
export const ARTICLES = ${JSON.stringify(allPages, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'articlesList.js'), articlesDataContent);

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
            <a href="/learn/${sibPage.slug}/" class="cluster-card">
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
    
    const pageData = allPages.find(p => p.slug === slug);
    const readTime = pageData ? pageData.readTime : 5;

    const takeaways = takeawaysMap[slug] || [
        "Commit to a small, frictionless first step to overcome initial study hesitation.",
        "Use structured focus intervals to maintain cognitive endurance and prevent fatigue.",
        "Design your environment to minimize friction for studying and maximize friction for distractions.",
        "Focus on consistent daily action rather than waiting for unpredictable emotional motivation."
    ];

    const takeawaysHtml = `
    <div class="key-takeaways" aria-label="Key Takeaways">
        <div class="key-takeaways-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Key Takeaways
        </div>
        <ul>
            ${takeaways.map(t => `<li>${t}</li>`).join('\n            ')}
        </ul>
    </div>`;

    let html = `<h1>${title}</h1>
    <div class="article-meta">
        <img src="/author.png" alt="Subash Bhatta" class="author-photo">
        <div class="author-info">
            <strong>Subash Bhatta</strong>
            <span>Updated November 2026 &bull; ${readTime} min read</span>
        </div>
    </div>
    <img src="${heroImage}" alt="${title}" class="hero-image" loading="lazy">
    ${takeawaysHtml}
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
    
    // Add App CTAs
    html += `
    <div style="margin-top: 48px; padding: 32px; background: #fafafa; border: 1px solid #eaeaea; border-radius: 12px; text-align: center;">
      <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #11; margin-bottom: 12px;">Ready to focus?</h3>
      <p style="font-size: 16px; color: #555; margin-bottom: 24px;">Put what you learned into practice with Velo's clean, minimalist study timer.</p>
      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
         <a href="/#/" style="text-decoration: none; font-weight: 600; font-size: 15px; color: #111; background: #fff; padding: 12px 24px; border-radius: 8px; border: 1px solid #111; transition: 0.2s ease;">Open Dashboard</a>
         <a href="/#/timer" style="text-decoration: none; font-weight: 600; font-size: 15px; color: #fff; background: #111; padding: 12px 24px; border-radius: 8px; border: 1px solid #111; transition: 0.2s ease;">Start Focus Session</a>
      </div>
    </div>
    `;
    
    html += `</div> <!-- end article-content -->
    
    <div class="article-footer-hr"></div>
    <section class="cluster-links">
        <h3>Read Next from Velo</h3>
        ${clusterHtml}
    </section>
    `;

    const today = new Date().toISOString().split('T')[0];
    buildPage(slug, title, metaDescription, html, cluster, heroImage, '2026-03-29', today);
    sitemapUrls.push(`https://getvelo.vercel.app/learn/${slug}/`);
}

const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getvelo.vercel.app/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
${sitemapUrls.map(url => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);

const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://getvelo.vercel.app/sitemap.xml`;
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
