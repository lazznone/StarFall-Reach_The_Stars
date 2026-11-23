// Autentikasi username saja. Simulasi belajar di browser, BUKAN keamanan produksi.
const Auth = {
    hex: b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join(''),
    async hash(p, salt) {
        const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(p), 'PBKDF2', false, ['deriveBits']);
        return this.hex(await crypto.subtle.deriveBits({
            name: 'PBKDF2',
            salt: new TextEncoder().encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        }, k, 256));
    },
    ok() {
        return !!(window.crypto && crypto.subtle);
    },
    async register(u, p, c) {
        u = u.trim();
        if (!u || !p || !c)
            return {
                ok: false,
                msg: 'Semua kolom wajib diisi.'
            };
        if (!/^[A-Za-z0-9_]{3,16}$/.test(u))
            return {
                ok: false,
                msg: 'Username 3-16 karakter: huruf, angka, atau _.'
            };
        if (p.length < 6)
            return {
                ok: false,
                msg: 'Password minimal 6 karakter.'
            };
        if (p !== c)
            return {
                ok: false,
                msg: 'Konfirmasi password tidak sama.'
            };
        if (!this.ok())
            return {
                ok: false,
                msg: 'Web Crypto tidak tersedia. Buka lewat HTTPS atau localhost.'
            };
        const a = SF.accounts();
        if (a.some(x => x.username.toLowerCase() === u.toLowerCase()))
            return {
                ok: false,
                msg: 'Username sudah dipakai.'
            };
        const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const salt = this.hex(crypto.getRandomValues(new Uint8Array(16)));
        a.push({
            id,
            username: u,
            salt,
            hash: await this.hash(p, salt),
            created: Date.now()
        });
        return SF.write(SF.K.acc, a) ? {
            ok: true,
            msg: 'Registrasi berhasil! Mengalihkan ke Login...'
        } : {
            ok: false,
            msg: 'LocalStorage tidak tersedia.'
        };
    },
    async login(u, p) {
        u = u.trim().toLowerCase();
        if (!u || !p)
            return {
                ok: false,
                msg: 'Isi username dan password.'
            };
        if (!this.ok())
            return {
                ok: false,
                msg: 'Web Crypto tidak tersedia. Buka lewat HTTPS atau localhost.'
            };
        const a = SF.accounts().find(x => x.username.toLowerCase() === u);
        if (a && !a.salt)
            return {
                ok: false,
                msg: 'Akun versi lama tidak kompatibel. Silakan daftar ulang.'
            };
        if (!a || a.hash !== await this.hash(p, a.salt))
            return {
                ok: false,
                msg: 'Username atau password salah.'
            };
        return SF.write(SF.K.ses, { id: a.id }) ? {
            ok: true,
            msg: 'Login berhasil!'
        } : {
            ok: false,
            msg: 'LocalStorage tidak tersedia.'
        };
    },
    user() {
        const s = SF.read(SF.K.ses, null);
        return s ? SF.accounts().find(a => a.id === s.id) || null : null;
    },
    logout(root) {
        try {
            localStorage.removeItem(SF.K.ses);
        }
        catch (e) { }
        location.replace((root || '../') + 'index.html');
    }
};
function bindForm(fid, fn, next) {
    const f = document.getElementById(fid);
    if (!f)
        return;
    const m = document.getElementById('msg');
    f.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const btn = f.querySelector('[type=submit]');
        btn.disabled = true;
        const r = await fn(...Array.from(f.elements).filter(x => x.name).map(x => x.value));
        m.textContent = r.msg;
        m.className = r.ok ? 'ok' : 'err';
        btn.disabled = false;
        if (r.ok) {
            btn.disabled = true;
            setTimeout(() => location.href = next, 700);
        }
    });
}
bindForm('regForm', Auth.register.bind(Auth), 'login.html');
bindForm('loginForm', Auth.login.bind(Auth), 'dashboard.html');
