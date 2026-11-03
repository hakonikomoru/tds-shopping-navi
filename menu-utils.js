// 販売期間は在庫・注文可能時間を表さない。期間不明の品も全件表示に残す。
const Menu = (() => {
  const normalize = value => String(value).normalize('NFKC').toLowerCase().replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
  function periodStatus(item, date = '2026-11-04') {
    const periods = item.periods || [];
    if (!periods.length) return 'unknown';
    const states = periods.map(p => {
      const m = p.text.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日\s*～\s*(?:(\d{4})年(\d{1,2})月(\d{1,2})日)?$/);
      if (!m) return 'unknown';
      const iso = (y, mo, d) => `${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}`;
      const start = iso(m[1],m[2],m[3]), end = m[4] ? iso(m[4],m[5],m[6]) : null;
      return date >= start && (!end || date <= end) ? 'inside' : 'outside';
    });
    return states.includes('inside') ? 'inside' : states.includes('unknown') ? 'unknown' : 'outside';
  }
  function matches(item, category, query, periodOnly) {
    if (periodOnly && periodStatus(item) === 'outside') return false;
    const haystack = normalize([item.name, category, ...item.prices].join(' '));
    return normalize(query).trim().split(/\s+/).every(word => haystack.includes(word));
  }
  return {periodStatus, matches};
})();
