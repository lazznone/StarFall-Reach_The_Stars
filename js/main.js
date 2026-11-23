// Navigasi, penjaga akses, ikon password, dan latar bintang untuk semua halaman.
(() => {
    const b = document.body,
        R = b.dataset.root || '',
        acc = b.dataset.access || 'public',
        u = Auth.user();
    const go = p => location.replace(R + p);
    if (acc === 'auth' && !u)
        return go('pages/login.html');
    if (acc === 'guest' && u)
        return go('pages/dashboard.html');
    addEventListener('pageshow', e => {
        if (e.persisted)
            location.reload();
    }); // cegah halaman terlindungi dari cache riwayat
    b.classList.add('in');
    const here = location.pathname.split('/').pop() || 'index.html';
    if (b.dataset.nav !== 'off') {
        const L = u ? [
            ['dashboard.html', 'Beranda'],
            ['about.html', 'About'],
            ['how-to-play.html', 'How to Play'],
            ['credits.html', 'Credits']
        ] : [
            ['../index.html', 'Home'],
            ['login.html', 'Login'],
            ['register.html', 'Register']
        ];
        const h = document.createElement('header');
        h.className = 'nav';
        const home = u ? R + 'pages/dashboard.html' : R + 'index.html';
        h.innerHTML = `<a class="logo" href="${home}">STAR<span>FALL</span></a><nav>` + L.map(([p, t]) => {
            const href = p.startsWith('..') ? R + 'index.html' : (R ? R + 'pages/' + p : 'pages/' + p);
            return `<a href="${href}"${here === p.split('/').pop() ? ' class="on"' : ''}>${t}</a>`;
        }).join('') + (u ? '<button id="lo" class="btn sm">Logout</button>' : '') + '</nav>';
        b.prepend(h);
        const lo = document.getElementById('lo');
        if (lo)
            lo.onclick = () => Auth.logout(R);
    }
    const E = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
        X = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 19C5 19 1 12 1 12a18 18 0 0 1 5.1-5.9M9.9 5.1A10 10 0 0 1 12 5c7 0 11 7 11 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/></svg>';
    document.querySelectorAll('.eye').forEach(x => {
        x.innerHTML = E;
        x.setAttribute('aria-pressed', 'false');
        x.onclick = () => {
            const i = x.previousElementSibling,
                s = i.type === 'password';
            i.type = s ? 'text' : 'password';
            x.innerHTML = s ? X : E;
            x.setAttribute('aria-pressed', s);
            x.setAttribute('aria-label', s ? 'Sembunyikan password' : 'Tampilkan password');
        };
    });
    if (b.dataset.bg === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches)
        return;
    const c = document.createElement('canvas');
    c.id = 'bg';
    b.prepend(c);
    const x = c.getContext('2d');
    let S = [],
        w,
        h2;
    const rs = () => {
        w = c.width = innerWidth;
        h2 = c.height = innerHeight;
        S = Array.from({ length: Math.min(120, w * h2 / 9000 | 0) }, () => ({
            x: Math.random() * w,
            y: Math.random() * h2,
            z: Math.random() * 2 + .4,
            p: Math.random() * 6
        }));
    };
    rs();
    addEventListener('resize', rs);
    let l = 0;
    (function f(t) {
        const dt = Math.min(.05, (t - l) / 1000 || 0);
        l = t;
        if (!document.hidden) {
            x.clearRect(0, 0, w, h2);
            for (const s of S) {
                s.y += s.z * 14 * dt;
                if (s.y > h2) {
                    s.y = 0;
                    s.x = Math.random() * w;
                }
                x.globalAlpha = .4 + .6 * Math.abs(Math.sin(t / 900 + s.p));
                x.fillStyle = s.z > 1.6 ? '#5ef0ff' : '#c9d6ff';
                x.fillRect(s.x | 0, s.y | 0, s.z > 1.6 ? 3 : 2, s.z > 1.6 ? 3 : 2);
            }
        }
        requestAnimationFrame(f);
    })(0);
})();
