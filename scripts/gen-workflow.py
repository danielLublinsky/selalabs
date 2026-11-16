#!/usr/bin/env python3
"""Generates the hero workflow diagrams (SVG + CSS keyframes + scenario data).
Run from the repo root:  python3 scripts/gen-workflow.py && npm run build
Rewrites the <figure data-wf> block in index.html/he.html and the workflow CSS in src/input.css.

Each scenario has its OWN pipeline: its own nodes, wiring and timeline.
  nodes  : key -> (column, row, kind)      column 0-2, row 0-5
  phases : ordered steps of the animation
           ('main', [(a, b), ...])  data moves a -> b (edges in one phase run in parallel)
           ('res',  [(a, b), ...])  a looks something up in b: packet goes out and comes back
  text   : per language, key -> [title, subtitle]
"""
import json, re

H, W = 38, 132
COLX = [6, 173, 340]
ROWY = [10 + 70 * i for i in range(6)]
VW, VH = 478, ROWY[5] + H + 6

# timeline, in seconds
START, TRAVEL, DWELL = 0.5, 0.7, 0.4
R_OUT, R_WAIT, R_BACK, R_DWELL = 0.4, 0.3, 0.4, 0.2
END_HOLD = 2.0

KIND_COLOR = {'trigger': '#ffe14d', 'agent': '#ffe14d', 'code': '#bae6fd', 'db': '#ddd6fe', 'docs': '#ddd6fe',
              'api': '#fbcfe8', 'server': '#fbcfe8', 'human': '#fdba74', 'out': '#a7f3d0'}
KIND_LABEL = {
    'en': {'trigger': 'TRIGGER', 'agent': 'AI AGENT', 'code': 'CODE', 'db': 'DATABASE', 'docs': 'DOCS',
           'api': 'API', 'server': 'SERVER', 'human': 'PERSON'},
    'he': {'trigger': 'טריגר', 'agent': 'סוכן AI', 'code': 'קוד', 'db': 'מסד נתונים', 'docs': 'מסמכים',
           'api': 'API', 'server': 'שרת', 'human': 'אדם'},
}

# ---------------------------------------------------------------- scenarios
SCENARIOS = [
 # 1. Soil lab — code does the parsing and statistics, the agent writes the advice, the agronomist signs
 {'nodes': {'trigger': (1, 0, 'trigger'),
            'lims': (0, 1, 'server'), 'parse': (1, 1, 'code'),
            'retest': (0, 2, 'out'), 'outlier': (1, 2, 'code'), 'results': (2, 2, 'db'),
            'crops': (0, 3, 'docs'), 'agent': (1, 3, 'agent'), 'weather': (2, 3, 'api'),
            'human': (1, 4, 'human'),
            'o1': (0, 5, 'out'), 'o2': (1, 5, 'out'), 'o3': (2, 5, 'out')},
  'phases': [('main', [('trigger', 'parse')]),
             ('res', [('parse', 'lims')]),
             ('main', [('parse', 'outlier')]),
             ('res', [('outlier', 'results')]),
             ('main', [('outlier', 'agent'), ('outlier', 'retest')]),
             ('res', [('agent', 'crops'), ('agent', 'weather')]),
             ('main', [('agent', 'human')]),
             ('main', [('human', 'o1'), ('human', 'o2'), ('human', 'o3')])],
  'en': {'tab': 'Soil lab',
         'desc': 'The analyzer finishes a batch. Code parses the file, matches each sample to its client and plot in the LIMS, and uses plain statistics to flag results that don’t fit past seasons — those go to retest. The agent writes a fertilizer plan per plot from crop tables and the forecast, and the agronomist signs before the client sees it.',
         'aria': 'Animated diagram. A finished analyzer run triggers a code step that parses the file and matches samples in the LIMS server. A second code step compares results with the results database and sends flagged samples to a retest queue. An AI agent writes a fertilizer plan using crop tables and a weather API. The agronomist reviews and signs. Then the client gets a PDF report, the signed report is archived and an invoice is created.',
         'n': {'trigger': ['Analyzer finished', 'CSV · 38 samples'],
               'lims': ['LIMS', 'Sample → client & plot'], 'parse': ['Parse + validate', 'Units · QC · duplicates'],
               'retest': ['Retest queue', '2 samples flagged'], 'outlier': ['Outlier check', 'Stats vs. past seasons'],
               'results': ['Results DB', '5 seasons per plot'],
               'crops': ['Crop tables', 'Needs by crop & stage'], 'agent': ['Agronomy agent', 'Fertilizer plan per plot'],
               'weather': ['Weather API', 'Rain in next 14 days'],
               'human': ['Agronomist', 'Reviews, edits, signs'],
               'o1': ['Client', 'PDF report by email'], 'o2': ['Archive', 'Signed report filed'],
               'o3': ['Billing', 'Invoice created']}},
  'he': {'tab': 'מעבדת קרקע',
         'desc': 'מכשיר המעבדה מסיים אצווה. קוד קורא את הקובץ, משייך כל דגימה ללקוח ולחלקה ב‑LIMS, ובעזרת סטטיסטיקה פשוטה מסמן תוצאות שלא מתאימות לעונות קודמות — אלה עוברות לבדיקה חוזרת. הסוכן כותב תוכנית דישון לכל חלקה לפי טבלאות גידול ותחזית, והאגרונום חותם לפני שהלקוח רואה אותה.',
         'aria': 'תרשים מונפש. סיום ריצה של מכשיר המעבדה מפעיל שלב קוד שקורא את הקובץ ומשייך דגימות בשרת ה‑LIMS. שלב קוד שני משווה את התוצאות למסד התוצאות ושולח דגימות חריגות לתור לבדיקה חוזרת. סוכן AI כותב תוכנית דישון בעזרת טבלאות גידול ושירות מזג אוויר. האגרונום בודק וחותם. לאחר מכן הלקוח מקבל דוח PDF, הדוח החתום נשמר בארכיון ומופקת חשבונית.',
         'n': {'trigger': ['המכשיר סיים ריצה', 'CSV · 38 דגימות'],
               'lims': ['LIMS', 'דגימה ללקוח ולחלקה'], 'parse': ['קריאה ובדיקה', 'יחידות · בקרה · כפילויות'],
               'retest': ['בדיקה חוזרת', '2 דגימות סומנו'], 'outlier': ['איתור חריגות', 'סטטיסטיקה מול עונות עבר'],
               'results': ['מסד תוצאות', '5 עונות לכל חלקה'],
               'crops': ['טבלאות גידול', 'צרכים לפי גידול ושלב'], 'agent': ['סוכן אגרונומי', 'תוכנית דישון לחלקה'],
               'weather': ['שירות מזג אוויר', 'גשם ב‑14 הימים הבאים'],
               'human': ['אגרונום', 'בודק, מתקן וחותם'],
               'o1': ['לקוח', 'דוח PDF במייל'], 'o2': ['ארכיון', 'הדוח החתום נשמר'],
               'o3': ['הנהלת חשבונות', 'חשבונית הופקה']}}},
 # 2. Customer reviews — one agent with tools, a code-enforced policy gate, a person approves
 {'nodes': {'trigger': (1, 0, 'trigger'),
            'crm': (0, 1, 'db'), 'match': (1, 1, 'code'), 'orders': (2, 1, 'db'),
            'voice': (0, 2, 'docs'), 'agent': (1, 2, 'agent'), 'carrier': (2, 2, 'api'),
            'policy': (1, 3, 'code'),
            'manager': (1, 4, 'human'),
            'o1': (0, 5, 'out'), 'o2': (1, 5, 'out'), 'o3': (2, 5, 'out')},
  'phases': [('main', [('trigger', 'match')]),
             ('res', [('match', 'crm'), ('match', 'orders')]),
             ('main', [('match', 'agent')]),
             ('res', [('agent', 'voice'), ('agent', 'carrier')]),
             ('main', [('agent', 'policy')]),
             ('main', [('policy', 'manager')]),
             ('main', [('manager', 'o1'), ('manager', 'o2'), ('manager', 'o3')])],
  'en': {'tab': 'Customer reviews',
         'desc': 'A 2★ Google review comes in. Code finds the customer and their order. One agent confirms with the carrier that the delivery really was late and drafts a reply in your voice. Low ratings always go to a manager before anything is posted.',
         'aria': 'Animated diagram. A new Google review triggers a code step that finds the customer in the CRM and the orders database. An AI agent reads past replies, checks the carrier API and drafts a reply. A policy check sends low ratings to a manager for approval. Then the reply is posted on Google, a helpdesk ticket is opened and the dashboard is updated.',
         'n': {'trigger': ['Google review', '2★ · “Delivery was late”'],
               'crm': ['CRM', 'Customer since 2023'], 'match': ['Find the order', 'Reviewer → customer'],
               'orders': ['Orders DB', 'Order #4812'],
               'voice': ['Past replies', 'Tone & refund policy'], 'agent': ['Reply agent', 'Drafts in your voice'],
               'carrier': ['Carrier API', 'Confirms: 3 days late'],
               'policy': ['Policy check', '3★ or less → a person'],
               'manager': ['Manager', 'Approves in Slack'],
               'o1': ['Google', 'Reply posted'], 'o2': ['Helpdesk', 'Ticket for delivery team'],
               'o3': ['Dashboard', 'Rating per branch']}},
  'he': {'tab': 'ביקורות לקוחות',
         'desc': 'ביקורת של 2★ מגיעה בגוגל. קוד מאתר את הלקוח ואת ההזמנה שלו. סוכן אחד מוודא מול חברת השליחויות שהמשלוח באמת איחר ומנסח תשובה בשפה שלכם. דירוג נמוך תמיד עובר לאישור מנהל לפני הפרסום.',
         'aria': 'תרשים מונפש. ביקורת חדשה בגוגל מפעילה שלב קוד שמאתר את הלקוח ב‑CRM ובמסד ההזמנות. סוכן AI קורא תשובות קודמות, בודק מול חברת השליחויות ומנסח תשובה. בדיקת מדיניות מעבירה דירוגים נמוכים לאישור מנהל. לאחר מכן התשובה מתפרסמת בגוגל, נפתחת קריאה במוקד והדשבורד מתעדכן.',
         'n': {'trigger': ['ביקורת חדשה בגוגל', '2★ · ״המשלוח איחר״'],
               'crm': ['CRM', 'לקוח מאז 2023'], 'match': ['איתור ההזמנה', 'מתאים מבקר ללקוח'],
               'orders': ['מסד הזמנות', 'הזמנה 4812'],
               'voice': ['תשובות קודמות', 'טון ומדיניות פיצוי'], 'agent': ['סוכן תשובות', 'מנסח בשפה שלכם'],
               'carrier': ['חברת השליחויות', 'מאשרת: איחור של 3 ימים'],
               'policy': ['בדיקת מדיניות', 'עד 3★ עובר לאישור אדם'],
               'manager': ['מנהל הסניף', 'מאשר בסלאק'],
               'o1': ['גוגל', 'התשובה פורסמה'], 'o2': ['מוקד שירות', 'קריאה לצוות המשלוחים'],
               'o3': ['דשבורד', 'דירוג לפי סניף']}}},

 # 3. Gate failure — code reads the device and tries the safe fix first; the agent diagnoses; a person dispatches
 {'nodes': {'trigger': (1, 0, 'trigger'),
            'telemetry': (0, 1, 'server'), 'diag': (1, 1, 'code'), 'custdb': (2, 1, 'db'),
            'restart': (1, 2, 'code'), 'device': (2, 2, 'api'),
            'manuals': (0, 3, 'docs'), 'agent': (1, 3, 'agent'), 'repairs': (2, 3, 'db'),
            'human': (1, 4, 'human'),
            'o1': (0, 5, 'out'), 'o2': (1, 5, 'out'), 'o3': (2, 5, 'out')},
  'phases': [('main', [('trigger', 'diag')]),
             ('res', [('diag', 'telemetry'), ('diag', 'custdb')]),
             ('main', [('diag', 'restart')]),
             ('res', [('restart', 'device')]),
             ('main', [('restart', 'agent')]),
             ('res', [('agent', 'manuals'), ('agent', 'repairs')]),
             ('main', [('agent', 'human')]),
             ('main', [('human', 'o1'), ('human', 'o2'), ('human', 'o3')])],
  'en': {'tab': 'Gate failure',
         'desc': 'A security gate at a customer site reports a fault and is stuck open. Code pulls the gate’s logs and the customer’s contract, then tries a safe remote restart. When that fails, the agent works out the likely cause and the parts needed from the service manuals and past repairs. The service manager confirms, and a technician is sent with the right parts.',
         'aria': 'Animated diagram. A fault alert from a security gate triggers a code step that reads diagnostics from the gate telemetry server and the customer database. A second code step tries a remote restart through the gate controller API. An AI agent diagnoses the fault using service manuals and the past repairs database. The service manager confirms the dispatch. Then the technician gets the job and parts list, the customer gets an SMS and a service ticket is opened.',
         'n': {'trigger': ['Gate fault alert', 'Gate 214 · stuck open'],
               'telemetry': ['Gate telemetry', 'Logs · fault code E-31'], 'diag': ['Read diagnostics', 'Fault codes · last 24h'],
               'custdb': ['Customer DB', 'Site · model · warranty'],
               'restart': ['Remote restart', 'Tried twice · still down'], 'device': ['Gate controller', 'Restart command sent'],
               'manuals': ['Service manuals', 'Fault E-31 · model S4'], 'agent': ['Diagnosis agent', 'Likely cause + parts'],
               'repairs': ['Past repairs', 'Same fault on 14 gates'],
               'human': ['Service manager', 'Confirms dispatch'],
               'o1': ['Technician', 'Job + parts on phone'], 'o2': ['Customer', 'SMS: arriving 14:00'],
               'o3': ['Service ticket', 'Opened in CRM']}},
  'he': {'tab': 'ניהול תקלה',
         'desc': 'שער ביטחון באתר של לקוח מדווח על תקלה ונשאר תקוע פתוח. קוד מושך את הלוגים של השער ואת חוזה הלקוח, ומנסה אתחול בטוח מרחוק. כשזה לא עוזר, הסוכן מאתר את הסיבה הסבירה ואת החלפים הדרושים לפי מדריכי השירות ותיקונים קודמים. מנהל השירות מאשר, וטכנאי יוצא עם החלפים הנכונים.',
         'aria': 'תרשים מונפש. התראת תקלה משער ביטחון מפעילה שלב קוד שקורא נתוני אבחון משרת הטלמטריה של השער וממסד הלקוחות. שלב קוד שני מנסה אתחול מרחוק דרך ממשק בקר השער. סוכן AI מאבחן את התקלה בעזרת מדריכי שירות ומסד התיקונים הקודמים. מנהל השירות מאשר את שליחת הטכנאי. לאחר מכן הטכנאי מקבל את הקריאה ורשימת החלפים, הלקוח מקבל SMS ונפתחת קריאת שירות.',
         'n': {'trigger': ['התראת תקלה משער', 'שער 214 · תקוע פתוח'],
               'telemetry': ['טלמטריה מהשער', 'לוגים · קוד תקלה E-31'], 'diag': ['קריאת אבחון', 'קודי תקלה · 24 שעות'],
               'custdb': ['מסד לקוחות', 'אתר · דגם · אחריות'],
               'restart': ['אתחול מרחוק', 'שני ניסיונות · עדיין תקוע'], 'device': ['בקר השער', 'נשלחה פקודת אתחול'],
               'manuals': ['מדריכי שירות', 'תקלה E-31 · דגם S4'], 'agent': ['סוכן אבחון', 'סיבה סבירה וחלפים'],
               'repairs': ['תיקונים קודמים', 'אותה תקלה ב‑14 שערים'],
               'human': ['מנהל שירות', 'מאשר שליחת טכנאי'],
               'o1': ['טכנאי', 'קריאה וחלפים בנייד'], 'o2': ['לקוח', 'הודעה: טכנאי מגיע ב‑14:00'],
               'o3': ['קריאת שירות', 'נפתחה ב‑CRM']}}},
]
EXAMPLE = {'en': 'Example', 'he': 'דוגמה'}

# ---------------------------------------------------------------- geometry
def route(nodes, a, b):
    ca, ra, _ = nodes[a]; cb, rb, _ = nodes[b]
    xa, ya, xb, yb = COLX[ca], ROWY[ra], COLX[cb], ROWY[rb]
    if ra == rb:  # side to side
        y = ya + H / 2
        return [(xa + W, y), (xb, y)] if ca < cb else [(xa, y), (xb + W, y)]
    assert rb > ra, f'{a}->{b}: edges must go down or sideways'
    assert ca == cb or rb == ra + 1, f'{a}->{b}: diagonal edges must join adjacent rows'
    x1, x2 = xa + W / 2, xb + W / 2
    if ca == cb:
        return [(x1, ya + H), (x2, yb)]
    m = yb - 16
    return [(x1, ya + H), (x1, m), (x2, m), (x2, yb)]

def build(sc):
    """Lay out one scenario on the timeline. Returns (duration, packets, node windows, lines)."""
    nodes = sc['nodes']
    t = START
    on = {'trigger': 0.15}; off = {}
    packets = []  # (points, t_start, t_end, kind)
    lines = []    # (points, kind)
    for kind, edges in sc['phases']:
        for a, b in edges:
            pts = route(nodes, a, b)
            lines.append((pts, kind))
            if kind == 'main':
                packets.append((pts, t, t + TRAVEL, 'main'))
                off[a] = max(off.get(a, 0), t + 0.25)
                on.setdefault(b, t + TRAVEL)
            else:
                packets.append((pts, t, t + R_OUT, 'res'))
                packets.append((pts[::-1], t + R_OUT + R_WAIT, t + R_OUT + R_WAIT + R_BACK, 'res'))
                on[b] = t + R_OUT
                off[b] = t + R_OUT + R_WAIT + 0.2
        t += TRAVEL + DWELL if kind == 'main' else R_OUT + R_WAIT + R_BACK + R_DWELL
    dur = round(t - DWELL + END_HOLD, 2)
    for k in nodes:
        assert k in on, f'node {k} is never reached'
        off.setdefault(k, dur - 0.45)  # end points stay lit until the loop restarts
    return dur, packets, {k: (on[k], off[k]) for k in nodes}, lines

BUILT = [build(sc) for sc in SCENARIOS]

# ---------------------------------------------------------------- CSS
def P(p): return f'transform:translate({p[0]:g}px,{p[1]:g}px)'
css = []
for i, (sc, (dur, packets, win, _)) in enumerate(zip(SCENARIOS, BUILT)):
    pc = lambda s: 100 * s / dur
    for k, (s, e) in win.items():
        col = KIND_COLOR[sc['nodes'][k][2]]
        css.append(f'@keyframes wf{i}-{k}{{0%,{max(pc(s)-0.5,0):.2f}%{{fill:#fff}}{pc(s)+1:.2f}%,{pc(e):.2f}%{{fill:{col}}}{pc(e)+2:.2f}%,100%{{fill:#fff}}}}\n'
                   f'.wf{i}-{k} .wf-box{{animation:wf{i}-{k} {dur:g}s ease-in-out infinite}}')
    for j, (pts, s, e, kind) in enumerate(packets):
        segs = [abs(pts[n+1][0]-pts[n][0]) + abs(pts[n+1][1]-pts[n][1]) for n in range(len(pts)-1)]
        L = sum(segs); t = pc(s)
        fr = [f'{max(pc(s)-0.5,0):.2f}%{{opacity:0;{P(pts[0])}}}', f'{pc(s):.2f}%{{opacity:1;{P(pts[0])}}}']
        for n, sl in enumerate(segs):
            t += (pc(e) - pc(s)) * sl / L
            fr.append(f'{t:.2f}%{{opacity:1;{P(pts[n+1])}}}')
        fr.append(f'{pc(e)+0.8:.2f}%,100%{{opacity:0;{P(pts[-1])}}}')
        css.append(f'@keyframes wf{i}-p{j}{{0%{{opacity:0;{P(pts[0])}}}{"".join(fr)}}}\n.wf{i}-p{j}{{animation:wf{i}-p{j} {dur:g}s linear infinite}}')

CSS = '''/* ----------------------------------------------------------------------------
   Hero workflow animation — GENERATED by scripts/gen-workflow.py — edit there, not here
---------------------------------------------------------------------------- */
.wf-box { fill: #fff; stroke: var(--color-ink-900); stroke-width: 1.5; }
.wf-agent .wf-box { stroke-width: 2.5; }
.wf-title { font: 700 12.5px var(--font-display); fill: var(--color-ink-900); }
.wf-sub { font: 400 10px var(--font-sans); fill: var(--color-ink-500); }
.wf-kind rect { stroke: var(--color-ink-900); stroke-width: 1.2; }
.wf-kind text { font: 700 7.5px var(--font-mono); letter-spacing: 0.04em; fill: var(--color-ink-900); }
.wf-agent .wf-kind rect { fill: var(--color-ink-900); }
.wf-agent .wf-kind text { fill: var(--color-brand-300); }
.wf-line { fill: none; stroke: var(--color-ink-200); stroke-width: 2; stroke-linejoin: round; }
.wf-line-res { fill: none; stroke: var(--color-ink-300); stroke-width: 1.5; stroke-dasharray: 4 4; }
.wf-packet { fill: var(--color-brand-400); stroke: var(--color-ink-900); stroke-width: 1.5; opacity: 0; }
.wf-packet-res { fill: #a78bfa; }
.wf-reset * { animation: none !important; }
''' + '\n'.join(css) + '''
@media (prefers-reduced-motion: reduce) {
  .wf-box, .wf-packet { animation: none !important; }
  .wf-packet { opacity: 0; }
}
'''

# ---------------------------------------------------------------- HTML
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('"', '&quot;')

def svg(i, lang):
    sc = SCENARIOS[i]; l = sc[lang]; _, packets, _, lines = BUILT[i]
    o = [f'<svg class="block w-full h-auto" viewBox="0 0 {VW} {VH}" role="img" aria-label="{esc(l["aria"])}">']
    for pts, kind in lines:
        d = 'M' + ' L'.join(f'{x:g} {y:g}' for x, y in pts)
        o.append(f'<path class="{"wf-line-res" if kind == "res" else "wf-line"}" d="{d}"/>')
    for k, (col, row, kind) in sc['nodes'].items():
        x, y = COLX[col], ROWY[row]; t, s = l['n'][k]
        g = [f'<g class="wf-node wf-{kind} wf{i}-{k}"><rect class="wf-box" x="{x}" y="{y}" width="{W}" height="{H}" rx="9"/>']
        label = KIND_LABEL[lang].get(kind)
        if label:
            pw = round(len(label) * (5.4 if lang == 'he' else 5.1) + 10)
            px = x + W - 9 - pw if lang == 'he' else x + 9
            g.append(f'<g class="wf-kind"><rect x="{px}" y="{y-7}" width="{pw}" height="13" rx="4" fill="{KIND_COLOR[kind]}"/>'
                     f'<text x="{px+pw/2:g}" y="{y+2.5:g}" text-anchor="middle">{label}</text></g>')
        g.append(f'<text class="wf-title" x="{x+W/2:g}" y="{y+18}" text-anchor="middle">{esc(t)}</text>'
                 f'<text class="wf-sub" x="{x+W/2:g}" y="{y+30}" text-anchor="middle">{esc(s)}</text></g>')
        o.append(''.join(g))
    for j, (pts, s, e, kind) in enumerate(packets):
        o.append(f'<circle class="wf-packet{" wf-packet-res" if kind == "res" else ""} wf{i}-p{j}" r="{4.5 if kind == "res" else 6}" cx="0" cy="0"/>')
    o.append('</svg>')
    return '\n              '.join(o)

def figure(lang):
    tabs = '\n              '.join(
        f'<button type="button" class="wf-tab" data-wf-tab="{i}" aria-pressed="{"true" if i == 0 else "false"}">{sc[lang]["tab"]}</button>'
        for i, sc in enumerate(SCENARIOS))
    panels = '\n            '.join(
        f'<div data-wf-panel{"" if i == 0 else " hidden"}>\n              {svg(i, lang)}\n            </div>'
        for i in range(len(SCENARIOS)))
    data = json.dumps([{'desc': sc[lang]['desc'], 'ms': round(BUILT[i][0] * 1000)} for i, sc in enumerate(SCENARIOS)],
                      ensure_ascii=False).replace('</', '<\\/')
    return f'''<figure class="reveal card !p-0 overflow-hidden" data-wf>
          <figcaption class="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-ink-100 bg-ink-50 px-4 py-3 sm:px-5">
            <span class="text-sm font-semibold text-ink-900">{EXAMPLE[lang]}:</span>
            <div class="flex flex-wrap gap-1.5">
              {tabs}
            </div>
          </figcaption>
          <div class="px-3 pt-4 sm:px-5">
            {panels}
          </div>
          <p data-wf-desc class="px-5 pt-3 pb-5 text-sm leading-relaxed text-ink-600">{SCENARIOS[0][lang]["desc"]}</p>
          <script type="application/json" data-wf-data>{data}</script>
        </figure>'''

for f, lang in [('index.html', 'en'), ('he.html', 'he')]:
    s = open(f).read()
    s, n = re.subn(r'<figure class="reveal card !p-0 overflow-hidden"[^>]*>.*?</figure>', lambda m: figure(lang), s, flags=re.S)
    open(f, 'w').write(s); print(f, n)

p = 'src/input.css'; s = open(p).read()
a = s.index('/* ----------------------------------------------------------------------------\n   Hero workflow animation')
z = s.index('/* ----------------------------------------------------------------------------\n   Hebrew / RTL')
s = s[:a] + CSS + '\n' + s[z:]
if '.wf-tab' not in s:
    s = s.replace('  .chip {', '''  .wf-tab {
    @apply rounded-md border-2 border-transparent px-2.5 py-1 text-xs font-semibold text-ink-600 transition hover:text-ink-900 hover:border-ink-200;
  }
  .wf-tab[aria-pressed="true"] { @apply border-ink-900 bg-brand-300 text-ink-900; }

  .chip {''')
open(p, 'w').write(s)
print('loop seconds:', [b[0] for b in BUILT])
