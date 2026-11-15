/* לומדות רצפת אגן – מנוע האתר. התוכן נמצא בתיקיית content/ */
(function () {
  'use strict';
  const app = document.getElementById('app');
  const crumbs = document.getElementById('crumbs');
  const sheet = document.getElementById('sheet');
  const sheetContent = document.getElementById('sheet-content');
  const LESSONS = window.LESSONS || {};
  const COURSE = window.COURSE;
  const DIAGRAMS = window.DIAGRAMS || {};

  /* ---------- אחסון התקדמות ---------- */
  const KEY = 'agan-progress-v1';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  let state = load();
  function ls(id) { state[id] = state[id] || { done: {}, best: null, known: {} }; return state[id]; }

  /* ---------- עזרים ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function srcIndex(lesson) {
    if (lesson._idx) return lesson._idx;
    const idx = {}; let n = 1;
    Object.keys(lesson.sources).forEach(k => { idx[k] = n++; });
    lesson._idx = idx; return idx;
  }
  // מוסיף RLM לפני סימן פיסוק שסוגר משפט אחרי מונח לועזי, כדי שהפיסוק יישאר בצד הנכון.
  // לא נוגע בתוך {{...}} או בתוך תגיות HTML, ולא מוסיף RLM כשהמילה הבאה לועזית.
  function addRLM(str) {
    const keep = [];
    const hold = m => { keep.push(m); return '' + (keep.length - 1) + ''; };
    let t = String(str).replace(/\{\{[^}]+\}\}/g, hold).replace(/<[^>]*>/g, hold);
    t = t.replace(/([A-Za-z0-9)\]’"])((?:\d+)*)([.:,;?!])(?=(\s*)(.?))/g, (m, a, ph, punct, sp, next, off, all) => {
      if (!sp && next && next !== '') return m;          // אין רווח אחרי: לא סוף משפט
      if (/[A-Za-z0-9]/.test(next)) return m;                  // המילה הבאה לועזית או מספר
      return a + ph + '‏' + punct;
    });
    return t.replace(/(\d+)/g, (m, n) => keep[+n]);
  }
  // {{ID|מיקום}} -> כפתור הפניה
  function rich(html, lesson) {
    const idx = srcIndex(lesson);
    return addRLM(html).replace(/\{\{(\w+)\|([^}]+)\}\}/g, (m, id, loc) => {
      if (!lesson.sources[id]) { console.error('מקור חסר', id); return '<span class="cite-missing" title="מקור חסר">[מקור חסר]</span>'; }
      return `<button class="cite" data-src="${id}" data-loc="${esc(loc)}" aria-label="מקור ${idx[id]}: ${esc(loc)}">${idx[id]}</button>`;
    });
  }
  window.__addRLM = addRLM;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function setCrumbs(parts) {
    crumbs.innerHTML = parts.map(p => p.href ? `<a href="${p.href}">${esc(p.t)}</a>` : `<span>${esc(p.t)}</span>`).join(' › ');
  }
  function pct(lesson) {
    const s = ls(lesson.id); const n = lesson.units.length;
    const d = lesson.units.filter(u => s.done[u.id]).length;
    return { d, n, p: n ? Math.round(d / n * 100) : 0 };
  }

  /* ---------- חלון מקור ---------- */
  function openSource(lesson, id, loc) {
    const s = lesson.sources[id]; const idx = srcIndex(lesson);
    sheetContent.innerHTML = `
      <div class="src-type">${esc(s.type)} · מקור ${idx[id]}</div>
      <h3 id="sheet-title">${s.title}</h3>
      <p class="muted">${s.cite}</p>
      ${loc ? `<p>המיקום במקור: <span class="loc">${esc(loc)}</span></p>` : ''}
      ${s.url ? `<p><a class="btn small" href="${s.url}" target="_blank" rel="noopener">פתיחת המקור ↗</a></p>` : ''}
      ${s.note ? `<p class="note">${s.note}</p>` : ''}`;
    lastTrigger = document.activeElement;
    sheet.hidden = false;
    sheet.querySelector('.sheet-x').focus();
  }
  let lastTrigger = null;
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    lastTrigger = null;
  }
  sheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
  app.addEventListener('click', e => {
    const b = e.target.closest('.cite'); if (!b) return;
    e.stopPropagation();
    const lesson = LESSONS[app.dataset.lesson]; if (lesson) openSource(lesson, b.dataset.src, b.dataset.loc);
  });

  /* ---------- בלוקי תוכן ---------- */
  function block(b, L) {
    const R = h => rich(h, L);
    switch (b.t) {
      case 'h': return `<h3>${R(b.h)}</h3>`;
      case 'p': return `<div class="block"><p>${R(b.h)}</p></div>`;
      case 'ul': return `<div class="block"><ul>${b.items.map(i => `<li>${R(i)}</li>`).join('')}</ul></div>`;
      case 'key': return `<div class="block key">${R(b.h)}</div>`;
      case 'note': return `<div class="block note">${R(b.h)}</div>`;
      case 'deep': return `<details class="block deep"><summary>${R(b.title)}</summary>${b.items ? `<ul>${b.items.map(i => `<li>${R(i)}</li>`).join('')}</ul>` : `<p>${R(b.h)}</p>`}</details>`;
      case 'table': return `<div class="block tbl"><table><thead><tr>${b.head.map(h => `<th>${R(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${R(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>${b.cap ? `<p class="muted" style="font-size:14px">${R(b.cap)}</p>` : ''}</div>`;
      case 'fig': {
        const svg = DIAGRAMS[b.d] ? DIAGRAMS[b.d]() : `<p class="muted">תרשים חסר: ${esc(b.d)}</p>`;
        return `<figure class="schema"><div class="badge schema-b">סכמה להמחשה בלבד – לא איור אנטומי. ציירתי אותה לפי המקורות שבהפניות, ואף מומחה לא בדק אותה.</div>${svg}<figcaption>${R(b.cap)}</figcaption></figure>`;
      }
      case 'img': return `<figure class="real"><div class="badge real-b">איור אנטומי מספר לימוד שפורסם · נחלת הכלל</div><a href="${b.page}" target="_blank" rel="noopener"><img src="${b.src}" alt="${esc(b.alt)}" loading="lazy"></a><figcaption>${R(b.cap)}</figcaption></figure>`;
      case 'video': return `<figure><div class="video"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${b.yt}${b.start ? `?start=${b.start}` : ''}" title="${esc(b.title)}" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div><figcaption>${R(b.cap)}</figcaption></figure>`;
      default: return '';
    }
  }

  /* ---------- שאלות ---------- */
  function questionHTML(q, L, qid, shuffleOpts) {
    const order = q.o.map((_, i) => i); const ord = shuffleOpts ? shuffle(order) : order;
    return `<div class="q" data-q="${qid}" data-a="${q.a}">
      <div class="stem">${rich(q.q, L)}</div>
      ${ord.map(i => `<button class="opt" data-i="${i}">${rich(q.o[i], L)}</button>`).join('')}
      <div class="explain" hidden>${rich(q.ex, L)}</div></div>`;
  }
  function answer(qEl, btn) {
    if (qEl.dataset.answered) return null;
    qEl.dataset.answered = '1';
    const a = +qEl.dataset.a; const i = +btn.dataset.i;
    qEl.querySelectorAll('.opt').forEach(o => { o.disabled = true; if (+o.dataset.i === a) o.classList.add('right'); });
    if (i !== a) btn.classList.add('wrong');
    const ex = qEl.querySelector('.explain'); ex.hidden = false;
    ex.insertAdjacentHTML('afterbegin', `<b>${i === a ? 'נכון! ' : 'לא בדיוק. '}</b>`);
    return i === a;
  }

  /* ---------- מסכים ---------- */
  function home() {
    app.dataset.lesson = '';
    setCrumbs([]);
    const lessons = COURSE.lessons.map(l => {
      const L = LESSONS[l.id];
      const pr = L ? pct(L) : null;
      return `<a class="card lesson-card ${L ? '' : 'soon'}" href="${L ? `#/l/${l.id}` : '#/'}">
        <span class="tag">שיעור ${Number(l.id)}</span>${l.date ? `<span class="tag">${esc(l.date)}</span>` : ''}
        <h3 style="margin:8px 0 2px">${esc(l.title)}</h3>
        <div class="muted">${L ? esc(L.subtitle) : 'יתווסף בהמשך הקורס'}</div>
        ${pr ? `<div class="bar"><i style="width:${pr.p}%"></i></div><div class="muted" style="font-size:14px">${pr.d} מתוך ${pr.n} יחידות הושלמו</div>` : ''}
      </a>`;
    }).join('');
    app.innerHTML = `
      <h1>${esc(COURSE.title)}</h1>
      <p class="sub">${esc(COURSE.subtitle)}</p>
      <div class="grid">${lessons}</div>
      <div class="card note">${COURSE.about}</div>`;
  }

  function lessonPage(L) {
    app.dataset.lesson = L.id;
    setCrumbs([{ t: 'ראשי', href: '#/' }, { t: `שיעור ${Number(L.id)}` }]);
    const s = ls(L.id); const pr = pct(L);
    const next = L.units.find(u => !s.done[u.id]) || L.units[0];
    app.innerHTML = `
      <span class="tag">שיעור ${Number(L.id)}</span>
      <h1>${esc(L.title)}</h1>
      <p class="sub">${esc(L.subtitle)}</p>
      <div class="bar"><i style="width:${pr.p}%"></i></div>
      <div class="muted" style="font-size:14px">${pr.d} מתוך ${pr.n} יחידות · ${s.best != null ? `ציון שיא במבחן: ${s.best}%` : 'עוד לא נבחנת'}</div>
      <div class="btnrow">
        <a class="btn" href="#/l/${L.id}/u/${next.id}">${pr.d ? 'להמשיך ללמוד' : 'להתחיל ללמוד'} ←</a>
        <a class="btn ghost" href="#/l/${L.id}/cards">כרטיסיות</a>
        <a class="btn ghost" href="#/l/${L.id}/quiz">מבחן מסכם</a>
      </div>
      <div class="card"><ul class="units">${L.units.map((u, i) => `
        <li><a class="unit-link ${s.done[u.id] ? 'done' : ''}" href="#/l/${L.id}/u/${u.id}">
          <span class="num">${s.done[u.id] ? '✓' : i + 1}</span>
          <span><b>${esc(u.title)}</b><br><span class="meta">כ-${u.min} דקות · ${u.quiz.length} שאלות תרגול</span></span>
        </a></li>`).join('')}</ul></div>
      <div class="btnrow"><a class="btn ghost small" href="#/l/${L.id}/sources">כל המקורות של השיעור</a></div>
      <div class="card note">${rich(L.intro, L)}</div>`;
  }

  function unitPage(L, uid) {
    app.dataset.lesson = L.id;
    const i = L.units.findIndex(u => u.id === uid); if (i < 0) return lessonPage(L);
    const u = L.units[i]; const prev = L.units[i - 1]; const next = L.units[i + 1];
    setCrumbs([{ t: 'ראשי', href: '#/' }, { t: `שיעור ${Number(L.id)}`, href: `#/l/${L.id}` }, { t: `יחידה ${i + 1}` }]);
    const s = ls(L.id);
    app.innerHTML = `
      <span class="tag">יחידה ${i + 1} מתוך ${L.units.length}</span><span class="tag">כ-${u.min} דקות</span>
      <h1>${esc(u.title)}</h1>
      <p class="hint-tap">המספרים הקטנים הם הפניות למקורות. אפשר ללחוץ עליהם כדי לראות את המקור, את המיקום בו ואת הקישור.</p>
      ${u.blocks.map(b => block(b, L)).join('')}
      <h2>תרגול קצר</h2>
      <div id="uq">${u.quiz.map((q, k) => questionHTML(q, L, k, true)).join('')}</div>
      <div class="btnrow"><button class="btn" id="done">${s.done[u.id] ? 'סומנה כהושלמה ✓' : 'סיימתי את היחידה ✓'}</button></div>
      <div class="navrow">
        ${prev ? `<a class="btn ghost small" href="#/l/${L.id}/u/${prev.id}">→ ${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a class="btn small" href="#/l/${L.id}/u/${next.id}">${esc(next.title)} ←</a>` : `<a class="btn small" href="#/l/${L.id}/quiz">למבחן המסכם ←</a>`}
      </div>`;
    app.querySelector('#uq').addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b) return; answer(b.closest('.q'), b);
    });
    app.querySelector('#done').addEventListener('click', e => {
      s.done[u.id] = true; save(state); e.target.textContent = 'סומנה כהושלמה ✓';
      if (next) location.hash = `#/l/${L.id}/u/${next.id}`;
    });
    window.scrollTo(0, 0);
  }

  const ROUND = 15;
  function quizPage(L) {
    app.dataset.lesson = L.id;
    setCrumbs([{ t: 'ראשי', href: '#/' }, { t: `שיעור ${Number(L.id)}`, href: `#/l/${L.id}` }, { t: 'מבחן מסכם' }]);
    const pool = L.units.flatMap(u => u.quiz.map(q => Object.assign({ unit: u.title }, q)));
    const all = shuffle(pool).slice(0, ROUND);
    let k = 0, right = 0; const wrong = [];
    function show() {
      if (k >= all.length) return finish();
      const q = all[k];
      app.innerHTML = `
        <span class="tag">סבב של ${all.length} שאלות מתוך ${pool.length}</span><span class="tag">שאלה ${k + 1}</span><span class="tag">${esc(q.unit)}</span>
        <div class="bar"><i style="width:${Math.round(k / all.length * 100)}%"></i></div>
        ${questionHTML(q, L, k, true)}
        <div class="btnrow"><button class="btn" id="nx" hidden>${k + 1 < all.length ? 'לשאלה הבאה ←' : 'לסיכום הסבב ←'}</button></div>`;
      const qEl = app.querySelector('.q');
      qEl.addEventListener('click', e => {
        const b = e.target.closest('.opt'); if (!b) return;
        const r = answer(qEl, b); if (r === null) return;
        if (r) right++; else wrong.push(q);
        app.querySelector('#nx').hidden = false;
      });
      app.querySelector('#nx').addEventListener('click', () => { k++; show(); window.scrollTo(0, 0); });
    }
    function finish() {
      const sc = Math.round(right / all.length * 100);
      const s = ls(L.id); if (s.best == null || sc > s.best) { s.best = sc; save(state); }
      app.innerHTML = `
        <h1 class="center">סיימת את הסבב</h1>
        <div class="score">${sc}%</div>
        <p class="center muted">${right} תשובות נכונות מתוך ${all.length}. בכל סבב נבחרות ${ROUND} שאלות אקראיות מתוך ${pool.length}.</p>
        ${wrong.length ? `<h2>כדאי לחזור על:</h2>${wrong.map(q => `<div class="card"><div class="muted" style="font-size:14px">${esc(q.unit)}</div><b>${rich(q.q, L)}</b><p>התשובה: ${rich(q.o[q.a], L)}</p><div class="explain">${rich(q.ex, L)}</div></div>`).join('')}` : '<p class="center">כל התשובות נכונות 🎉</p>'}
        <div class="btnrow"><button class="btn" id="again">סבב נוסף</button><a class="btn ghost" href="#/l/${L.id}">חזרה לשיעור</a></div>`;
      app.querySelector('#again').onclick = () => { quizPage(L); window.scrollTo(0, 0); };
    }
    show();
  }

  function cardsPage(L) {
    app.dataset.lesson = L.id;
    setCrumbs([{ t: 'ראשי', href: '#/' }, { t: `שיעור ${Number(L.id)}`, href: `#/l/${L.id}` }, { t: 'כרטיסיות' }]);
    const s = ls(L.id);
    // מעבר ממפתח לפי מיקום במערך למזהה קבוע של כרטיסייה
    if (!s.knownV2) {
      const old = s.known || {}; s.known = {};
      Object.keys(old).forEach(k => { const c = L.cards[+k]; if (c && c.id) s.known[c.id] = true; });
      s.knownV2 = true; save(state);
    }
    const cid = (c, i) => c.id || ('i' + i);
    let deck = shuffle(L.cards.map((c, i) => Object.assign({ key: cid(c, i) }, c)).filter(c => !s.known[c.key]));
    const total = L.cards.length;
    function show() {
      const knownN = L.cards.filter((c, i) => s.known[cid(c, i)]).length;
      if (!deck.length) {
        app.innerHTML = `<h1 class="center">כל הכרטיסיות סומנו כידועות 🎉</h1>
          <p class="center muted">${knownN} מתוך ${total}</p>
          <div class="btnrow" style="justify-content:center"><button class="btn" id="reset">להתחיל מחדש</button><a class="btn ghost" href="#/l/${L.id}">חזרה לשיעור</a></div>`;
        app.querySelector('#reset').onclick = () => { s.known = {}; save(state); cardsPage(L); };
        return;
      }
      const c = deck[0];
      app.innerHTML = `
        <span class="tag">ידועות: ${knownN} מתוך ${total}</span><span class="tag">נשארו בסבב: ${deck.length}</span>
        <div class="fc" id="fc"><div class="fc-inner">
          <div class="card-face front">${rich(c.f, L)}<small>לחצי כדי להפוך</small></div>
          <div class="card-face back">${rich(c.b, L)}</div>
        </div></div>
        <div class="btnrow" style="justify-content:center">
          <button class="btn ghost" id="again">עוד לא ↺</button>
          <button class="btn" id="know">ידעתי ✓</button>
        </div>
        <p class="center"><button class="btn ghost small" id="reset">איפוס כרטיסיות</button></p>`;
      const fc = app.querySelector('#fc');
      fc.addEventListener('click', e => { if (!e.target.closest('.cite')) fc.classList.toggle('flipped'); });
      app.querySelector('#know').onclick = () => { s.known[c.key] = true; save(state); deck.shift(); show(); };
      app.querySelector('#again').onclick = () => { deck.push(deck.shift()); show(); };
      app.querySelector('#reset').onclick = () => { s.known = {}; save(state); cardsPage(L); };
    }
    show();
  }

  function sourcesPage(L) {
    app.dataset.lesson = L.id;
    setCrumbs([{ t: 'ראשי', href: '#/' }, { t: `שיעור ${Number(L.id)}`, href: `#/l/${L.id}` }, { t: 'מקורות' }]);
    const idx = srcIndex(L);
    app.innerHTML = `<h1>מקורות השיעור</h1>
      <p class="sub">${rich(L.sourcesIntro, L)}</p>
      <div class="card">${Object.keys(L.sources).map(id => { const s = L.sources[id]; return `
        <div class="src-item"><div class="src-type">[${idx[id]}] ${esc(s.type)}</div>
        <b>${s.title}</b><div class="muted" style="font-size:15px">${s.cite}</div>
        ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">פתיחת המקור ↗</a>` : ''}
        ${s.note ? `<div class="note" style="margin-top:6px">${s.note}</div>` : ''}</div>`; }).join('')}</div>`;
  }

  /* ---------- ניתוב ---------- */
  function route() {
    closeSheet();
    const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (p[0] === 'l' && LESSONS[p[1]]) {
      const L = LESSONS[p[1]];
      if (p[2] === 'u') unitPage(L, p[3]);
      else if (p[2] === 'quiz') quizPage(L);
      else if (p[2] === 'cards') cardsPage(L);
      else if (p[2] === 'sources') sourcesPage(L);
      else lessonPage(L);
    } else home();
    if (p[2] !== 'u') window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
