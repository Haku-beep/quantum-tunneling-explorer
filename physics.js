// ── STARFIELD ANIMATION ──
(function () {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random(),
        speed: Math.random() * 0.008 + 0.002
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.o += s.speed;
            if (s.o > 1) s.o = 0;
            const alpha = Math.abs(Math.sin(s.o * Math.PI));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
})();

// ── MODEL MATEMATIS QUANTUM TUNNELING ──

// Fungsi untuk membuat array angka dari a ke b sebanyak n titik
function linspace(a, b, n) {
    const arr = [];
    const step = (b - a) / (n - 1);
    for (let i = 0; i < n; i++) {
        arr.push(a + i * step);
    }
    return arr;
}

// Koefisien peluruhan kappa
// Menggambarkan seberapa cepat gelombang meluruh di dalam barrier
// Unit alami: hbar = 1, massa m = 1
function kappa(E, V0) {
    return Math.sqrt(2 * Math.abs(V0 - E));
}

// Koefisien transmisi T — formula eksak persamaan Schrodinger
// T = probabilitas partikel berhasil menembus barrier
function transmissionT(E, V0, L) {
    // Jika energi lebih besar dari barrier, pasti tembus
    if (E >= V0) return 1;

    const k = kappa(E, V0);
    const sh = Math.sinh(k * L);
    const T = 1 / (1 + (V0 * V0 * sh * sh) / (4 * E * (V0 - E)));
    return T;
}

// Koefisien refleksi R
// R = probabilitas partikel terpantul kembali
function reflectionR(E, V0, L) {
    return 1 - transmissionT(E, V0, L);
}

// Fungsi gelombang psi(x)
// Menggambarkan perilaku gelombang di 3 region:
// Region I  (x < 0)    : sebelum barrier — gelombang datang + pantul
// Region II (0 <= x <= L) : di dalam barrier — meluruh eksponensial
// Region III (x > L)   : setelah barrier — gelombang tertransmisi
function wavefunction(E, V0, L, xArray) {
    const k   = Math.sqrt(2 * E);        // bilangan gelombang
    const kap = kappa(E, V0);            // koefisien peluruhan
    const T   = transmissionT(E, V0, L); // probabilitas transmisi
    const sqT = Math.sqrt(T);            // amplitudo transmisi
    const sqR = Math.sqrt(1 - T);        // amplitudo refleksi

    return xArray.map(x => {
        if (x < 0) {
            // Region I: osilasi gelombang datang dan pantul
            return Math.cos(k * x) + sqR * Math.cos(-k * x);
        } else if (x <= L) {
            // Region II: peluruhan eksponensial di dalam barrier
            return Math.exp(-kap * x) * 0.7;
        } else {
            // Region III: gelombang tertransmisi di sisi lain
            return sqT * Math.cos(k * (x - L));
        }
    });
}