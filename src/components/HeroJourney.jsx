import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL;
const jimg = (f) => `${BASE}img/journey/${f}`;

const GROUPS_DEF = [
  {
    win: [0.3, 0.5],
    kicker: 'в деле · по всей России',
    title: 'Проекты',
    items: [
      { img: 'scene-1.jpg', cap: 'Навигация · ТРЦ Columbus' },
      { img: 'interior-c.jpg', cap: 'Музейная экспозиция' },
      { img: 'scene-clinic.jpg', cap: 'Медицинский центр' },
      { img: 'scene-mall.jpg', cap: 'Инфокиоски · ритейл' },
      { img: 'scene-mall-2.jpg', cap: 'ТРЦ · навигация' },
      { img: 'project-gallery.jpg', cap: 'Галерея · выставка' },
    ],
  },
  {
    win: [0.5, 0.68],
    kicker: 'собственное производство',
    title: 'Оборудование',
    items: [
      { img: 'table.webp', cap: 'Сенсорный стол Diamant 55 N', lite: 1 },
      { img: 'terminal-dark.webp', cap: 'Киоск напольный', lite: 1 },
      { img: 'table-front.webp', cap: 'Diamant · 43—65″', lite: 1 },
      { img: 'design-render.jpg', cap: 'Промышленный дизайн', lite: 1 },
      { img: 'wire.webp', cap: 'Конструкторское бюро', lite: 1 },
    ],
  },
  {
    win: [0.68, 0.83],
    kicker: 'собственная разработка',
    title: 'Программные решения',
    items: [
      { img: 'soft-nav.jpg', cap: 'Интерактивная навигация' },
      { img: 'soft-fit.jpg', cap: 'Виртуальная примерочная' },
      { img: 'soft-proj.jpg', cap: 'Интеграции · совместные проекты' },
      { img: 'terminal.webp', cap: 'Инфокиоск · фирменное ПО', lite: 1 },
    ],
  },
];

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const mix = (a, b, t) => a + (b - a) * t;
const eOut = (t) => 1 - Math.pow(1 - t, 3);
const eInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const N_PARTICLES = 2600;
const ZOOM_BIG = 9.5;

export default function HeroJourney() {
  const scrollerRef = useRef(null);
  const stageRef = useRef(null);
  const worldARef = useRef(null);
  const twrapRef = useRef(null);
  const maskRef = useRef(null);
  const hintRef = useRef(null);
  const gutsRef = useRef(null);
  const canvasRef = useRef(null);
  const cardsRef = useRef([]); // flat [{el, groupIdx, idxInGroup}]
  const titlesRef = useRef([]);
  const finalRef = useRef(null);
  const wordRef = useRef(null);
  const kickerRef = useRef(null);
  const leadRef = useRef(null);
  const grainRef = useRef(null);
  const vigRef = useRef(null);

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const scroller = scrollerRef.current;
    const stage = stageRef.current;
    const worldA = worldARef.current;
    const twrap = twrapRef.current;
    const mask = maskRef.current;
    const hint = hintRef.current;
    const gutsEl = gutsRef.current;
    const cv = canvasRef.current;
    const finalEl = finalRef.current;
    const wordEl = wordRef.current;
    const kickerEl = kickerRef.current;
    const leadEl = leadRef.current;
    const grain = grainRef.current;
    const vig = vigRef.current;
    const ctx = cv.getContext('2d');

    const groups = GROUPS_DEF.map((g, gi) => ({
      ...g,
      titleEl: titlesRef.current[gi],
      els: cardsRef.current.filter((c) => c.groupIdx === gi).map((c) => c.el),
      poses: [],
    }));
    groups.forEach((g) => {
      g.poses = g.els.map(() => ({ x: innerWidth / 2, y: innerHeight / 2, s: 1 }));
    });
    const burst = groups[groups.length - 1];

    let W = 0;
    let H = 0;
    let DPR = 1;
    function resize() {
      DPR = Math.min(1.6, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * DPR;
      cv.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    addEventListener('resize', resize);

    const glow = document.createElement('canvas');
    glow.width = glow.height = 64;
    {
      const g = glow.getContext('2d');
      const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      rg.addColorStop(0, 'rgba(210,242,252,1)');
      rg.addColorStop(0.32, 'rgba(66,182,226,.55)');
      rg.addColorStop(1, 'rgba(24,120,168,0)');
      g.fillStyle = rg;
      g.fillRect(0, 0, 64, 64);
    }

    const P = new Array(N_PARTICLES);
    for (let i = 0; i < N_PARTICLES; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.62);
      const z = Math.random();
      P[i] = {
        a, r, z,
        x: 0, y: 0, vx: 0, vy: 0,
        seedx: Math.random() * 6.28, seedy: Math.random() * 6.28,
        spd: 0.15 + Math.random() * 0.5,
        tx: 0, ty: 0, hasT: false, init: false,
        delay: Math.random(),
        card: i % burst.els.length,
        ox: Math.random() - 0.5, oy: Math.random() - 0.5,
      };
    }

    (function sampleWord() {
      const LW = 1000;
      const LH = 190;
      const oc = document.createElement('canvas');
      oc.width = LW;
      oc.height = LH;
      const o = oc.getContext('2d');
      function build() {
        o.clearRect(0, 0, LW, LH);
        o.fillStyle = '#fff';
        o.textAlign = 'center';
        o.textBaseline = 'middle';
        o.font = '800 132px "Plus Jakarta Sans", sans-serif';
        o.fillText('ZORGTECH', LW / 2, LH * 0.42);
        o.save();
        o.font = '600 24px "Plus Jakarta Sans", sans-serif';
        o.fillText('ИНТЕРАКТИВНОЕ ОБОРУДОВАНИЕ'.split('').join(' '), LW / 2, LH * 0.9);
        o.restore();
        const d = o.getImageData(0, 0, LW, LH).data;
        const pts = [];
        for (let y = 0; y < LH; y += 2)
          for (let x = 0; x < LW; x += 2) {
            if (d[(y * LW + x) * 4 + 3] > 90) pts.push([x - LW / 2, y - LH / 2]);
          }
        for (let i = pts.length - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          const tmp = pts[i];
          pts[i] = pts[j];
          pts[j] = tmp;
        }
        for (let i = 0; i < N_PARTICLES; i++) {
          const tp = pts[i % pts.length];
          P[i].tx = tp[0];
          P[i].ty = tp[1];
          P[i].hasT = true;
        }
      }
      if (document.fonts && document.fonts.load) {
        Promise.all([
          document.fonts.load('800 132px "Plus Jakarta Sans"'),
          document.fonts.load('600 24px "Plus Jakarta Sans"'),
        ]).then(build).catch(build);
        document.fonts.ready.then(build);
      } else build();
    })();

    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    const onPointer = (e) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    addEventListener('pointermove', onPointer);

    function debugP() {
      const q = new URLSearchParams(location.search).get('hj');
      if (q != null && !isNaN(parseFloat(q))) return clamp(parseFloat(q));
      return null;
    }
    const fixedP = debugP();

    function spiralPose(u, cx, cy) {
      const maxR = Math.min(W, H) * 0.62;
      const th = -Math.PI / 2 + u * Math.PI * 2 * 1.35;
      const R = mix(maxR, 26, Math.pow(u, 0.85));
      return {
        x: cx + Math.cos(th) * R * 1.28,
        y: cy + Math.sin(th) * R * 0.72,
        s: 0.32 + Math.pow(u, 1.5) * 1.12,
        o: Math.pow(Math.sin(u * Math.PI), 1.2) * (1 - seg(u, 0.8, 0.96)),
        b: (1 - u) * 2.2 + Math.max(0, u - 0.88) * 8,
        th,
      };
    }

    let pSmooth = 0;
    let raf = 0;
    let darkFlag = false;
    // After the journey finishes once, keep the final ZORGTECH screen —
    // scrolling back up must not rewind the cinematic.
    let completed = false;
    try {
      completed = sessionStorage.getItem('hj-done') === '1';
    } catch {
      /* private mode */
    }

    function draw(now) {
      const t = now / 1000;
      let p;
      if (fixedP != null) {
        p = fixedP;
      } else if (completed) {
        p = 1;
        pSmooth = 1;
      } else {
        const rect = scroller.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        p = clamp(total > 0 ? -rect.top / total : 0);
        pSmooth += (p - pSmooth) * 0.16;
        if (Math.abs(p - pSmooth) < 0.0004) pSmooth = p;
        p = pSmooth;
        if (p >= 0.985) {
          completed = true;
          p = 1;
          pSmooth = 1;
          try {
            sessionStorage.setItem('hj-done', '1');
          } catch {
            /* private mode */
          }
        }
      }
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      const cx = W / 2;
      const cy = H / 2;

      const pIntro = seg(p, 0.02, 0.12);
      const pZoom = seg(p, 0.12, 0.3);
      const gv = eInOut(seg(p, 0.26, 0.38));
      const conv = seg(p, 0.8, 0.95);
      const rev = eExpo(seg(p, 0.9, 1));

      const dark = eInOut(seg(p, 0.15, 0.28));
      const pWhite = eInOut(seg(p, 0.96, 1));
      stage.style.background = `rgb(${mix(mix(246, 5, dark), 250, pWhite) | 0},${mix(mix(248, 8, dark), 252, pWhite) | 0},${mix(mix(250, 11, dark), 254, pWhite) | 0})`;

      // шапка сайта прячется в тёмной части
      const wantDark = dark > 0.35 && pWhite < 0.6;
      if (wantDark !== darkFlag) {
        darkFlag = wantDark;
        document.documentElement.toggleAttribute('data-hj-dark', wantDark);
      }

      const z = eInOut(pZoom);
      twrap.style.transform = `scale(${1 + eOut(pIntro) * 0.04 + z * (ZOOM_BIG - 1)})`;
      twrap.style.filter = `blur(${(z * (1 - z) * 7).toFixed(1)}px)`;
      worldA.style.opacity = (1 - eInOut(seg(p, 0.23, 0.3))).toFixed(3);
      hint.style.opacity = (1 - seg(p, 0.03, 0.1)).toFixed(3);
      mask.style.opacity = eInOut(seg(p, 0.12, 0.24)).toFixed(3);

      gutsEl.style.opacity = (gv * (1 - eInOut(seg(p, 0.96, 1)))).toFixed(3);

      const par2 = 16;
      groups.forEach((g) => {
        const gp = seg(p, g.win[0], g.win[1]);
        const vis = Math.min(seg(gp, 0, 0.1), 1 - seg(gp, 0.9, 1));
        g.titleEl.style.opacity = (vis * gv).toFixed(3);
        g.titleEl.style.transform = `translateX(-50%) translateY(${(1 - vis) * 12}px)`;
        const n = g.els.length;
        g.els.forEach((el, i) => {
          const u = (Math.min(gp, 0.999) * 1.25 + i / n) % 1;
          const q = spiralPose(u, cx, cy);
          const px = q.x + mx * par2 * (0.4 + u);
          const py = q.y + my * par2 * (0.4 + u);
          if (gp > 0) g.poses[i] = { x: px, y: py, s: q.s };
          if (gp <= 0 || gp >= 1 || vis <= 0.001) {
            el.style.opacity = '0';
            el.style.transform = 'translate(-200vw,0)';
            return;
          }
          el.style.opacity = (q.o * vis * gv).toFixed(3);
          el.style.filter = `blur(${q.b.toFixed(1)}px)`;
          el.style.zIndex = (u * 100) | 0;
          el.style.transform = `translate(${px.toFixed(1)}px,${py.toFixed(1)}px) translate(-50%,-50%) scale(${q.s.toFixed(3)}) rotate(${(Math.sin(q.th) * 3).toFixed(2)}deg)`;
        });
      });

      ctx.clearRect(0, 0, W, H);
      if (gv > 0.002) {
        const logoScale = Math.min(W * 0.86, 1000) / 1000;
        const par = 28;
        const dustA = eInOut(seg(p, 0.78, 0.86));
        const cardW = burst.els[0].offsetWidth || 280;

        if (dustA > 0.002) {
          ctx.globalCompositeOperation = 'lighter';
          const ec = conv;
          for (let i = 0; i < N_PARTICLES; i++) {
            const q = P[i];
            const pose = burst.poses[q.card];
            const cw = cardW * pose.s;
            const nX = Math.sin(q.a * 3 + t * 0.5 + q.seedx) * 9;
            const nY = Math.cos(q.a * 2.4 + t * 0.44 + q.seedy) * 9;
            const hx = pose.x + q.ox * cw + nX + mx * par * (q.z * 0.6 + 0.2);
            const hy = pose.y + q.oy * cw * 0.75 + nY + my * par * (q.z * 0.6 + 0.2);
            if (!q.init) {
              q.x = hx;
              q.y = hy;
              q.init = true;
            }
            const tX = cx + q.tx * logoScale;
            const tY = cy + q.ty * logoScale;
            const hx2 = mix(hx, tX, ec * 0.24);
            const hy2 = mix(hy, tY, ec * 0.24);
            const bt = q.hasT ? eInOut(clamp((ec - q.delay * 0.18) / 0.6)) : 0;
            const hmx = mix(hx2, tX, 0.5);
            const hmy = mix(hy2, tY, 0.5);
            const mxp = hmx + (cx - hmx) * 0.5;
            const myp = hmy + (cy - hmy) * 0.5;
            const u1 = 1 - bt;
            const dx = u1 * u1 * hx2 + 2 * u1 * bt * mxp + bt * bt * tX;
            const dy = u1 * u1 * hy2 + 2 * u1 * bt * myp + bt * bt * tY;
            const stiff = mix(0.055, 0.15, bt);
            const damp = mix(0.88, 0.84, bt);
            q.vx = (q.vx + (dx - q.x) * stiff) * damp;
            q.vy = (q.vy + (dy - q.y) * stiff) * damp;
            q.x += q.vx;
            q.y += q.vy;
            const sz = (0.55 + q.z * 1.7) * mix(1, 0.95, ec);
            const br = 0.16 + q.z * 0.5;
            const handoff = 1 - eInOut(seg(p, 0.945, 0.99));
            const a = dustA * handoff * br * (0.68 + 0.32 * Math.sin(t * 1.3 + q.seedx));
            if (q.z < 0.42) {
              const gs = (2.3 - q.z * 2) * (6 + sz * 4);
              ctx.globalAlpha = a * 0.5;
              ctx.drawImage(glow, q.x - gs / 2, q.y - gs / 2, gs, gs);
            }
            ctx.globalAlpha = a;
            ctx.fillStyle = `rgb(${(24 + q.z * 196) | 0},${(120 + q.z * 118) | 0},${(168 + q.z * 84) | 0})`;
            ctx.fillRect(q.x - sz / 2, q.y - sz / 2, sz, sz);
          }
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        }

        const sh = seg(p, 0.93, 1);
        if (sh > 0.001 && sh < 1) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = `rgba(130,220,245,${((1 - sh) * 0.45).toFixed(3)})`;
          ctx.lineWidth = mix(7, 1, sh);
          ctx.beginPath();
          ctx.arc(cx, cy, eOut(sh) * Math.max(W, H) * 0.62, 0, 6.28);
          ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        }
        const fl = Math.max(0, Math.sin(seg(p, 0.93, 0.99) * Math.PI)) * 0.42;
        if (fl > 0.002) {
          const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.55);
          rg.addColorStop(0, `rgba(205,242,252,${fl.toFixed(3)})`);
          rg.addColorStop(1, 'rgba(205,242,252,0)');
          ctx.fillStyle = rg;
          ctx.fillRect(0, 0, W, H);
        }
      }

      finalEl.style.opacity = eInOut(seg(p, 0.93, 0.985)).toFixed(3);
      finalEl.style.transform = `scale(${mix(0.97, 1, rev)})`;
      finalEl.style.pointerEvents = p > 0.97 ? 'auto' : 'none';

      wordEl.style.color = `rgb(${mix(240, 10, pWhite) | 0},${mix(251, 10, pWhite) | 0},${mix(255, 10, pWhite) | 0})`;
      wordEl.style.textShadow = `0 0 34px rgba(79,199,238,${(0.5 * (1 - pWhite)).toFixed(3)}),0 0 90px rgba(42,170,221,${(0.35 * (1 - pWhite)).toFixed(3)})`;
      kickerEl.style.color = `rgb(${mix(163, 26, pWhite) | 0},${mix(213, 143, pWhite) | 0},${mix(232, 184, pWhite) | 0})`;
      leadEl.style.color = `rgb(${mix(163, 58, pWhite) | 0},${mix(213, 58, pWhite) | 0},${mix(232, 58, pWhite) | 0})`;
      cv.style.opacity = (1 - pWhite).toFixed(3);

      grain.style.transform = `translate(${(Math.sin(t * 7) * 6) | 0}px,${(Math.cos(t * 6) * 6) | 0}px)`;
      grain.style.opacity = (dark * (1 - pWhite) * (0.05 + 0.03 * gv)).toFixed(3);
      vig.style.opacity = (dark * (1 - pWhite) * (0.55 + eInOut(seg(p, 0.4, 0.6)) * 0.3)).toFixed(3);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onPointer);
      document.documentElement.removeAttribute('data-hj-dark');
    };
  }, []);

  let cardFlatIdx = 0;

  return (
    <section className="hj-scroller" ref={scrollerRef} aria-label="Zorgtech — интерактивное оборудование">
      <div className="hj-stage" ref={stageRef}>
        <div className="hj-world" ref={worldARef} aria-hidden="true">
          <div className="hj-floor" />
          <div className="hj-kiosk" ref={twrapRef}>
            <img src={jimg('terminal-dark.webp')} alt="" />
            <div className="hj-screen-mask" ref={maskRef} />
          </div>
        </div>

        <div className="hj-hint" ref={hintRef} aria-hidden="true">
          <div className="hj-gesture">
            <span className="hj-chev" />
            <span className="hj-chev hj-chev--2" />
            <div className="hj-hand">
              <svg viewBox="0 0 24 28">
                <path d="M9.2 13.5V4.6a1.8 1.8 0 1 1 3.6 0v7.2l3 .55 2.8.9c.95.3 1.55 1.25 1.42 2.24l-.5 3.9a3.6 3.6 0 0 1-3.57 3.11h-3.3a4.6 4.6 0 0 1-3.5-1.6l-3.1-3.63a1.65 1.65 0 0 1 2.47-2.18l1.68 1.86" />
              </svg>
            </div>
          </div>
          Свайпайте вверх — загляните внутрь
        </div>

        <div className="hj-guts" ref={gutsRef} aria-hidden="true">
          <canvas ref={canvasRef} />
          <div className="hj-cards">
            {GROUPS_DEF.map((g, gi) =>
              g.items.map((it, i) => {
                const flat = cardFlatIdx++;
                return (
                  <div
                    key={`${gi}-${i}`}
                    className={`hj-card${it.lite ? ' hj-card--lite' : ''}`}
                    ref={(el) => {
                      if (el) cardsRef.current[flat] = { el, groupIdx: gi, idxInGroup: i };
                    }}
                  >
                    <img src={jimg(it.img)} alt="" loading="lazy" />
                    <div className="hj-cap">{it.cap}</div>
                  </div>
                );
              }),
            )}
          </div>
          {GROUPS_DEF.map((g, gi) => (
            <div
              key={g.title}
              className="hj-gtitle"
              ref={(el) => {
                if (el) titlesRef.current[gi] = el;
              }}
            >
              <div className="hj-gtitle-k">{g.kicker}</div>
              <div className="hj-gtitle-t">{g.title}</div>
            </div>
          ))}
        </div>

        <div className="hj-final" ref={finalRef}>
          <h1 className="hj-word" ref={wordRef} aria-label="Zorgtech">
            ZORG<span>TECH</span>
          </h1>
          <p className="hj-kicker" ref={kickerRef}>
            российский производитель
          </p>
          <p className="hj-lead" ref={leadRef}>
            Интерактивное оборудование полного цикла
          </p>
          <div className="hj-cta">
            <Link className="btn primary btn--lg" to="/catalog">
              В каталог →
            </Link>
            <Link className="btn secondary btn--lg" to="/contacts">
              Обсудить задачу
            </Link>
          </div>
        </div>

        <div className="hj-grain" ref={grainRef} aria-hidden="true" />
        <div className="hj-vig" ref={vigRef} aria-hidden="true" />
      </div>
    </section>
  );
}
