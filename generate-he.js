#!/usr/bin/env node
// Generates he.html — a fully pre-translated Hebrew version of index.html.
// Run:  node generate-he.js
'use strict';
const fs = require('fs');

let html = fs.readFileSync('/home/user/selalabs/index.html', 'utf8');

// ── helpers ──────────────────────────────────────────────────────────────────
const replaceAll = (src, en, he) => src.split(en).join(he);

// Replace "Start a project" whether followed by newline (nav button with SVG) or </a>
function replaceStartProject(src) {
  return src.replace(/>Start a project(\n|<\/a>)/g, (_, after) =>
    `>התחילו פרויקט${after}`);
}

// ── structural ────────────────────────────────────────────────────────────────

// lang / dir
html = html.replace(
  'id="top" lang="en" class="scroll-smooth"',
  'id="top" lang="he" dir="rtl" class="scroll-smooth"'
);

// Remove flash-prevention inline script (we're already in Hebrew)
html = html.replace(/\n  <!-- Apply saved language.*?<\/script>/s, '');

// Page title
html = html.replace(
  'SelaLabs — AI-Powered Software, Engineered &amp; Deployed</title>',
  'SelaLabs — תוכנה מבוססת AI, מפותחת ומשובצת</title>'
);

// meta description
html = html.replace(
  'SelaLabs is a high-tech software studio that builds custom software for your needs — combining cutting-edge AI with senior engineers deployed directly into your team.',
  'SelaLabs היא סטודיו תוכנה היי‑טק שבונה תוכנה מותאמת אישית לצרכים שלכם — שילוב של AI מתקדם עם מהנדסים בכירים שאנחנו משבצים ישירות בצוות שלכם.'
);

// OG title
html = html.replace(
  'og:title" content="SelaLabs — AI-Powered Software, Engineered &amp; Deployed"',
  'og:title" content="SelaLabs — תוכנה מבוססת AI, מפותחת ומשובצת"'
);

// OG description
html = html.replace(
  'content="Custom software built for your needs with AI and deployed senior engineers."',
  'content="תוכנה מותאמת אישית לצרכים שלכם עם AI ומהנדסים בכירים."'
);

// hreflang — add after favicon link
html = html.replace(
  '  <link rel="icon" type="image/svg+xml" href="favicon.svg" />\n',
  '  <link rel="icon" type="image/svg+xml" href="favicon.svg" />\n' +
  '  <link rel="alternate" hreflang="en" href="index.html" />\n' +
  '  <link rel="alternate" hreflang="he" href="he.html" />\n'
);

// Remove i18n.js (not needed — content is already Hebrew)
html = html.replace('\n  <script src="i18n.js" defer></script>', '');

// ── language toggle → link to English site ────────────────────────────────────
const usFlag = `<svg class="block h-3.5 w-5" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="24" height="16" fill="#ffffff"/>
              <g fill="#b22234">
                <rect width="24" height="1.23"/><rect y="2.46" width="24" height="1.23"/><rect y="4.92" width="24" height="1.23"/><rect y="7.38" width="24" height="1.23"/><rect y="9.85" width="24" height="1.23"/><rect y="12.3" width="24" height="1.23"/><rect y="14.77" width="24" height="1.23"/>
              </g>
              <rect width="10.4" height="8.6" fill="#3c3b6e"/>
              <g fill="#ffffff">
                <circle cx="1.7" cy="1.5" r="0.42"/><circle cx="4.2" cy="1.5" r="0.42"/><circle cx="6.7" cy="1.5" r="0.42"/><circle cx="9.2" cy="1.5" r="0.42"/>
                <circle cx="2.95" cy="3" r="0.42"/><circle cx="5.45" cy="3" r="0.42"/><circle cx="7.95" cy="3" r="0.42"/>
                <circle cx="1.7" cy="4.5" r="0.42"/><circle cx="4.2" cy="4.5" r="0.42"/><circle cx="6.7" cy="4.5" r="0.42"/><circle cx="9.2" cy="4.5" r="0.42"/>
                <circle cx="2.95" cy="6" r="0.42"/><circle cx="5.45" cy="6" r="0.42"/><circle cx="7.95" cy="6" r="0.42"/>
                <circle cx="1.7" cy="7.5" r="0.42"/><circle cx="4.2" cy="7.5" r="0.42"/><circle cx="6.7" cy="7.5" r="0.42"/><circle cx="9.2" cy="7.5" r="0.42"/>
              </g>
            </svg>`;

html = html.replace(
  /        <!-- Language toggle -->\n        <button[^>]*>[\s\S]*?<\/button>/,
  `        <!-- Language toggle -->
        <a href="index.html" class="inline-flex items-center gap-2 rounded-lg border-2 border-ink-900 bg-white px-2.5 py-2 font-mono text-xs font-bold uppercase tracking-wide text-ink-900 transition hover:bg-brand-100" aria-label="Switch to English" title="Switch to English">
          <span class="overflow-hidden rounded-[2px] ring-1 ring-ink-200">
            ${usFlag}
          </span>
          EN
        </a>`
);

// ── nav & mobile menu ─────────────────────────────────────────────────────────
html = replaceAll(html, '>Services</a>', '>שירותים</a>');
html = replaceAll(html, '>Process</a>', '>תהליך</a>');
html = replaceStartProject(html);
html = html.replace('aria-label="Open menu"', 'aria-label="פתחו תפריט"');

// ── hero ──────────────────────────────────────────────────────────────────────
html = replaceAll(html, 'AI-native software studio', 'סטודיו תוכנה מבוסס AI');
html = replaceAll(html, 'Software embedded within your business', 'תוכנה משובצת בתוך העסק שלכם');
html = html.replace(
  /We focus on data automation[^<]+<strong[^>]+>tailored to your needs<\/strong>\./,
  'בונים מגוון מערכת מידע — מאוטומציות נתונים עד להשתלת מערכת בינה מלכותית.'
);
html = replaceAll(html, '>Explore services<', '>גלו את השירותים<');
html = replaceAll(html, '> AI-augmented delivery<', '> פיתוח מואץ ב‑AI<');
html = replaceAll(html, '> Senior, embedded engineers<', '> מהנדסים בכירים, משובצים בצוות<');
html = replaceAll(html, '> Shipping secure software<', '> משיקים תוכנה מאובטחת<');
html = replaceAll(html, '>AI throughput<', '>תפוקת AI<');
html = replaceAll(html, '>Secured systems<', '>מערכות מובטחת<');

// ── marquee ───────────────────────────────────────────────────────────────────
html = replaceAll(html, '>Built with the modern stack<', '>בנוי עם הטכנולוגיות המובילות<');

// ── services ──────────────────────────────────────────────────────────────────
html = replaceAll(html, '>What we build<', '>מה אנחנו בונים<');
html = html.replace(
  'End-to-end software, tailored to your&nbsp;<span class="gradient-text">needs</span>',
  'תוכנה מקצה לקצה, מותאמת&nbsp;<span class="gradient-text">לצרכים שלכם</span>'
);
html = replaceAll(html,
  "From a first prototype to systems running at scale — we cover the full lifecycle so you don't have to assemble a team.",
  'מאב־טיפוס ראשון ועד מערכות בקנה מידה גדול — אנחנו מכסים את כל מחזור החיים כדי שלא תצטרכו להרכיב צוות.'
);
html = replaceAll(html, '>Custom software<', '>תוכנה בהתאמה אישית<');
html = replaceAll(html,
  '>Web platforms, internal tools, and APIs built around your workflows — not a rigid template.<',
  '>פלטפורמות web, כלים פנימיים ו‑APIs שנבנים סביב תהליכי העבודה שלכם — לא תבנית נוקשה.<'
);
html = replaceAll(html, '>AI &amp; LLM integration<', '>שילוב AI ו‑LLM<');
html = replaceAll(html,
  '>Agents, RAG, and MCP servers wired into your product — so AI models can talk directly to your services, data, and internal tools.<',
  '>סוכנים, RAG ושרתי MCP משולבים במוצר שלכם — כך מודלי AI יכולים לדבר ישירות עם השירותים, הנתונים והכלים הפנימיים שלכם.<'
);
html = replaceAll(html, '>Cloud &amp; DevOps<', '>ענן ו‑DevOps<');
html = replaceAll(html,
  '>Scalable infrastructure, CI/CD, and observability so your product stays fast, secure, and reliable.<',
  '>תשתית מתרחבת, CI/CD ויכולת ניטור כדי שהמוצר שלכם יישאר מהיר, מאובטח ואמין.<'
);
html = replaceAll(html, '>Data &amp; ML<', '>דאטה ולמידת מכונה<');
html = replaceAll(html,
  '>Pipelines, dashboards, and machine-learning models that turn raw data into decisions.<',
  '>צינורות נתונים, דשבורדים ומודלים של למידת מכונה שהופכים נתונים גולמיים להחלטות.<'
);
html = replaceAll(html, '>Product engineering<', '>הנדסת מוצר<');
html = replaceAll(html,
  '>Discovery, design, and delivery as one squad — from idea to a polished product users love.<',
  '>מחקר, עיצוב ופיתוח כצוות אחד — מרעיון ועד מוצר מלוטש שמשתמשים אוהבים.<'
);
html = replaceAll(html, '>Legacy modernization<', '>מודרניזציה של מערכות ישנות<');
html = replaceAll(html,
  '>Migrate, refactor, and rebuild aging systems into maintainable, AI-ready architectures.<',
  '>מיגרציה, ריפקטור ובנייה מחדש של מערכות מיושנות לארכיטקטורות תחזוקתיות ומוכנות ל‑AI.<'
);

// ── process ───────────────────────────────────────────────────────────────────
html = replaceAll(html, '>How we work<', '>איך אנחנו עובדים<');
html = html.replace(
  '>A clear path from data&nbsp;in to insight&nbsp;out<',
  '>מסלול ברור מנתון ועד תובנה<'
);
html = replaceAll(html,
  '>A lightweight process built around your data flows, from import to visualization.<',
  '>תהליך קליל סביב זרימת הנתונים שלכם — מייבוא ועד להמחשה.<'
);
html = replaceAll(html, '>Discover<', '>אפיון<');
html = replaceAll(html,
  '>We map your data sources, formats, business rules, and target systems to define the right pipeline for your operations.<',
  '>ממפים את מקורות הנתונים, הפורמטים, כללי העסק ומערכות היעד שלכם כדי לתכנן את הצינור הנכון לפעילות.<'
);
html = replaceAll(html, '>Architect<', '>ארכיטקטורה<');
html = replaceAll(html,
  '>We design a scalable import/export architecture with transformation logic, internal tooling, and connectors built for your stack.<',
  '>מתכננים ארכיטקטורת ייבוא/ייצוא מתרחבת עם לוגיקת טרנספורמציה, כלים פנימיים ומחברים שנבנו לסטאק שלכם.<'
);
html = replaceAll(html, '>Build &amp; deploy<', '>פיתוח והשקה<');
html = replaceAll(html,
  '>We build import pipelines, processing layers, export adapters, and dashboards — shipping each increment to production weekly.<',
  '>בונים צינורות ייבוא, שכבות עיבוד, מתאמי ייצוא ודשבורדים — ומשיקים כל תוספת לייצור מדי שבוע.<'
);
html = replaceAll(html, '>Scale &amp; support<', '>הרחבה ותמיכה<');
html = replaceAll(html,
  '>We harden for data volume, add monitoring, and stay on for ongoing support and security updates — so your system keeps running safely as it grows.<',
  '>מחזקים לנפחי נתונים, מוסיפים ניטור ונשארים לתמיכה שוטפת ועדכוני אבטחה — כדי שהמערכת שלכם תמשיך לפעול בבטחה תוך כדי צמיחה.<'
);

// ── CTA ───────────────────────────────────────────────────────────────────────
html = replaceAll(html, '>Have something to build?<', '>יש לכם משהו לבנות?<');
html = replaceAll(html,
  "Tell us what you need. We'll come back with a plan, a timeline, and the team to make it real.",
  'ספרו לנו מה אתם צריכים. נחזור אליכם עם תוכנית, לוח זמנים והצוות שיהפוך את זה למציאות.'
);

// ── contact ───────────────────────────────────────────────────────────────────
html = replaceAll(html, '>Get in touch<', '>צרו קשר<');
html = replaceAll(html, ">Let's scope your project<", '>בואו נאפיין את הפרויקט שלכם<');
html = replaceAll(html,
  "Share a few details and we'll reply within one business day. No obligation, no sales pressure.",
  'השאירו כמה פרטים ונחזור אליכם תוך יום עסקים אחד. ללא התחייבות וללא לחץ מכירתי.'
);
// contact info labels (span inside the link)
html = html.replace(
  '<span class="block text-xs uppercase tracking-wide text-ink-400">Email</span>',
  '<span class="block text-xs uppercase tracking-wide text-ink-400">אימייל</span>'
);
html = html.replace(
  '<span class="block text-xs uppercase tracking-wide text-ink-400">Remote-first</span>',
  '<span class="block text-xs uppercase tracking-wide text-ink-400">עבודה מרחוק</span>'
);
html = replaceAll(html, '>Working worldwide<', '>עובדים מכל העולם<');

// form labels & placeholders
html = html.replace(
  'for="name" class="mb-1.5 block text-sm font-medium text-ink-700">Name<',
  'for="name" class="mb-1.5 block text-sm font-medium text-ink-700">שם<'
);
html = html.replace(
  'for="email" class="mb-1.5 block text-sm font-medium text-ink-700">Email<',
  'for="email" class="mb-1.5 block text-sm font-medium text-ink-700">אימייל<'
);
html = html.replace(
  'for="company" class="mb-1.5 block text-sm font-medium text-ink-700">Company <',
  'for="company" class="mb-1.5 block text-sm font-medium text-ink-700">חברה <'
);
html = replaceAll(html, '>(optional)<', '>(אופציונלי)<');
html = html.replace(
  'for="message" class="mb-1.5 block text-sm font-medium text-ink-700">What do you want to build?<',
  'for="message" class="mb-1.5 block text-sm font-medium text-ink-700">מה תרצו לבנות?<'
);
html = html.replace('placeholder="Jane Doe"', 'placeholder="ישראל ישראלי"');
html = html.replace('placeholder="jane@company.com"', 'placeholder="israel@company.com"');
html = html.replace('placeholder="Acme Inc."', 'placeholder=\'אקמה בע"מ\'');
html = html.replace(
  'placeholder="A short description of your project, goals, and timeline."',
  'placeholder="תיאור קצר של הפרויקט, המטרות ולוח הזמנים."'
);
html = replaceAll(html, '>Send message\n', '>שליחת הודעה\n');

// ── footer ────────────────────────────────────────────────────────────────────
html = replaceAll(html,
  '>High-tech software, powered by AI and shipped by engineers we deploy with your team.<',
  '>תוכנה היי‑טק, מופעלת ב‑AI ומסופקת על־ידי מהנדסים שאנחנו משבצים בצוות שלכם.<'
);
// Footer nav headings
html = html.replace(
  'class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Company<',
  'class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">חברה<'
);
html = html.replace(
  'class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Get started<',
  'class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">להתחלה<'
);
// Footer nav links (Services, Process already handled above via '>Services</a>')
html = replaceAll(html, '>SelaLabs. All rights reserved.<', '>SelaLabs. כל הזכויות שמורות.<');
html = replaceAll(html, '>Built with AI &amp; engineers who ship.<', '>נבנה עם AI ומהנדסים שמספקים תוצאות.<');

// ── write ─────────────────────────────────────────────────────────────────────
fs.writeFileSync('/home/user/selalabs/he.html', html, 'utf8');
console.log('he.html written ✓');
