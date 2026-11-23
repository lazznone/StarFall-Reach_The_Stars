// Penyimpanan terpusat (LocalStorage). Simulasi belajar, bukan keamanan produksi.
const SF = {
    K: {
        acc: 'sf_accounts',
        ses: 'sf_session',
        st: 'sf_stats',
        board: 'sf_board',
        set: 'sf_settings'
    },
    read(k, d) {
        try {
            const v = localStorage.getItem(k);
            return v ? JSON.parse(v) : d;
        }
        catch (e) {
            return d;
        }
    },
    write(k, v) {
        try {
            localStorage.setItem(k, JSON.stringify(v));
            return true;
        }
        catch (e) {
            return false;
        }
    },
    accounts() {
        const a = this.read(this.K.acc, []);
        return Array.isArray(a) ? a : [];
    },
    stats(id) {
        const all = this.read(this.K.st, {});
        const s = (all && all[id]) || {};
        return {
            high: +s.high || 0,
            bestTime: +s.bestTime || 0,
            games: +s.games || 0,
            kills: +s.kills || 0
        };
    },
    saveRun(id, name, score, time, kills) {
        const all = this.read(this.K.st, {}) || {};
        const s = this.stats(id);
        s.games++;
        s.kills += kills;
        s.high = Math.max(s.high, score);
        s.bestTime = Math.max(s.bestTime, time);
        all[id] = s;
        this.write(this.K.st, all);
        let b = this.read(this.K.board, []);
        if (!Array.isArray(b))
            b = [];
        b.push({
            name,
            score,
            time
        });
        b.sort((x, y) => y.score - x.score);
        this.write(this.K.board, b.slice(0, 10));
        return s;
    },
    board() {
        const b = this.read(this.K.board, []);
        return Array.isArray(b) ? b : [];
    },
    fmt(t) {
        t = Math.floor(t);
        return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
    }
};
