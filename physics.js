/* ═══════════════════════════════════════════════
   QUANTUM TUNNELING ADVENTURE — physics.js
   Berisi:
   1. Animasi bintang hero (canvas #hero-stars)
   2. Animasi bintang background section 2-5 (canvas #bg-stars)
   3. Animasi analogi Klasik vs Kuantum
   4. Model matematis quantum tunneling
   5. Nav scroll highlight
═══════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   1. ANIMASI BINTANG — HERO
   Canvas #hero-stars berada di dalam section hero
   sehingga bintang tampil di atas gambar latar
───────────────────────────────────────── */
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

  /* Hapus bagian updateOpacity karena sekarang selalu terlihat */
})();


/* ─────────────────────────────────────────
   2. ANIMASI BINTANG — BACKGROUND SECTION 2-5
   Canvas #bg-stars adalah fixed di belakang semua section.
   Opacity diatur berdasarkan posisi scroll:
   - Saat di hero  → opacity 0 (tertutup gambar)
   - Saat di bawah → opacity 1
───────────────────────────────────────── */
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

  /* Buat 100 bintang kecil untuk background */
  const stars = Array.from({ length: 100 }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    r:     Math.random() * 1.1 + 0.15,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.005 + 0.0015,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = Math.abs(Math.sin(s.phase)) * 0.65;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();

  /* Atur opacity canvas sesuai scroll:
     - Di dalam hero      → opacity 0
     - Di bawah hero      → opacity 1
     Transisi smooth lewat CSS akan di-set inline */
  canvas.style.transition = 'opacity 0.6s ease';

  function updateOpacity() {
    const hero       = document.getElementById('hero');
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
    const scrollY    = window.scrollY;

    /* Mulai fade in ketika scroll melewati 80% tinggi hero */
    const fadeStart  = heroBottom * 0.8;
    const fadeEnd    = heroBottom;
    const progress   = Math.min(Math.max((scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1);

    canvas.style.opacity = progress.toFixed(3);
  }

  window.addEventListener('scroll', updateOpacity, { passive: true });
  updateOpacity(); /* jalankan sekali saat halaman pertama dimuat */
})();


/* ─────────────────────────────────────────
   3. ANIMASI ANALOGI — KLASIK vs KUANTUM
───────────────────────────────────────── */

/* ── 3a. Dunia Klasik: bola memantul di dinding ── */
(function initKlasik() {
  const canvas = document.getElementById('canvas-klasik');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let ballX  = 18;
  let ballVX = 2.2;

  function draw() {
    canvas.width  = canvas.offsetWidth  || 300;
    canvas.height = 72;
    const W = canvas.width;
    const H = 72;
    const wallX = W / 2 - 9;
    const wallW = 18;

    ctx.clearRect(0, 0, W, H);

    /* Dinding merah */
    const wallGrad = ctx.createLinearGradient(wallX, 0, wallX + wallW, 0);
    wallGrad.addColorStop(0,   'rgba(255, 107, 157, 0.05)');
    wallGrad.addColorStop(0.5, 'rgba(255, 107, 157, 0.55)');
    wallGrad.addColorStop(1,   'rgba(255, 107, 157, 0.05)');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(wallX, 8, wallW, H - 16);

    /* Garis tepi dinding */
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.6)';
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.moveTo(wallX,         8);
    ctx.lineTo(wallX,         H - 8);
    ctx.moveTo(wallX + wallW, 8);
    ctx.lineTo(wallX + wallW, H - 8);
    ctx.stroke();

    /* Gerakkan bola */
    ballX += ballVX;
    if (ballX >= wallX - 10 || ballX <= 10) ballVX *= -1;

    /* Bola putih */
    ctx.beginPath();
    ctx.arc(ballX, H / 2, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(232, 244, 248, 0.88)';
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ── 3b. Dunia Kuantum: partikel menembus dinding ── */
(function initKuantum() {
  const canvas = document.getElementById('canvas-kuantum');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particleX    = -20;
  let transmitted  = false;

  function draw() {
    canvas.width  = canvas.offsetWidth  || 300;
    canvas.height = 72;
    const W = canvas.width;
    const H = 72;
    const wallX = W / 2 - 9;
    const wallW = 18;

    ctx.clearRect(0, 0, W, H);

    /* Dinding teal (portal) */
    const portalGrad = ctx.createLinearGradient(wallX, 0, wallX + wallW, 0);
    portalGrad.addColorStop(0,   'rgba(0, 212, 170, 0.04)');
    portalGrad.addColorStop(0.5, 'rgba(0, 212, 170, 0.45)');
    portalGrad.addColorStop(1,   'rgba(0, 212, 170, 0.04)');
    ctx.fillStyle = portalGrad;
    ctx.fillRect(wallX, 8, wallW, H - 16);

    /* Garis tepi portal dengan glow */
    ctx.shadowColor = 'rgba(0, 212, 170, 0.55)';
    ctx.shadowBlur  = 8;
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.65)';
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.moveTo(wallX,         8);
    ctx.lineTo(wallX,         H - 8);
    ctx.moveTo(wallX + wallW, 8);
    ctx.lineTo(wallX + wallW, H - 8);
    ctx.stroke();
    ctx.shadowBlur = 0;

    /* Gerakkan partikel */
    particleX += 1.8;

    /* Cek apakah di dalam dinding & belum transmitted */
    if (particleX > wallX && particleX < wallX + wallW && !transmitted) {
      if (Math.random() < 0.012) transmitted = true;
    }

    /* Reset setelah keluar layar */
    if (particleX > W + 20) {
      particleX   = -20;
      transmitted = false;
    }

    /* Hitung transparansi: memudar saat di dalam dinding (jika tidak tunnel) */
    let alpha = 1;
    if (particleX > wallX && particleX < wallX + wallW && !transmitted) {
      alpha = 0.2;
    }

    /* Warna berbeda setelah tunnel */
    const color = transmitted
      ? `rgba(0, 212, 170, ${alpha})`
      : `rgba(232, 244, 248, ${alpha})`;

    /* Glow partikel setelah tunnel */
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


/* ─────────────────────────────────────────
   4. MODEL MATEMATIS QUANTUM TUNNELING
───────────────────────────────────────── */

/**
 * Buat array angka dari `a` ke `b` sebanyak `n` titik (inklusif).
 */
function linspace(a, b, n) {
  const arr  = [];
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) {
    arr.push(a + i * step);
  }
  return arr;
}

/**
 * Koefisien peluruhan kappa — seberapa cepat fungsi gelombang
 * meluruh eksponensial di dalam barrier.
 * Unit alami: ℏ = 1, massa m = 1
 *
 * @param {number} E  - energi partikel (eV)
 * @param {number} V0 - tinggi barrier (eV)
 * @returns {number}
 */
function kappa(E, V0) {
  return Math.sqrt(2 * Math.abs(V0 - E));
}

/**
 * Koefisien transmisi T — probabilitas partikel berhasil
 * menembus barrier. Formula eksak dari persamaan Schrödinger.
 *
 *   T = [1 + V₀²·sinh²(κL) / (4E(V₀−E))]⁻¹
 *
 * @param {number} E  - energi partikel
 * @param {number} V0 - tinggi barrier
 * @param {number} L  - lebar barrier
 * @returns {number} T ∈ [0, 1]
 */
function transmissionT(E, V0, L) {
  /* Jika energi ≥ barrier: partikel pasti menembus */
  if (E >= V0) return 1;

  const k  = kappa(E, V0);
  const sh = Math.sinh(k * L);
  return 1 / (1 + (V0 * V0 * sh * sh) / (4 * E * (V0 - E)));
}

/**
 * Koefisien refleksi R.
 *
 * @param {number} E  - energi partikel
 * @param {number} V0 - tinggi barrier
 * @param {number} L  - lebar barrier
 * @returns {number} R ∈ [0, 1]
 */
function reflectionR(E, V0, L) {
  return 1 - transmissionT(E, V0, L);
}

/**
 * Fungsi gelombang ψ(x) — perilaku gelombang di 3 region:
 *
 *   Region I   (x < 0) : gelombang datang + pantul (osilasi)
 *   Region II  (0 ≤ x ≤ L) : peluruhan eksponensial di dalam barrier
 *   Region III (x > L) : gelombang tertransmisi (osilasi)
 *
 * @param {number}   E     - energi partikel
 * @param {number}   V0    - tinggi barrier
 * @param {number}   L     - lebar barrier
 * @param {number[]} xArr  - array posisi x
 * @returns {number[]}
 */
function wavefunction(E, V0, L, xArr) {
  const k   = Math.sqrt(2 * E);          /* bilangan gelombang */
  const kap = kappa(E, V0);              /* koefisien peluruhan */
  const T   = transmissionT(E, V0, L);   /* probabilitas transmisi */
  const sqT = Math.sqrt(T);              /* amplitudo transmisi */
  const sqR = Math.sqrt(1 - T);          /* amplitudo refleksi */

  return xArr.map(x => {
    if (x < 0) {
      /* Region I: superposisi gelombang datang + pantul */
      return Math.cos(k * x) + sqR * Math.cos(-k * x);
    } else if (x <= L) {
      /* Region II: meluruh eksponensial di dalam barrier */
      return Math.exp(-kap * x) * 0.75;
    } else {
      /* Region III: gelombang tertransmisi */
      return sqT * Math.cos(k * (x - L));
    }
  });
}


/* ─────────────────────────────────────────
   5. NAV SCROLL HIGHLIGHT
   Menandai link nav yang aktif berdasarkan
   section yang sedang terlihat di viewport.
───────────────────────────────────────── */
(function initNavHighlight() {
  const sectionIds = ['hero', 'konsep', 'minigame', 'simulator', 'quiz'];

  function update() {
    const y = window.scrollY + 90; /* offset navbar */

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