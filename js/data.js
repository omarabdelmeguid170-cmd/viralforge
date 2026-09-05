/* ============================================================
   ViralForge — data.js
   Static content: config, milestone blueprints, seed community
   content, trend fallbacks, and generator templates.
   ============================================================ */

window.CONFIG = {
  name: "ViralForge",
  tagline: "AI YouTube Channel Manager & Viral Growth Hub",
  version: "1.2.0",
  /* ------------------------------------------------------------------
     OWNER LINKS — fill these in to ACTIVATE the matching buttons.
     Leave them null and the UI stays clean (no dead links anywhere).
     ------------------------------------------------------------------ */
  /* GitHub repository you want people to fork / PR against */
  repoUrl: null,                              // "https://github.com/YOURNAME/viralforge"
  /* Donation gateways: BuyMeACoffee / Patreon */
  buymeacoffee: null,                          // "https://www.buymeacoffee.com/YOURNAME"
  patreon: null,                               // "https://www.patreon.com/YOURNAME"
  /* ------------------------------------------------------------------
     MONETIZATION → GOOGLE ADSENSE (optional, self-hosters)
     Ready out of the box: set `client` to your pub id and each slot id
     from your AdSense unit, and the dashed ad zones become live units.
     Alternatively set `custom` to a sponsor URL (BuyMeACoffee, your
     product, an affiliate page…) and the slots become that link card.
     With nothing set, the dashed placeholders stay visible.
     ------------------------------------------------------------------ */
  adsense: {
    client: "ca-pub-4259199993762672",         // "ca-pub-XXXXXXXXXXXXXXXX"
    slots: {
      sidebar: null,                          // your "data-ad-slot" id for the 240x400 unit
      footer: null                            // your "data-ad-slot" id for the 728x90 unit
    },
    custom: null                              // sponsor URL to use instead of AdSense
  },
  free: "100% free forever — open source, MIT licensed, no account, no paywall."
};

window.BLUEPRINTS = [
  {
    id: "blueprint-1k",
    icon: "flag",
    grad: "red",
    title: "The 1,000 Subscribers Blueprint",
    tagline: "First milestone: turn a fresh channel into a launch-ready engine in 30 days.",
    days: 30,
    meta: ["Beginner friendly", "+100 subs/week pace"],
    phases: [
      {
        title: "Foundation (Day 1-3)",
        desc: "Lock in niche, packaging, and a content formula before creating anything.",
        tasks: [
          { t: "Define your 1-sentence niche: who, what transformation, why you.", m: null },
          { t: "Run a Live Channel Audit and write down your starting health score.", m: "audit" },
          { t: "Audit the top 5 channels in your niche and list their top 3 recurring video types.", m: null },
          { t: "Set up uniform branding: banner, avatar, consistent thumbnail font + accent color.", m: null },
          { t: "Write 10 video ideas with the Script & Idea Factory.", m: "factory" }
        ]
      },
      {
        title: "Launch Window (Day 4-10)",
        desc: "Ship the first 3 videos with maximum packaging effort.",
        tasks: [
          { t: "Publish video #1. Test its thumbnail in the CTR Predictor before upload.", m: "ctr" },
          { t: "Publish video #2. Optimize titles with a proven hook formula.", m: "factory" },
          { t: "Publish video #3. Enable all end screens & cards to route traffic.", m: null },
          { t: "Score every thumbnail above 70 CTR points before going live.", m: "ctr" }
        ]
      },
      {
        title: "The Content Engine (Day 11-20)",
        desc: "Consistency beats intensity. Build the weekly drumbeat.",
        tasks: [
          { t: "Create a weekly pattern: 1 long-form + 3 shorts.", m: null },
          { t: "Turn each long-form video into a finished script via the Factory.", m: "factory" },
          { t: "Post at least 1 short per day; pin a Short to your channel trailer.", m: null },
          { t: "Scan the 24H Viral Engine and bank 3 trend-leveraged ideas.", m: "trends" }
        ]
      },
      {
        title: "Packaging Mastery (Day 21-26)",
        desc: "CTR and retention are the only levers that matter at this stage.",
        tasks: [
          { t: "Re-test and re-cut your worst-performing thumbnail/title pair.", m: "ctr" },
          { t: "Review retention in Studio; cut your intro to under 10 seconds.", m: null },
          { t: "Split-test 2 title variants across stale videos.", m: null },
          { t: "Aim for >35% CTR on thumbnails in your niche.", m: "ctr" }
        ]
      },
      {
        title: "Community & Virality (Day 27-30)",
        desc: "Turn passive viewers into a subscriber flywheel.",
        tasks: [
          { t: "Post 3 community polls/questions this week to boost channel activity.", m: null },
          { t: "List your channel on the Creator Exchange and accept 2 cross-promos.", m: "exchange" },
          { t: "Reply to every comment within 24h.", m: null },
          { t: "Take the 1,000 Subscribers badge photo — update your roadmap progress!", m: "roadmap" }
        ]
      }
    ]
  },
  {
    id: "blueprint-4k",
    icon: "clock",
    grad: "cyan",
    title: "The 4,000 Watch Hours Acceleration Plan",
    tagline: "Monetization-ready watch time: the 90-day long-form retention builder.",
    days: 90,
    meta: ["Monetization track", "Long-form focused"],
    phases: [
      {
        title: "Retention Audit (Week 1)",
        desc: "Know where you bleed viewers before adding more fuel.",
        tasks: [
          { t: "Check your channel's average % viewed in Studio; set a baseline.", m: null },
          { t: "Identify your top 5 videos by retention and reverse-engineer their structure.", m: null },
          { t: "Measure your average view duration — set a +15% target for the quarter.", m: null },
          { t: "Run a channel audit and fix the top 3 flagged issues.", m: "audit" }
        ]
      },
      {
        title: "Long-Form Engine (Weeks 2-6)",
        desc: "Six >8-minute videos with hooks, chapters and payoffs.",
        tasks: [
          { t: "Publish video #1 (8min+). Script every section with time targets.", m: "factory" },
          { t: "Add chapters to every video to raise revisit value.", m: null },
          { t: "Apply the 'pattern interrupt every 90 seconds' rule in edits.", m: null },
          { t: "Create a binge series: part 1 always links parts 2 & 3.", m: null },
          { t: "Publish videos #2-#6 over 5 weeks; 1 per week minimum.", m: null }
        ]
      },
      {
        title: "Watch-Time Multipliers (Weeks 7-9)",
        desc: "Squeeze repeat views and session time from each asset.",
        tasks: [
          { t: "Add end screens pushing the next binge video on every upload.", m: null },
          { t: "Create 2 long-form companion videos to your highest-retained video.", m: null },
          { t: "Turn every long-form into 2-3 shorts linking back to the source.", m: null },
          { t: "Upload a 10-minute 'complete guide' pillar video in your niche.", m: null },
          { t: "Re-promote older videos with the 24H Viral Engine's evergreen picks.", m: "trends" }
        ]
      },
      {
        title: "Cross-Platform Gravity (Weeks 10-12)",
        desc: "Tap the Creator Exchange and external sessions.",
        tasks: [
          { t: "Complete 3 cross-promotions via the Creator Exchange.", m: "exchange" },
          { t: "Embed your videos in 2 written/audio platforms (forum, blog, podcast).", m: null },
          { t: "Start 1 community post per video with a retention-driving question.", m: null },
          { t: "Review: gap to 4,000 hours, and document in your plan log.", m: null }
        ]
      }
    ]
  },
  {
    id: "blueprint-3m",
    icon: "bolt",
    grad: "green",
    title: "The 3 Million Shorts Views Viral Blueprint",
    tagline: "The 30-day shorts machine: 1 short/day engineered for the feed.",
    days: 30,
    meta: ["Shorts focused", "Feed-native"],
    phases: [
      {
        title: "Feed Psychology (Day 1-3)",
        desc: "Understand the Shorts algorithm loop before you record.",
        tasks: [
          { t: "Watch 30 shorts in your niche; log every hook + retention device you see.", m: null },
          { t: "Define your 'replay bait' — the line or visual that makes people rewatch.", m: null },
          { t: "Set up Shorts branding: consistent colors, captions, and a signature opener.", m: null },
          { t: "Generate 15 Shorts ideas with the Script & Idea Factory (Shorts mode).", m: "factory" }
        ]
      },
      {
        title: "The Daily Drop (Day 4-21)",
        desc: "18 shorts in 18 days. Speed beats polish for feed training.",
        tasks: [
          { t: "Post 1 short per day. No exceptions. Batch-edit 3 at a time.", m: null },
          { t: "First 1.5 seconds must state the payoff or the curiosity gap.", m: "factory" },
          { t: "Loop edits: no dead air, cut every pause, keep it under 45s.", m: null },
          { t: "Write the 2-line hook as the short's pinned comment + community post.", m: null },
          { t: "Track daily: views, swipe-away, % watched. Stop repeating losers.", m: null }
        ]
      },
      {
        title: "Amplify Winners (Day 22-27)",
        desc: "Double down on whatever the feed rewards.",
        tasks: [
          { t: "Repost your top 3 performing shorts with 1 tweak (new hook, new caption).", m: null },
          { t: "Sequence 5 related shorts into a mini-series with '#part1' 'part2'.", m: null },
          { t: "Run your 3 best shorts' thumbnails through feedback rounds.", m: null },
          { t: "Cross-post your 2 best shorts on community plans/creator walls.", m: "community" }
        ]
      },
      {
        title: "Feed Lock-In (Day 28-30)",
        desc: "Consistency at the exact time your audience is awake.",
        tasks: [
          { t: "Publish at your single best hour for 3 straight days — note the lift.", m: null },
          { t: "Update your roadmap: bank the 3M Shorts badge.", m: "roadmap" },
          { t: "Package the formula as your own plan and publish it on the Community Plan Hub.", m: "community" }
        ]
      }
    ]
  }
];

/* ---------- Community Plan Hub seeds ---------- */
window.SEED_PLANS = [
  {
    id: "plan-f3", author: "MayaCodez", avatar: "#ff5ce1", title: "Dev Log To 1K: The 'Build In Public' Sprint",
    niche: "Programming", desc: "Publish one build-in-public dev log every week for 90 days. Beginners love honest progress; the algorithm love consistency.",
    steps: ["Commit to 12 dev log episodes on a calendar", "Film a 90-second progress clip every single day", "Weekly long-form: what broke + what shipped + one teachable", "Move every daily clip into the next Shorts feed", "End every video asking one coding question"],
    tags: ["Programming", "Build in public", "Dev logs"], difficulty: "Starters", timeEst: "12 weeks",
    views: "412k", saves: 1234, rating: 4.8, reviews: 87, cloned: 302, verified: true,
    votes: 154, comments: [{ u: "Tom", c: "The daily 90s clip trick doubled my channel activity.", d: "2d", up: 23 }]
  },
  {
    id: "plan-g2", author: "LenaRuns", avatar: "#00e5ff", title: "The Motivated Monday Formula",
    niche: "Fitness & Motivation", desc: "One 45-second motivational Short every Monday morning, built as a countdown template. Repetition trains the feed to group your audience.",
    steps: ["Create one reusable Shorts template (intro card + countdown + payoff)", "Record the week's line every Sunday in under 10 minutes", "Post Monday 8am. Pin a poll with next week's topic", "Reply to every comment within the first hour", "Chart swipe-away rate weekly; kill any template under 70% viewed"],
    tags: ["Fitness", "Short-form", "Routine"], difficulty: "Starters", timeEst: "4 weeks",
    views: "88k", saves: 211, rating: 4.5, reviews: 32, cloned: 121, verified: false,
    votes: 88, comments: [{ u: "Theo", c: "Template + repetition is the science part. Love this.", d: "5d", up: 11 }]
  },
  {
    id: "plan-a7", author: "StudyPilot", avatar: "#ffb547", title: "The Campus Collab Engine: Study-With-Me Network",
    niche: "Study / Productivity", desc: "Get 4,000 watch hours fast by building a study-with-me network: react to each other's live streams and swap pre-roll cross-promos every Friday.",
    steps: ["Recruit 4 same-size study channels from the Creator Exchange", "Weekly 'Study Together' stream rotation (2h each, 5x a week)", "Friday cross-promo: 1 channel features you in their pre-roll, you feature them", "Turn each stream's highlight into a 12-minute long-form", "Track watch time weekly in the roadmap"],
    tags: ["Study", "Collab", "Network"], difficulty: "Intermediate", timeEst: "8 weeks",
    views: "205k", saves: 344, rating: 4.7, reviews: 51, cloned: 177, verified: true,
    votes: 121, comments: [{ u: "Avery", c: "We ran this with 5 channels and hit 4k hours in 6 weeks.", d: "1d", up: 34 }]
  },
  {
    id: "plan-c9", author: "PocketAI", avatar: "#00ff88", title: "The AI-Powered Zero-Edit Upload",
    niche: "AI / Tech", desc: "Fully automated content: feed raw screen recordings and script notes into a pipeline, publish hands-free, and reinvest time into the one creative thing that matters.",
    steps: ["Voice-note every mistake you make while building with AI tools", "Screen-record every fix as you make it (2-3 clips a day)", "Assemble a weekly 8-minute 'what actually worked' video", "Publish a cold-open demo Short from your best clip", "Use the CTR Predictor before uploads; A/B 2 titles weekly"],
    tags: ["AI", "Tech", "Automation"], difficulty: "Intermediate", timeEst: "6 weeks",
    views: "1.1m", saves: 902, rating: 4.9, reviews: 143, cloned: 521, verified: true,
    votes: 233, comments: [{ u: "Devin", c: "Zero-edit is genius for consistency.", d: "3d", up: 41 }]
  },
  {
    id: "plan-h1", author: "NomadChef", avatar: "#ff4757", title: "The 60-Second Restaurant Critic",
    niche: "Food & Travel", desc: "Review any venue in 60 seconds with one fixed structure. Local search traffic pours in, and every 'video location' tag feeds the Shorts map layer.",
    steps: ["Shoot a 10-second b-roll intro in 4K", "Deliver the verdict line within second 3", "Fixed rating card: Taste / Price / Vibe / Would-revisit", "Tag the exact location; write the menu's hero dish in the description", "Cross-post the Short to the Creator Exchange for food niche swaps"],
    tags: ["Food", "Local", "Short-form"], difficulty: "Starters", timeEst: "8 weeks",
    views: "640k", saves: 655, rating: 4.6, reviews: 74, cloned: 286, verified: false,
    votes: 167, comments: [{ u: "Rosa", c: "The location tag tip is underrated. Huge local reach.", d: "6d", up: 19 }]
  },
  {
    id: "plan-l4", author: "GigaBytes", avatar: "#a97bff", title: "The 'Explain Like 5 Steps' Tech Pyramid",
    niche: "Gaming / Tech", desc: "Every complex gaming/tech topic becomes a 5-level pyramid video. Each level is a hook for the next — retention spikes on the curiosity ladder.",
    steps: ["Pick a 'simple question, deep answer' topic", "Structure: Level 1 answer in 10s → Level 5 answer in 10 min", "Each level boundary gets a visual 'LEVEL UP' card (retention anchor)", "Shorts = single level; Long-form = full pyramid", "Batch 3 topics, film the ladder once, cut 5 assets"],
    tags: ["Gaming", "Tech", "Retention"], difficulty: "Advanced", timeEst: "4 weeks",
    views: "350k", saves: 405, rating: 4.7, reviews: 59, cloned: 198, verified: false,
    votes: 102, comments: [{ u: "Kai", c: "Level-up cards kept my retention graph flat. Big.", d: "8d", up: 15 }]
  }
];

window.SEED_POSTS = [
  { id: "p1", u: "LenaRuns", avatar: "#00e5ff", niche: "Fitness", size: "3.2k", type: "Shoutout swap", msg: "Looking for 3 channels under 5k in fitness/motivation. We shout each other out in Friday Shorts. Countdown template ready.", votes: 38 },
  { id: "p2", u: "PocketAI", avatar: "#00ff88", niche: "AI / Tech", size: "8.1k", type: "Collab", msg: "AI tooling review channel. Want one video per quarter with a programming channel — 'AI can & can't' crossover. Reply in comments.", votes: 51 },
  { id: "p3", u: "StudyPilot", avatar: "#ffb547", niche: "Study", size: "1.9k", type: "Live-stream train", msg: "Study-with-me crew needs 3 more channels for a Friday rotation. Same-time live streams, mutual pre-roll features. PM via comment.", votes: 29 },
  { id: "p4", u: "NomadChef", avatar: "#ff4757", niche: "Food", size: "5.4k", type: "Featured spot", msg: "I feature one small local channel per month in a 'hidden gems' Short. Free, no strings. Send your best dish clip.", votes: 44 },
  { id: "p5", u: "MayaCodez", avatar: "#ff5ce1", niche: "Programming", size: "2.4k", type: "Collab", msg: "Build-in-public dev who wants to react to another dev's week of commits. Casual, honest, cross-posted. Any stack.", votes: 17 },
  { id: "p6", u: "GigaBytes", avatar: "#a97bff", niche: "Gaming", size: "9.9k", type: "Shoutout swap", msg: "Esports recap channel. Posting 2 'channel of the week' features — swap a 20s pre-roll with a gaming creator under 12k.", votes: 23 }
];

/* ---------- 24H Viral Engine: fallback dataset (used offline / if feeds block CORS) ---------- */
window.TREND_FALLBACK = [
  { title: "We tested 3 AI tools that code better than most devs", cat: "Tech", views: "2.1M views", hours: 18, likes: "184K", verified: true },
  { title: "The 30-Second Morning Routine That Fixed My Focus", cat: "Productivity", views: "1.7M views", hours: 6, likes: "142K", verified: false },
  { title: "I Built a $0 Studio Rig That Shoots Cinema Quality", cat: "Creator", views: "980K views", hours: 22, likes: "88K", verified: true },
  { title: "Why Viral Shorts Die in 48 Hours (Study)", cat: "Short-form", views: "1.2M views", hours: 4, likes: "96K", verified: false },
  { title: "The Gym Hack That Unlocked My Plateau in 3 Weeks", cat: "Fitness", views: "1.5M views", hours: 12, likes: "121K", verified: false },
  { title: "Ranking 5 Budget SSDs — The Surprise Winner", cat: "Tech", views: "760K views", hours: 30, likes: "63K", verified: true },
  { title: "Study With Me: 4-Hour Silent Final Exam Sprint", cat: "Study", views: "2.6M views", hours: 10, likes: "205K", verified: false },
  { title: "Local Street Food: The $2 Sandwich That Went Viral", cat: "Food", views: "3.3M views", hours: 8, likes: "298K", verified: false },
  { title: "I Let an AI Run My Channel For 7 Days", cat: "AI", views: "1.9M views", hours: 14, likes: "166K", verified: true },
  { title: "This Editing Trick Keeps People Watching (Retention Science)", cat: "Creator", views: "1.1M views", hours: 26, likes: "94K", verified: true }
];

/* Keyword → niche suggestions for the trend engine */
window.TREND_MAP = [
  { k: ["gpt", "ai ", "chatgpt", "ai tool", "llm", "model", "neural", "prompt"], niche: "AI & Tech", action: "Create a 'test/demo/compare' AI Short within 12h" },
  { k: ["workout", "gym", "fitness", "diet", "muscle", "fat", "protein"], niche: "Fitness", action: "Hook-swipe Short: the one-line fix + rapid b-roll" },
  { k: ["money", "crypto", "invest", "passive", "save", "budget", "finance"], niche: "Finance", action: "Cold-open claim Short, then long-form explainer" },
  { k: ["food", "recipe", "cook", "street", "restaurant", "tasty"], niche: "Food", action: "POV 60s review or recipe — add location tag" },
  { k: ["game", "gaming", "esports", "minecraft", "fortnite", "ranked", "stream"], niche: "Gaming", action: "Top-3 trick clip + vertical gameplay edit" },
  { k: ["study", "exam", "focus", "productivity", "note", "schedule"], niche: "Study / Self-improvement", action: "‘Study with me' scene + one actionable tip" },
  { k: ["build", "code", "dev", "programming", "software", "debug"], niche: "Programming", action: "Build-in-public clip with a satisfying 'before/after'" },
  { k: ["shorts", "viral", "creator", "youtube", "edit", "retention", "thumbnails"], niche: "Creator economy", action: "Behind-the-numbers meta video (they always pull)" }
];

/* ---------- Script & Idea Factory templates ---------- */
window.FACTORY = {
  niches: ["Tech & AI", "Gaming", "Fitness & Health", "Finance", "Food & Travel", "Study & Productivity", "Programming", "Creator Economy", "Lifestyle", "Science"],
  tones: ["Energetic", "Calm teacher", "Storyteller", "Cold + confident", "Funny / meme", "Raw & honest"],
  shortsLengths: ["Under 30 seconds", "30-45 seconds", "45-60 seconds"],
  ctas: ["Subscribe for part 2", "Follow for daily fixes", "Comment your take", "Save this for later", "Share with one friend", "Check the pinned comment"],
  hookFormulas: [
    { name: "Direct promise", demo: "I found [X] that [Y] in [Z time].", use: "Great for how-to and tooling videos" },
    { name: "Curiosity gap", demo: "Nobody talks about [weird detail], which is exactly why [topic] works.", use: "Great for niche topics and finance" },
    { name: "Provocative question", demo: "Why do [experts] keep telling you [wrong thing]?", use: "Great for debates and myth-busting" },
    { name: "Number stack", demo: "3 rules, 2 mistakes, 1 secret — [topic] in 60 seconds.", use: "Great for Shorts" },
    { name: "Story open", demo: "I tried [thing] every day for [N] days and [shocking result].", use: "Great for long-form and vlogs" },
    { name: "Pattern interrupt", demo: "Stop watching if you want to stay average at [topic].", use: "Great for feed grabs" }
  ],
  structures: {
    short: [
      { name: "Hook (0-3s)", desc: "Payoff or curiosity gap in one line. Reward immediately visible." },
      { name: "Body (3-40s)", desc: "3 rapid beats, one per change of visual. No dead air, loop the ending." },
      { name: "Loop / CTA (last 3s)", desc: "First line repeats visually → replay bait. CTA either before or via pinned comment." }
    ],
    long: [
      { name: "Cold open (0-30s)", desc: "Deliver the promise in the first 15s. Current average view time is brutal here." },
      { name: "Context (30-90s)", desc: "Fastest possible stakes-setting. Why this matters, who it's for." },
      { name: "Content blocks (each 2-4min)", desc: "One idea per chapter, hook first line of every chapter, pattern-interrupt edits." },
      { name: "Value + CTA block", desc: "Summarize the 3 takeaways, then one clear call to action." },
      { name: "Outro", desc: "Next video tease + end screen to the binge stack." }
    ]
  },
  ideaMash: [
    (n) => `I tried the most controversial ${n} hack for 7 days`,
    (n) => `${n} in 2026: what actually changed (no fluff)`,
    (n) => `3 mistakes that are quietly killing your ${n} progress`,
    (n) => `The $0 beginner setup for ${n} that performs like pro gear`,
    (n) => `Experts won't tell you this about ${n} (study breakdown)`,
    (n) => `How to learn ${n} in 30 minutes a day`,
    (n) => `The ${n} rabbit hole: 5 tools that blew my mind`,
    (n) => `Reacting to the WORST ${n} advice on the internet`,
    (n) => `From zero: my honest 90-day ${n} experiment`,
    (n) => `${n} tier list — everything ranked so you don't waste money`
  ]
};