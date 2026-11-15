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
        ['היפוכונדריום ימני', 'Rt. hypochondriac', ['אונה ימנית של הכבד', 'כיס המרה', 'קוטב עליון של כליה ימנית']],
        ['אפיגסטריום', 'Epigastric', ['קיבה, דאודנום, לבלב', 'חלק מהאונה הימנית', 'והאונה השמאלית של הכבד']],
        ['היפוכונדריום שמאלי', 'Lt. hypochondriac', ['טחול', 'פונדוס הקיבה', 'קצה הכבד']],
        ['מותני ימני', 'Rt. lumbar', ['מעי גס עולה', 'מעי דק', 'חלק מכליה ימנית']],
        ['טבורי', 'Umbilical', ['קיבה, דאודנום, מעי דק', 'מעי גס רוחבי', 'חלק מהכליות']],
        ['מותני שמאלי', 'Lt. lumbar', ['מעי גס יורד', 'מעי דק', 'חלק מכליה שמאלית']],
        ['איליאק ימני', 'Rt. iliac', ['צקום, אפנדיקס', 'חלק מהמעי הגס העולה', 'מעי דק']],
        ['היפוגסטריום', 'Hypogastric', ['שלפוחית, רחם', 'סיגמואיד, רקטום', 'מעי דק']],
        ['איליאק שמאלי', 'Lt. iliac', ['מעי גס יורד', 'סיגמואיד', 'חלק מהמעי הדק']]
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

    /* מבנה הרחם, חתך קדמי */
    uterus() {
      let b = '';
      // חצוצרות
      b += `<path d="M215 110 C170 90 120 95 80 120" fill="none" stroke="${C.muscle2}" stroke-width="10" stroke-linecap="round"/>`;
      b += `<path d="M385 110 C430 90 480 95 520 120" fill="none" stroke="${C.muscle2}" stroke-width="10" stroke-linecap="round"/>`;
      // פימבריה
      for (let k = 0; k < 5; k++) { b += `<line x1="80" y1="120" x2="${55 - k * 2}" y2="${105 + k * 10}" stroke="${C.muscle2}" stroke-width="3"/><line x1="520" y1="120" x2="${545 + k * 2}" y2="${105 + k * 10}" stroke="${C.muscle2}" stroke-width="3"/>`; }
      // שחלות
      b += `<ellipse cx="110" cy="165" rx="30" ry="18" fill="${C.organ}"/><ellipse cx="490" cy="165" rx="30" ry="18" fill="${C.organ}"/>`;
      // גוף הרחם (שכבות)
      const body = 'M210 100 Q300 70 390 100 L360 250 Q330 280 300 285 Q270 280 240 250 Z';
      b += `<path d="${body}" fill="${C.muscle}" stroke="${C.ink}" stroke-width="1.5"/>`;
      b += `<path d="M245 118 Q300 102 355 118 L335 235 Q300 255 265 235 Z" fill="${C.muscle2}"/>`;
      b += `<path d="M270 135 Q300 128 330 135 L315 225 Q300 235 285 225 Z" fill="#f3c9b8"/>`;
      // צוואר + נרתיק
      b += `<rect x="275" y="282" width="50" height="60" rx="10" fill="${C.muscle}" stroke="${C.ink}" stroke-width="1.5"/>`;
      b += `<path d="M262 342 L338 342 L330 440 L270 440 Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="1.5"/>`;
      // תוויות
      const L = (x1, y1, x2, y2, s, en) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.muted}"/>` + T(x2 + (x2 > 300 ? 55 : -55), y2 - 2, s, { fs: 13, fw: 700 }) + (en ? T(x2 + (x2 > 300 ? 55 : -55), y2 + 14, en, { fs: 11, c: C.muted, ltr: true }) : '');
      b += L(300, 88, 300, 40, '', '') + T(300, 32, 'קרקעית – Fundus', { fs: 13, fw: 700 });
      b += L(372, 170, 440, 230, 'גוף הרחם', 'Body');
      b += L(300, 275, 440, 285, 'מיצר', 'Isthmus');
      b += L(325, 315, 440, 335, 'צוואר הרחם', 'Cervix');
      b += L(300, 410, 440, 420, 'נרתיק', 'Vagina');
      b += L(110, 182, 120, 250, 'שחלה', 'Ovary');
      b += L(150, 97, 150, 55, 'חצוצרה', 'Fallopian tube');
      b += L(214, 150, 120, 320, 'Perimetrium', 'שכבה סרוזית חיצונית');
      b += L(255, 170, 120, 370, 'Myometrium', 'שריר, 1.5–2.5 ס"מ');
      b += L(285, 190, 120, 420, 'Endometrium', 'רירית');
      return svg(600, 460, b, 'מבנה הרחם, החצוצרות והשחלות');
    },

    /* טריגון בשלפוחית */
    trigone() {
      let b = `<path d="M90 60 Q250 10 410 60 Q460 170 380 260 Q300 320 250 330 Q200 320 120 260 Q40 170 90 60 Z" fill="${C.soft}" stroke="${C.ink}" stroke-width="2"/>`;
      b += `<polygon points="170,150 330,150 250,290" fill="${C.muscle2}" opacity=".55" stroke="${C.muscle}" stroke-width="2"/>`;
      b += `<path d="M120 40 Q150 100 170 150" fill="none" stroke="${C.organ}" stroke-width="9"/><path d="M380 40 Q350 100 330 150" fill="none" stroke="${C.organ}" stroke-width="9"/>`;
      b += `<circle cx="170" cy="150" r="7" fill="${C.ink}"/><circle cx="330" cy="150" r="7" fill="${C.ink}"/><circle cx="250" cy="295" r="8" fill="${C.ink}"/>`;
      b += `<rect x="238" y="300" width="24" height="80" fill="${C.organ}" stroke="${C.ink}"/>`;
      b += T(250, 225, 'טריגון', { fw: 800, fs: 16, c: C.muscle });
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
      b += `<ellipse cx="190" cy="45" rx="55" ry="30" fill="${C.organ}"/>` + T(190, 50, 'שלפוחית', { fs: 13, fw: 700 });
      b += `<ellipse cx="320" cy="45" rx="45" ry="30" fill="${C.muscle2}" opacity=".7"/>` + T(320, 50, 'רחם', { fs: 13, fw: 700 });
      b += `<ellipse cx="440" cy="45" rx="50" ry="30" fill="#a7b892"/>` + T(440, 50, 'רקטום', { fs: 13, fw: 700 });
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

    /* שרירי ה-Levator ani – מבט מלמעלה */
    levator() {
      let b = '';
      // מסגרת האגן
      b += `<path d="M300 30 C460 30 560 140 560 260 C560 380 440 450 300 450 C160 450 40 380 40 260 C40 140 140 30 300 30 Z" fill="${C.bone}" stroke="${C.muted}" stroke-width="2"/>`;
      b += `<path d="M300 60 C430 60 520 150 520 260 C520 370 420 425 300 425 C180 425 80 370 80 260 C80 150 170 60 300 60 Z" fill="${C.card}"/>`;
      // ATLA
      b += `<path d="M180 105 C120 170 100 240 115 320" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 4"/><path d="M420 105 C480 170 500 240 485 320" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 4"/>`;
      // Coccygeus
      b += `<path d="M115 330 Q200 380 285 420 L315 420 Q400 380 485 330 L470 360 Q390 405 315 435 L285 435 Q210 405 130 360 Z" fill="#9c7d6d"/>`;
      // Iliococcygeus
      b += `<path d="M118 315 C115 230 140 160 185 108 L245 112 C225 200 240 300 290 400 L300 405 L310 400 C360 300 375 200 355 112 L415 108 C460 160 485 230 482 315 Q400 370 315 412 L285 412 Q200 370 118 315 Z" fill="${C.muscle}" opacity=".75"/>`;
      // Pubococcygeus
      b += `<path d="M250 85 C215 170 225 290 292 405 L308 405 C375 290 385 170 350 85 L320 82 C340 170 330 260 300 330 C270 260 260 170 280 82 Z" fill="${C.muscle2}"/>`;
      // Puborectalis sling
      b += `<path d="M268 82 C240 170 250 275 300 300 C350 275 360 170 332 82 L318 82 C335 170 330 250 300 272 C270 250 265 170 282 82 Z" fill="#a8473a"/>`;
      // פתחים
      b += `<ellipse cx="300" cy="135" rx="9" ry="9" fill="${C.organ}" stroke="${C.ink}"/>`;
      b += `<ellipse cx="300" cy="185" rx="15" ry="20" fill="${C.organ}" stroke="${C.ink}"/>`;
      b += `<ellipse cx="300" cy="250" rx="15" ry="16" fill="#a7b892" stroke="${C.ink}"/>`;
      // תוויות
      b += T(300, 22, 'קדמי – Pubic symphysis', { fs: 13, fw: 700 });
      b += T(300, 470, 'אחורי – Coccyx', { fs: 13, fw: 700 });
      const lab = (x, y, s, col, tx, ty) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${C.muted}"/>` + T(tx + (tx > 300 ? 58 : -58), ty + 4, s, { fs: 12.5, fw: 700, c: col, ltr: true });
      b += lab(300, 135, 'Urethra', C.ink, 470, 60);
      b += lab(312, 185, 'Vagina', C.ink, 500, 110);
      b += lab(313, 250, 'Rectum', C.ink, 530, 175);
      b += lab(320, 285, 'Puborectalis', '#a8473a', 560, 240);
      b += lab(345, 200, 'Pubococcygeus', C.muscle, 60, 120);
      b += lab(440, 300, 'Iliococcygeus', C.muscle, 560, 320);
      b += lab(150, 360, 'Coccygeus', '#7d5f50', 50, 400);
      b += lab(120, 220, 'ATLA', C.ink, 50, 230);
      return `<svg viewBox="-130 0 880 480" role="img" aria-label="שרירי ה-Levator ani במבט מלמעלה" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
    },

    /* מערכת הסגירה של השופכה – שלושה שלישים */
    closure() {
      const cx = 135, cy = 160, r = 120, r2 = 62;
      const seg = (a0, a1, col) => {
        const p = (a, rr) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
        const [x0, y0] = p(a0, r), [x1, y1] = p(a1, r), [x2, y2] = p(a1, r2), [x3, y3] = p(a0, r2);
        return `<path d="M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${r2} ${r2} 0 0 0 ${x3} ${y3} Z" fill="${col}" stroke="${C.card}" stroke-width="3"/>`;
      };
      const t = Math.PI * 2 / 3, s = -Math.PI / 2;
      let b = seg(s, s + t, C.muscle) + seg(s + t, s + 2 * t, C.muscle2) + seg(s + 2 * t, s + 3 * t, '#c58aa0');
      b += T(cx, cy - 4, 'לחץ', { fw: 800, fs: 15 }) + T(cx, cy + 16, 'הסגירה', { fw: 800, fs: 15 });
      const leg = [
        [C.muscle, 'שריר משורטט', 'בעיקר סיבים איטיים (Type 1), טונוס קבוע'],
        [C.muscle2, 'שריר חלק', 'היצרות הפתח וקיצור השופכה'],
        ['#c58aa0', 'אספקת דם סבמוקוזלית', 'מגדילה נפח ואוטמת. תלויה באסטרוגן']
      ];
      leg.forEach((l, i) => {
        const y = 70 + i * 80;
        b += `<rect x="565" y="${y - 14}" width="22" height="22" rx="5" fill="${l[0]}"/>`;
        b += T(420, y + 2, l[1], { fw: 700, fs: 15 });
        b += T(420, y + 24, l[2], { fs: 12.5, c: C.muted });
      });
      b += T(420, 312, 'כל רכיב תורם כשליש', { fs: 13, fw: 700, c: C.brand });
      return svg(600, 330, b, 'שלושת רכיבי מערכת הסגירה של השופכה');
    },

    /* שלוש רמות התמיכה של הנרתיק */
    delancey() {
      const X = 470;
      let b = `<path d="M${X} 40 C${X - 15} 140 ${X - 15} 240 ${X} 400" fill="none" stroke="${C.organ}" stroke-width="46" stroke-linecap="round"/>`;
      b += `<rect x="${X - 38}" y="20" width="76" height="34" rx="12" fill="${C.muscle}"/>` + T(X, 42, 'צוואר', { fs: 12, fw: 700, c: '#fff' });
      const lv = [
        [60, 160, 'I', 'השליש העליון', 'מושעה מדפנות האגן', 'Cardinal + Uterosacral', C.accent],
        [170, 290, 'II', 'השליש האמצעי', 'מחובר לטרלית ל-ATFP', 'ולפסיה של ה-LA', C.brand],
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
      b += T(X + 140, 28, 'דופן האגן / סקרום', { fs: 11.5, c: C.muted }) + T(X + 130, 290, 'דופן האגן (ATFP)', { fs: 11.5, c: C.muted });
      return svg(680, 430, b, 'שלוש רמות התמיכה של הנרתיק לפי DeLancey');
    }
  };
})();
