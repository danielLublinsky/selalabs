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
    "Software embedded within your business": "תוכנה משובצת בתוך העסק שלכם",
    "We focus on data automation — from the smallest workflow to full import/export pipelines. Any size, any complexity,":
      "אנחנו מתמקדים באוטומציית נתונים — מהתהליך הקטן ביותר ועד צינורות ייבוא/ייצוא מלאים. כל גודל, כל מורכבות,",
    "tailored to your needs": "לצרכים שלכם",
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
    "Agents, RAG, and MCP servers wired into your product — so AI models can talk directly to your services, data, and internal tools.":
      "סוכנים, RAG ושרתי MCP משולבים במוצר שלכם — כך מודלי AI יכולים לדבר ישירות עם השירותים, הנתונים והכלים הפנימיים שלכם.",
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
    "A clear path from data in to insight out": "מסלול ברור מנתון ועד תובנה",
    "A lightweight process built around your data flows, from import to visualization.":
      "תהליך קליל סביב זרימת הנתונים שלכם — מייבוא ועד להמחשה.",
    "Discover": "אפיון",
    "We map your data sources, formats, business rules, and target systems to define the right pipeline for your operations.":
      "ממפים את מקורות הנתונים, הפורמטים, כללי העסק ומערכות היעד שלכם כדי לתכנן את הצינור הנכון לפעילות.",
    "Architect": "ארכיטקטורה",
    "We design a scalable import/export architecture with transformation logic, internal tooling, and connectors built for your stack.":
      "מתכננים ארכיטקטורת ייבוא/ייצוא מתרחבת עם לוגיקת טרנספורמציה, כלים פנימיים ומחברים שנבנו לסטאק שלכם.",
    "Build & deploy": "פיתוח והשקה",
    "We build import pipelines, processing layers, export adapters, and dashboards — shipping each increment to production weekly.":
      "בונים צינורות ייבוא, שכבות עיבוד, מתאמי ייצוא ודשבורדים — ומשיקים כל תוספת לייצור מדי שבוע.",
    "Scale & support": "הרחבה ותמיכה",
    "We harden for data volume, add monitoring, and stay on for ongoing support and security updates — so your system keeps running safely as it grows.":
      "מחזקים לנפחי נתונים, מוסיפים ניטור ונשארים לתמיכה שוטפת ועדכוני אבטחה — כדי שהמערכת שלכם תמשיך לפעול בבטחה תוך כדי צמיחה.",

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
