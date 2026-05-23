// SelaLabs — lightweight bilingual (EN/HE) switcher.
// Single source of truth: the English DOM. Hebrew is applied at runtime by
// matching each text node against the dictionary below, so there is no second
// HTML file to keep in sync.
(function () {
  "use strict";

  // Normalised English text  ->  Hebrew
  var HE = {
    // ---- nav ----
    "Services": "שירותים",
    "Process": "תהליך",
    "Start a project": "התחילו פרויקט",

    // ---- hero ----
    "AI-native software studio": "סטודיו תוכנה מבוסס AI",
    "We build the software": "אנחנו בונים את התוכנה",
    "your business needs —": "שהעסק שלכם צריך —",
    "powered by AI,": "מופעלת על־ידי AI,",
    "shipped by engineers": "ונשלחת על־ידי מהנדסים",
    "SelaLabs pairs cutting-edge AI with senior engineers we":
      "SelaLabs משלבת AI מתקדם עם מהנדסים בכירים שאנחנו",
    "deploy directly into your team": "משבצים ישירות בצוות שלכם",
    ". You get the speed of automation and the judgment of people who ship.":
      ". כך אתם מקבלים את מהירות האוטומציה ואת שיקול הדעת של אנשים שמספקים תוצאות.",
    "Explore services": "גלו את השירותים",
    "AI-augmented delivery": "פיתוח מואץ ב‑AI",
    "Senior, embedded engineers": "מהנדסים בכירים, משובצים בצוות",
    "Ship in weeks, not quarters": "משיקים בשבועות, לא ברבעונים",
    "AI throughput": "תפוקת AI",
    "Engineers deployed": "מהנדסים משובצים",

    // ---- marquee ----
    "Built with the modern stack": "בנוי עם הטכנולוגיות המובילות",

    // ---- services ----
    "What we build": "מה אנחנו בונים",
    "End-to-end software, tailored to your": "תוכנה מקצה לקצה, מותאמת",
    "needs": "לצרכים שלכם",
    "From a first prototype to systems running at scale — we cover the full lifecycle so you don't have to assemble a team.":
      "מאב־טיפוס ראשון ועד מערכות בקנה מידה גדול — אנחנו מכסים את כל מחזור החיים כדי שלא תצטרכו להרכיב צוות.",
    "Custom software": "תוכנה בהתאמה אישית",
    "Web platforms, internal tools, and APIs built around your workflows — not a rigid template.":
      "פלטפורמות web, כלים פנימיים ו‑APIs שנבנים סביב תהליכי העבודה שלכם — לא תבנית נוקשה.",
    "AI & LLM integration": "שילוב AI ו‑LLM",
    "Agents, copilots, RAG, and automation wired into your product and operations — safely and measurably.":
      "סוכנים, קו־פיילוטים, RAG ואוטומציה משולבים במוצר ובתפעול שלכם — בבטחה ובאופן מדיד.",
    "Cloud & DevOps": "ענן ו‑DevOps",
    "Scalable infrastructure, CI/CD, and observability so your product stays fast, secure, and reliable.":
      "תשתית מתרחבת, CI/CD ויכולת ניטור כדי שהמוצר שלכם יישאר מהיר, מאובטח ואמין.",
    "Data & ML": "דאטה ולמידת מכונה",
    "Pipelines, dashboards, and machine-learning models that turn raw data into decisions.":
      "צינורות נתונים, דשבורדים ומודלים של למידת מכונה שהופכים נתונים גולמיים להחלטות.",
    "Product engineering": "הנדסת מוצר",
    "Discovery, design, and delivery as one squad — from idea to a polished product users love.":
      "מחקר, עיצוב ופיתוח כצוות אחד — מרעיון ועד מוצר מלוטש שמשתמשים אוהבים.",
    "Legacy modernization": "מודרניזציה של מערכות ישנות",
    "Migrate, refactor, and rebuild aging systems into maintainable, AI-ready architectures.":
      "מיגרציה, ריפקטור ובנייה מחדש של מערכות מיושנות לארכיטקטורות תחזוקתיות ומוכנות ל‑AI.",

    // ---- process ----
    "How we work": "איך אנחנו עובדים",
    "A clear path from idea to impact": "מסלול ברור מרעיון ועד תוצאה",
    "A lightweight process that keeps you in the loop and momentum high.":
      "תהליך קליל שמשאיר אתכם מעודכנים ושומר על קצב גבוה.",
    "Discover": "אפיון",
    'We map your goals, constraints, and users to define what "done" really means.':
      "ממפים את המטרות, האילוצים והמשתמשים שלכם כדי להגדיר מה זה באמת „גמור”.",
    "Architect": "ארכיטקטורה",
    "We design a pragmatic, scalable architecture and a plan to ship value early.":
      "מתכננים ארכיטקטורה פרקטית ומתרחבת ותוכנית לאספקת ערך כבר בשלבים הראשונים.",
    "Build & deploy": "פיתוח והשקה",
    "AI-augmented engineers ship in tight increments, in production, every week.":
      "מהנדסים בעזרת AI משיקים בצעדים קטנים, בסביבת ייצור, מדי שבוע.",
    "Scale & hand off": "הרחבה והעברה",
    "We harden, document, and transfer ownership so your team can run it confidently.":
      "מחזקים, מתעדים ומעבירים בעלות כדי שהצוות שלכם יוכל לתפעל בביטחון.",

    // ---- CTA ----
    "Have something to build?": "יש לכם משהו לבנות?",
    "Tell us what you need. We'll come back with a plan, a timeline, and the team to make it real.":
      "ספרו לנו מה אתם צריכים. נחזור אליכם עם תוכנית, לוח זמנים והצוות שיהפוך את זה למציאות.",

    // ---- contact ----
    "Get in touch": "צרו קשר",
    "Let's scope your project": "בואו נאפיין את הפרויקט שלכם",
    "Share a few details and we'll reply within one business day. No obligation, no sales pressure.":
      "השאירו כמה פרטים ונחזור אליכם תוך יום עסקים אחד. ללא התחייבות וללא לחץ מכירתי.",
    "Email": "אימייל",
    "Remote-first": "עבודה מרחוק",
    "Working worldwide": "עובדים מכל העולם",
    "Name": "שם",
    "Company": "חברה",
    "(optional)": "(אופציונלי)",
    "What do you want to build?": "מה תרצו לבנות?",
    "Send message": "שליחת הודעה",

    // ---- footer ----
    "High-tech software, powered by AI and shipped by engineers we deploy with your team.":
      "תוכנה היי‑טק, מופעלת ב‑AI ומסופקת על־ידי מהנדסים שאנחנו משבצים בצוות שלכם.",
    "Get started": "להתחלה",
    "SelaLabs. All rights reserved.": "SelaLabs. כל הזכויות שמורות.",
    "Built with AI & engineers who ship.": "נבנה עם AI ומהנדסים שמספקים תוצאות."
  };

  // Input placeholders, keyed by element id
  var PH = {
    name: "ישראל ישראלי",
    email: "israel@company.com",
    company: 'אקמה בע"מ',
    message: "תיאור קצר של הפרויקט, המטרות ולוח הזמנים."
  };

  var TITLE_HE = "SelaLabs — תוכנה מבוססת AI, מפותחת ומשובצת";
  var DESC_HE =
    "SelaLabs היא סטודיו תוכנה היי‑טק שבונה תוכנה מותאמת אישית לצרכים שלכם — שילוב של AI מתקדם עם מהנדסים בכירים שאנחנו משבצים ישירות בצוות שלכם.";

  function norm(s) {
    return s.replace(/\s+/g, " ").trim();
  }

  // Normalised lookup table
  var map = {};
  Object.keys(HE).forEach(function (k) {
    map[norm(k)] = HE[k];
  });

  // Capture every translatable text node (English is the canonical source)
  var items = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      var p = n.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      var tag = p.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT")
        return NodeFilter.FILTER_REJECT;
      if (p.closest && p.closest("[data-no-i18n]")) return NodeFilter.FILTER_REJECT;
      if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var node;
  while ((node = walker.nextNode())) {
    var orig = node.nodeValue;
    items.push({
      node: node,
      orig: orig,
      lead: (orig.match(/^\s*/) || [""])[0],
      trail: (orig.match(/\s*$/) || [""])[0],
      key: norm(orig)
    });
  }

  // Capture original placeholders / meta so we can restore English
  var phEls = {};
  Object.keys(PH).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) phEls[id] = { el: el, orig: el.getAttribute("placeholder") || "" };
  });
  var metaDesc = document.querySelector('meta[name="description"]');
  var origTitle = document.title;
  var origDesc = metaDesc ? metaDesc.getAttribute("content") : "";
  var menuBtn = document.querySelector("[data-menu-btn]");

  function apply(lang) {
    var he = lang === "he";
    var html = document.documentElement;
    html.lang = lang;
    html.dir = he ? "rtl" : "ltr";

    items.forEach(function (it) {
      if (he && map[it.key] !== undefined) {
        it.node.nodeValue = it.lead + map[it.key] + it.trail;
      } else {
        it.node.nodeValue = it.orig;
      }
    });

    Object.keys(phEls).forEach(function (id) {
      var rec = phEls[id];
      rec.el.setAttribute("placeholder", he && PH[id] ? PH[id] : rec.orig);
    });

    document.title = he ? TITLE_HE : origTitle;
    if (metaDesc) metaDesc.setAttribute("content", he ? DESC_HE : origDesc);
    if (menuBtn) menuBtn.setAttribute("aria-label", he ? "פתחו תפריט" : "Open menu");

    // The toggle shows the flag + code of the language you'll switch to next
    var target = he ? "en" : "he";
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-flag]"),
      function (el) {
        el.classList.toggle("hidden", el.getAttribute("data-flag") !== target);
      }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-lang-label]"),
      function (el) {
        el.textContent = he ? "EN" : "HE";
      }
    );

    try {
      localStorage.setItem("sela_lang", lang);
    } catch (e) {}
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-lang-toggle]"),
    function (btn) {
      btn.addEventListener("click", function () {
        apply(document.documentElement.lang === "he" ? "en" : "he");
      });
    }
  );

  var saved = "en";
  try {
    saved = localStorage.getItem("sela_lang") || "en";
  } catch (e) {}
  apply(saved);
})();
