/* Js isinya:
   1.  Animasi bintang background (seluruh halaman)
   2.  Animasi analogi Klasik vs Kuantum
   3.  Model matematis quantum tunneling
   4.  Simulator Plotly - grafik real-time
   5.  Nav scroll biar semoothh */


/* Bg Bintang animasinya */
(function initBgStars() {
  const canvas = document.getElementById('bg-stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 150 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 1.3 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.007 + 0.002,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = Math.abs(Math.sin(s.phase)) * 0.85;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* Animasi Analogi bagian qlasiq */
(function initKlasik() {
  const canvas = document.getElementById('canvas-klasik');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let ballX  = 18;
  let ballVX = 2.2;

  function draw() {
    canvas.width  = canvas.offsetWidth || 300;
    canvas.height = 72;
    const W = canvas.width;
    const H = 72;
    const wallX = W / 2 - 9;
    const wallW = 18;

    ctx.clearRect(0, 0, W, H);

    const wallGrad = ctx.createLinearGradient(wallX, 0, wallX + wallW, 0);
    wallGrad.addColorStop(0,   'rgba(255, 107, 157, 0.05)');
    wallGrad.addColorStop(0.5, 'rgba(255, 107, 157, 0.55)');
    wallGrad.addColorStop(1,   'rgba(255, 107, 157, 0.05)');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(wallX, 8, wallW, H - 16);

    ctx.strokeStyle = 'rgba(255, 107, 157, 0.6)';
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.moveTo(wallX, 8);         ctx.lineTo(wallX, H - 8);
    ctx.moveTo(wallX + wallW, 8); ctx.lineTo(wallX + wallW, H - 8);
    ctx.stroke();

    /* Gerak & pantul bola */
    ballX += ballVX;
    if (ballX >= wallX - 10 || ballX <= 10) ballVX *= -1;

    ctx.beginPath();
    ctx.arc(ballX, H / 2, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(232, 244, 248, 0.88)';
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
})();


/* Animasi analogi bagian kuantum */
(function initKuantum() {
  const canvas = document.getElementById('canvas-kuantum');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particleX   = -20;
  let transmitted = false;

  function draw() {
    canvas.width  = canvas.offsetWidth || 300;
    canvas.height = 72;
    const W = canvas.width;
    const H = 72;
    const wallX = W / 2 - 9;
    const wallW = 18;

    ctx.clearRect(0, 0, W, H);
    const portalGrad = ctx.createLinearGradient(wallX, 0, wallX + wallW, 0);
    portalGrad.addColorStop(0,   'rgba(0, 212, 170, 0.04)');
    portalGrad.addColorStop(0.5, 'rgba(0, 212, 170, 0.45)');
    portalGrad.addColorStop(1,   'rgba(0, 212, 170, 0.04)');
    ctx.fillStyle = portalGrad;
    ctx.fillRect(wallX, 8, wallW, H - 16);

    ctx.shadowColor = 'rgba(0, 212, 170, 0.55)';
    ctx.shadowBlur  = 8;
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.65)';
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.moveTo(wallX, 8);         ctx.lineTo(wallX, H - 8);
    ctx.moveTo(wallX + wallW, 8); ctx.lineTo(wallX + wallW, H - 8);
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* bola gerak */
    particleX += 1.8;

    if (particleX > wallX && particleX < wallX + wallW && !transmitted) {
      if (Math.random() < 0.012) transmitted = true;
    }

    if (particleX > W + 20) {
      particleX   = -20;
      transmitted = false;
    }
    let alpha = 1;
    if (particleX > wallX && particleX < wallX + wallW && !transmitted) {
      alpha = 0.2;
    }

    const color = transmitted
      ? `rgba(0, 212, 170, ${alpha})`
      : `rgba(232, 244, 248, ${alpha})`;
    if (transmitted) {
      ctx.shadowColor = 'rgba(0, 212, 170, 0.75)';
      ctx.shadowBlur  = 10;
    }

    ctx.beginPath();
    ctx.arc(particleX, H / 2, 9, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 0;

    requestAnimationFrame(draw);
  }

  draw();
})();


/*MODEL MATEMATIS QUANTUM TUNNELING*/

/**
 * @param {number} a
 * @param {number} b
 * @param {number} n
 * @returns {number[]}
 */
function linspace(a, b, n) {
  const arr  = [];
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) arr.push(a + i * step);
  return arr;
}

/**
 * @param {number} E  - energi partikel (eV)
 * @param {number} V0 - tinggi barrier (eV)
 * @returns {number}
 */
function kappa(E, V0) {
  return Math.sqrt(2 * Math.abs(V0 - E));
}

/**
 * persamaan Schrödinger.
 *   T = [ 1 + V₀² · sinh²(κL) / (4E(V₀−E)) ]⁻¹
 *
 * @param {number} E  - energi partikel
 * @param {number} V0 - tinggi barrier
 * @param {number} L  - lebar barrier
 * @returns {number} T ∈ [0, 1]
 */
function transmissionT(E, V0, L) {
  if (E >= V0) return 1;

  const k  = kappa(E, V0);
  const sh = Math.sinh(k * L);
  return 1 / (1 + (V0 * V0 * sh * sh) / (4 * E * (V0 - E)));
}

/**
 * Koefisien refleksi R.
 * @param {number} E
 * @param {number} V0
 * @param {number} L
 * @returns {number} R ∈ [0, 1]
 */
function reflectionR(E, V0, L) {
  return 1 - transmissionT(E, V0, L);
}

/**
 * Fungsi gelombang ψ(x) di tiga region:
 *
 *   Region I   (x < 0)      : osilasi : gelombang datang + pantul
 *   Region II  (0 ≤ x ≤ L)  : eksponensial : meluruh di dalam barrier
 *   Region III (x > L)      : osilasi : gelombang tertransmisi
 *
 * @param {number}   E    - energi partikel
 * @param {number}   V0   - tinggi barrier
 * @param {number}   L    - lebar barrier
 * @param {number[]} xArr - array posisi x
 * @returns {number[]}
 */
function wavefunction(E, V0, L, xArr) {
  const k   = Math.sqrt(2 * E);
  const kap = kappa(E, V0);
  const T   = transmissionT(E, V0, L);
  const sqT = Math.sqrt(T);
  const sqR = Math.sqrt(1 - T);

  return xArr.map(x => {
    if (x < 0) {
      return Math.cos(k * x) + sqR * Math.cos(-k * x);
    } else if (x <= L) {
      return Math.exp(-kap * x) * 0.75;
    } else {
      return sqT * Math.cos(k * (x - L));
    }
  });
}


/* GRAFIK REAL-TIME*/

let activeTab = 'psi';

const PLOT_LAYOUT = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'rgba(5, 22, 48, 0.7)',
  font: {
    color:  '#8ecfdc',
    family: 'Poppins, sans-serif',
    size:   11,
  },
  margin: { t: 20, b: 40, l: 50, r: 20 },
  xaxis: {
    gridcolor:  'rgba(0, 212, 170, 0.08)',
    zeroline:   false,
    color:      '#8ecfdc',
  },
  yaxis: {
    gridcolor:  'rgba(0, 212, 170, 0.08)',
    zeroline:   false,
    color:      '#8ecfdc',
  },
  showlegend: true,
  legend: {
    x:       0.02,
    y:       0.98,
    bgcolor: 'rgba(0,0,0,0.4)',
    font:    { size: 10, color: '#e8f4f8' },
  },
  hovermode: 'x',
};

const PLOT_CONFIG = {
  responsive:    true,
  displayModeBar: false,
};

/**
 *
 * @param {string}      tab - 'psi' | 'psi2' | 'both' | 'tvsl'
 * @param {HTMLElement} btn
 */
function switchTab(tab, btn) {
  activeTab = tab;
  document.querySelectorAll('.plot-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const note = document.getElementById('tvsl-note');
  if (note) note.style.display = tab === 'tvsl' ? 'flex' : 'none';

  updateSimulator();
}

function updateSimulator() {
  const E  = parseFloat(document.getElementById('sl-E').value);
  const V0 = parseFloat(document.getElementById('sl-V0').value);
  const L  = parseFloat(document.getElementById('sl-L').value);

  document.getElementById('lbl-E').textContent  = E.toFixed(2)  + ' eV';
  document.getElementById('lbl-V0').textContent = V0.toFixed(2) + ' eV';
  document.getElementById('lbl-L').textContent  = L.toFixed(1)  + ' Å';

  /*  Hitung T, R, κ */
  const T = transmissionT(E, V0, L);
  const R = reflectionR(E, V0, L);
  const k = kappa(E, V0);

  document.getElementById('val-T').textContent = (T * 100).toFixed(3) + '%';
  document.getElementById('val-R').textContent = (R * 100).toFixed(3) + '%';
  document.getElementById('val-K').textContent = k.toFixed(4);

  /*Bagian probabilitas transmisi */
  const bar = document.getElementById('prob-bar');
  if (bar) bar.style.width = (T * 100).toFixed(2) + '%';

  const chip   = document.getElementById('sim-chip');
  let msg      = '';
  let chipColor = 'rgba(0,212,170,0.05)';
  let chipBorder = 'var(--teal)';

  if (T < 0.001) {
    msg        = `Peluang sangat kecil (${(T * 100).toExponential(2)}%). Barrier sangat kuat — partikel hampir pasti terpantul. κ = ${k.toFixed(3)}.`;
    chipColor  = 'rgba(255,107,157,0.06)';
    chipBorder = '#ff6b9d';
  } else if (T < 0.1) {
    msg        = `Peluang kecil (${(T * 100).toFixed(3)}%). Fungsi gelombang meluruh cepat di dalam barrier. κ = ${k.toFixed(3)}.`;
    chipColor  = 'rgba(240,192,96,0.05)';
    chipBorder = '#f0c060';
  } else if (T < 0.5) {
    msg        = `Peluang sedang (${(T * 100).toFixed(2)}%). Ada kemungkinan nyata partikel menembus. Coba naikkan E atau perkecil L!`;
    chipColor  = 'rgba(0,212,170,0.05)';
    chipBorder = 'var(--teal)';
  } else {
    msg        = `Peluang tinggi (${(T * 100).toFixed(2)}%)! Barrier tipis atau E mendekati V₀ — partikel dominan tertransmisi.`;
    chipColor  = 'rgba(123,237,159,0.06)';
    chipBorder = '#7bed9f';
  }

  if (chip) {
    chip.textContent                = msg;
    chip.style.background           = chipColor;
    chip.style.borderLeftColor      = chipBorder;
  }


  if (activeTab === 'tvsl') {
    renderTvsL(E, V0);
  } else {
    renderWavefunction(E, V0, L, activeTab);
  }
}

/**
 * Render grafik ψ(x) dan/atau |ψ(x)|² menggunakan Plotly.
 *
 * @param {number} E
 * @param {number} V0
 * @param {number} L
 * @param {string} mode - 'psi' | 'psi2' | 'both'
 */
function renderWavefunction(E, V0, L, mode) {
  /* Buat array x di tiga region */
  const xL   = linspace(-8, 0,   200);  /* sebelum barrier */
  const xM   = linspace(0,  L,    80);  /* di dalam barrier */
  const xR   = linspace(L,  L + 8, 200); /* setelah barrier */
  const xAll = [...xL, ...xM, ...xR];

  /* Hitung ψ(x) dan |ψ(x)|² */
  const psi  = wavefunction(E, V0, L, xAll);
  const psi2 = psi.map(v => v * v);

  const traceBarrier = {
    x:         [0, 0, L, L, 0],
    y:         [0, 1.6, 1.6, 0, 0],
    fill:      'toself',
    fillcolor: 'rgba(0, 212, 170, 0.08)',
    line:      { color: 'rgba(0, 212, 170, 0.35)', width: 1 },
    name:      'Barrier V₀',
    hoverinfo: 'skip',
    showlegend: true,
  };

  /* Trace ψ(x) */
  const tracePsi = {
    x:    xAll,
    y:    psi,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#00d4aa', width: 2.5 },
    name: 'ψ(x)',
    hovertemplate: 'x = %{x:.2f}<br>ψ = %{y:.4f}<extra></extra>',
  };

  /* Trace |ψ(x)|² */
  const tracePsi2 = {
    x:    xAll,
    y:    psi2,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#7bed9f', width: 2.5 },
    name: '|ψ(x)|²',
    hovertemplate: 'x = %{x:.2f}<br>|ψ|² = %{y:.4f}<extra></extra>',
  };


  let traces;
  if      (mode === 'psi')  traces = [traceBarrier, tracePsi];
  else if (mode === 'psi2') traces = [traceBarrier, tracePsi2];
  else                      traces = [traceBarrier, tracePsi, tracePsi2];

  const layout = {
    ...PLOT_LAYOUT,
    yaxis: { ...PLOT_LAYOUT.yaxis, title: 'Amplitudo' },
    xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Posisi x (Å)' },
  };

  Plotly.react('plot-area', traces, layout, PLOT_CONFIG);
}

/**
 * @param {number} E  - 
 * @param {number} V0 - 
 */
function renderTvsL(E, V0) {
  /* Kurva T(L) kontinu */
  const LArr = linspace(0.2, 10, 300);
  const TArr = LArr.map(l => transmissionT(E, V0, l));

  const traceLine = {
    x:    LArr,
    y:    TArr.map(v => v * 100),
    type: 'scatter',
    mode: 'lines',
    line: { color: '#00d4aa', width: 2.5 },
    name: 'T(L)',
    hovertemplate: 'L = %{x:.1f} Å<br>T = %{y:.3f}%<extra></extra>',
  };

  const L_MARKS = [2, 5, 8];
  const T_MARKS = L_MARKS.map(l => transmissionT(E, V0, l));
  const COLORS  = ['#f0c060', '#ff6b9d', '#a78bfa'];
  const LABELS  = L_MARKS.map((l, i) =>
    `L${i + 1} = ${l} Å → T = ${(T_MARKS[i] * 100).toFixed(2)}%`
  );

  const traceDots = {
    x:           L_MARKS,
    y:           T_MARKS.map(v => v * 100),
    type:        'scatter',
    mode:        'markers+text',
    text:        LABELS,
    textposition: 'top right',
    textfont:    { size: 10, color: '#e8f4f8' },
    marker: {
      size:  12,
      color: COLORS,
      line:  { color: 'white', width: 1.5 },
    },
    name:        'L₁, L₂, L₃',
    hovertemplate: '%{text}<extra></extra>',
  };

  const layout = {
    ...PLOT_LAYOUT,
    xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Lebar barrier L (Å)', range: [0, 10.5] },
    yaxis: { ...PLOT_LAYOUT.yaxis, title: 'Probabilitas transmisi T (%)', range: [-2, 105] },
  };

  Plotly.react('plot-area', [traceLine, traceDots], layout, PLOT_CONFIG);
}

document.addEventListener('DOMContentLoaded', function () {
  updateSimulator();

  const note = document.getElementById('tvsl-note');
  if (note) note.style.display = 'none';
});


/* NAV scroll*/
(function initNavHighlight() {
  const sectionIds = ['hero', 'konsep', 'minigame', 'simulator', 'quiz'];

  function update() {
    const y = window.scrollY + 90;

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      const a  = document.querySelector(`nav a[href="#${id}"]`);
      if (!el || !a) return;

      if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
        });
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();