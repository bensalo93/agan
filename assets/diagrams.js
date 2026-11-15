/* תרשימים סכמטיים (SVG). אינם בקנה מידה; נועדו להחליף את האינפוגרפיקות שאבדו בהמרה. */
window.DIAGRAMS = (function () {
  const C = {
    ink: 'var(--ink)', muted: 'var(--muted)', line: 'var(--line)', card: 'var(--card)', soft: 'var(--soft)',
    brand: 'var(--brand)', accent: 'var(--accent)',
    muscle: '#c96b5a', muscle2: '#e09a7f', fascia: '#d9b77a', membrane: '#7fa3b8', organ: '#b8a6cf', bone: '#e9e1cf'
  };
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 13}" font-weight="${o.fw || 500}" fill="${o.c || C.ink}" ${o.ltr ? 'direction="ltr"' : 'direction="rtl"'}>${s}</text>`;
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

  return {
    /* 9 אזורי הבטן – מבט מלפנים על המטופלת */
    regions() {
      const cells = [
        ['היפוכונדריום ימני', 'Rt. hypochondriac', ['אונה ימנית של הכבד, כיס המרה', 'קוטב עליון של כליה ימנית', 'לעיתים מעי דק']],
        ['אפיגסטריום', 'Epigastric', ['קיבה, דאודנום, לבלב', 'חלק מהאונה הימנית', 'והאונה השמאלית של הכבד']],
        ['היפוכונדריום שמאלי', 'Lt. hypochondriac', ['טחול', 'פונדוס הקיבה', 'קצה הכבד']],
        ['מותני ימני', 'Rt. lumbar', ['מעי גס עולה', 'מעי דק', 'חלק מכליה ימנית']],
        ['טבורי', 'Umbilical', ['קיבה, דאודנום, מעי דק', 'מעי גס רוחבי', 'חלק מהכליות']],
        ['מותני שמאלי', 'Lt. lumbar', ['מעי גס יורד', 'מעי דק', 'חלק מכליה שמאלית']],
        ['איליאק (אינגווינלי) ימני', 'Rt. iliac / inguinal', ['צקום, אפנדיקס', 'חלק מהמעי הגס העולה', 'מעי דק']],
        ['היפוגסטריום', 'Hypogastric', ['שלפוחית, רחם', 'סיגמואיד, רקטום', 'מעי דק']],
        ['איליאק (אינגווינלי) שמאלי', 'Lt. iliac / inguinal', ['מעי גס יורד', 'סיגמואיד', 'חלק מהמעי הדק']]
      ];
      // מבט מלפנים: הצד הימני של המטופלת מופיע משמאל הצופה
      let b = `<rect x="10" y="30" width="600" height="420" rx="18" fill="${C.soft}" stroke="${C.line}"/>`;
      cells.forEach((c, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const x = 10 + col * 200, y = 30 + row * 140;
        const fromSlide = ![3, 5, 7].includes(i);
        b += `<rect x="${x + 4}" y="${y + 4}" width="192" height="132" rx="12" fill="${C.card}" stroke="${fromSlide ? C.brand : C.line}" stroke-width="${fromSlide ? 1.5 : 1}" ${fromSlide ? '' : 'stroke-dasharray="5 4"'}/>`;
        b += T(x + 100, y + 30, c[0], { fw: 700, c: C.brand, fs: 14 });
        b += T(x + 100, y + 48, c[1], { fs: 11, c: C.muted, ltr: true });
        c[2].forEach((o, k) => { b += T(x + 100, y + 74 + k * 19, o, { fs: 12.5 }); });
      });
      b += T(110, 20, '← ימין המטופלת', { fs: 12, c: C.muted });
      b += T(510, 20, 'שמאל המטופלת →', { fs: 12, c: C.muted });
      b += `<line x1="160" y1="462" x2="190" y2="462" stroke="${C.brand}" stroke-width="2"/>` + T(270, 467, 'אזור שמופיע ברשימת השקף', { fs: 12, c: C.muted });
      b += `<line x1="350" y1="462" x2="380" y2="462" stroke="${C.muted}" stroke-dasharray="5 4"/>` + T(470, 467, 'הושלם ממקור חיצוני', { fs: 12, c: C.muted });
      return svg(620, 480, b, 'תשעת אזורי הבטן והאיברים בכל אזור');
    },

    /* גובה קרקעית הרחם בהריון */
    fundal() {
      let b = `<path d="M150 30 C110 120 100 220 120 330 C130 390 170 420 200 430 L300 430 C330 420 370 390 380 330 C400 220 390 120 350 30" fill="${C.soft}" stroke="${C.line}" stroke-width="2"/>`;
      const lv = [
        [60, 'שבוע 40 – ה-xiphoid', C.accent],
        [230, 'שבוע 20 – הטבור', C.brand],
        [372, 'שבוע 12 – יוצא מהאגן (סימפיזה)', C.muted]
      ];
      // רחם בגדלים שונים
      b += `<ellipse cx="250" cy="395" rx="48" ry="30" fill="none" stroke="${C.muscle}" stroke-width="2" opacity=".5"/>`;
      b += `<ellipse cx="250" cy="320" rx="80" ry="92" fill="none" stroke="${C.muscle}" stroke-width="2" opacity=".7"/>`;
      b += `<ellipse cx="250" cy="250" rx="112" ry="190" fill="none" stroke="${C.muscle}" stroke-width="2.5"/>`;
      b += `<circle cx="250" cy="230" r="5" fill="${C.brand}"/>`;
      b += `<path d="M150 418 Q250 445 350 418" fill="none" stroke="${C.ink}" stroke-width="3"/>` + T(250, 455, 'עצמות האגן', { fs: 12, c: C.muted });
      lv.forEach(([y, s, col]) => {
        b += `<line x1="370" y1="${y}" x2="440" y2="${y}" stroke="${col}" stroke-dasharray="4 3"/>`;
        b += T(560, y + 5, s, { fs: 13, fw: 700, c: col });
      });
      b += T(560, 160, 'גדל בכ-1 ס"מ בשבוע', { fs: 12, c: C.muted });
      return svg(680, 470, b, 'גובה הרחם בשבועות ההריון');
    },

    /* טריגון בשלפוחית */
    trigone() {
      let b = `<path d="M90 60 Q250 10 410 60 Q460 170 380 260 Q300 320 250 330 Q200 320 120 260 Q40 170 90 60 Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="2"/>`;
      b += `<polygon points="170,150 330,150 250,290" fill="${C.muscle2}" opacity=".55" stroke="${C.muscle}" stroke-width="2"/>`;
      b += `<path d="M120 40 Q150 100 170 150" fill="none" stroke="${C.organ}" stroke-width="9"/><path d="M380 40 Q350 100 330 150" fill="none" stroke="${C.organ}" stroke-width="9"/>`;
      b += `<circle cx="170" cy="150" r="7" fill="${C.ink}"/><circle cx="330" cy="150" r="7" fill="${C.ink}"/><circle cx="250" cy="295" r="8" fill="${C.ink}"/>`;
      b += `<rect x="238" y="300" width="24" height="80" fill="${C.organ}" stroke="${C.ink}"/>`;
      b += T(250, 225, 'טריגון', { fw: 800, fs: 16, c: '#5a1f16' });
      b += T(95, 25, 'שופכן – Ureter', { fs: 13 }) + T(405, 25, 'שופכן – Ureter', { fs: 13 });
      b += T(150, 180, 'פתח השופכן', { fs: 12, c: C.muted }) + T(350, 180, 'פתח השופכן', { fs: 12, c: C.muted });
      b += T(360, 360, 'צוואר השלפוחית ← השופכה (Urethra)', { fs: 13 });
      b += T(250, 90, 'דופן השלפוחית – Detrusor', { fs: 13, c: C.muted });
      return svg(500, 395, b, 'הטריגון בבסיס השלפוחית');
    },

    /* ארבע שכבות רצפת האגן */
    layers() {
      const rows = [
        ['1', 'Endopelvic fascia', 'רקמת חיבור פיברוטית שעוטפת ותומכת באיברים', C.fascia],
        ['2', 'Levator ani', 'שרירי ה-LA: מדף שרירי ותמיכה', C.muscle],
        ['3', 'Perineal membrane', 'שכבה פיברוטית נוקשה בחלק הקדמי', C.membrane],
        ['4', 'השכבה השטחית', 'שרירים שטחיים ו-Perineal body', C.muscle2]
      ];
      let b = '';
      // איברים מעל
      b += `<ellipse cx="190" cy="45" rx="55" ry="30" fill="${C.organ}"/>` + T(190, 50, 'שלפוחית', { fs: 13, fw: 700, c: '#1f2a2c' });
      b += `<ellipse cx="320" cy="45" rx="45" ry="30" fill="${C.muscle2}" opacity=".7"/>` + T(320, 50, 'רחם', { fs: 13, fw: 700, c: '#1f2a2c' });
      b += `<ellipse cx="440" cy="45" rx="50" ry="30" fill="#a7b892"/>` + T(440, 50, 'רקטום', { fs: 13, fw: 700, c: '#1f2a2c' });
      rows.forEach((r, i) => {
        const y = 90 + i * 72;
        b += `<rect x="40" y="${y}" width="540" height="58" rx="14" fill="${r[3]}" opacity="${i === 2 ? .85 : .9}"/>`;
        b += `<circle cx="70" cy="${y + 29}" r="17" fill="${C.card}"/>` + T(70, y + 35, r[0], { fw: 800, fs: 16, c: C.ink });
        b += T(340, y + 25, r[1], { fw: 800, fs: 16, c: '#1f2a2c', ltr: /^[A-Z]/.test(r[1]) });
        b += T(340, y + 46, r[2], { fs: 13, c: '#1f2a2c' });
      });
      b += `<line x1="610" y1="95" x2="610" y2="365" stroke="${C.muted}" stroke-width="2" marker-end="url(#ar)"/>`;
      b += `<defs><marker id="ar" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.muted}"/></marker></defs>`;
      b += T(610, 85, 'עמוק', { fs: 12, c: C.muted }) + T(610, 385, 'שטחי', { fs: 12, c: C.muted });
      return svg(640, 395, b, 'ארבע השכבות של רצפת האגן מהעמוקה לשטחית');
    },

    /* שלוש רמות התמיכה של הנרתיק */
    delancey() {
      const X = 470;
      let b = `<path d="M${X} 40 C${X - 15} 140 ${X - 15} 240 ${X} 400" fill="none" stroke="${C.organ}" stroke-width="46" stroke-linecap="round"/>`;
      b += `<rect x="${X - 38}" y="20" width="76" height="34" rx="12" fill="${C.muscle}"/>` + T(X, 42, 'צוואר', { fs: 12, fw: 700, c: '#fff' });
      const lv = [
        [60, 160, 'I', 'השליש העליון', 'מושעה בסיבים אנכיים של ה-Paracolpium,', 'המשך של ה-Cardinal ligament', C.accent],
        [170, 290, 'II', 'השליש האמצעי', 'מחובר לטרלית ל-Arcus tendineus', 'ולפסיה של ה-Levator ani', C.brand],
        [300, 410, 'III', 'השליש התחתון', 'מתמזג עם ה-Perineal membrane,', 'ה-LA וה-Perineal body', C.muscle]
      ];
      lv.forEach(([y0, y1, n, a, d1, d2, col]) => {
        b += `<rect x="${X - 70}" y="${y0}" width="140" height="${y1 - y0 - 6}" rx="10" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
        const ym = (y0 + y1) / 2;
        b += `<circle cx="${X - 70}" cy="${ym}" r="16" fill="${col}"/>` + T(X - 70, ym + 5, n, { fw: 800, fs: 14, c: '#fff', ltr: true });
        b += `<line x1="${X - 90}" y1="${ym}" x2="330" y2="${ym}" stroke="${col}" stroke-dasharray="3 3"/>`;
        b += T(180, ym - 14, a, { fw: 800, fs: 15, c: col });
        b += T(180, ym + 6, d1, { fs: 13 });
        b += T(180, ym + 24, d2, { fs: 13 });
        if (n === 'I') b += `<path d="M${X + 30} 80 L${X + 120} 40 M${X + 30} 110 L${X + 130} 90" stroke="${col}" stroke-width="3"/>`;
        if (n === 'II') b += `<path d="M${X + 25} 210 L${X + 130} 210 M${X + 25} 250 L${X + 130} 250" stroke="${col}" stroke-width="3"/><line x1="${X + 130}" y1="190" x2="${X + 130}" y2="270" stroke="${C.ink}" stroke-width="4"/>`;
        if (n === 'III') b += `<path d="M${X + 25} 360 L${X + 130} 360" stroke="${col}" stroke-width="8"/>`;
      });
      b += T(X + 140, 28, 'דופן האגן / סקרום', { fs: 11.5, c: C.muted }) + T(X + 130, 290, 'דופן האגן (Arcus tendineus)', { fs: 11.5, c: C.muted });
      return svg(680, 430, b, 'שלוש רמות התמיכה של הנרתיק לפי DeLancey');
    }
  };
})();
