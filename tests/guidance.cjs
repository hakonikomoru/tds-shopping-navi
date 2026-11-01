const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = process.argv[2] || require('node:path').join(__dirname, '..', 'index.html');
const html = fs.readFileSync(path, 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ctx = vm.createContext({localStorage:{getItem:()=>null,setItem(){}},document:{addEventListener(){}},location:{hash:''}});
vm.runInContext(script.replace(/show\(VIEWS\[hash\][^\n]+/, ''), ctx);
const run = expr => vm.runInContext(expr, ctx);
assert.equal(run('TOTAL'),18,'購入予定数を維持');
for(const k of ['charm','figure','mug','cap']) {
  assert.match(run(`cardHTML('${k}')`),/アプリ必要：入店パス/,'ショップは入店パスを明示');
  assert.match(run(`cardHTML('${k}')`),/列に注意：入店・レジ/);
}
assert.match(run("cardHTML('badge')"),/店頭の列なし/);
assert.match(run("cardHTML('badge')"),/アプリ限定：配送注文/);
assert.match(run("cardHTML('gummy')"),/アプリ：店舗による/);
assert.match(run("cardHTML('bucket')"),/アプリ不要：直接購入/);
for(const k of ['arendelle','snuggly','lookout']) assert.match(run(`placeHTML('${k}')`),/アプリ必要：モバイル注文/);
for(const k of ['zambini','refrescos','nydeli','hudson','bayside','yucatan','casbah','sebastian']) assert.match(run(`placeHTML('${k}')`),/アプリ任意：モバイル注文可/);
for(const k of ['portofino','biscotti','liberty','horizon','vulcania','pcDock','pcLido','pcLiberty','pcSoaring','pcHorizon','pcTink']) assert.match(run(`placeHTML('${k}')`),/アプリ不要：店頭注文/);
assert.equal(run("Object.keys(ITEMS).filter(k => matchesNeed(k,'queue')).length"),8);
assert.equal(run("Object.keys(ITEMS).filter(k => matchesNeed(k,'app')).length"),6);
assert.equal(run("Object.keys(ITEMS).filter(k => matchesNeed(k,'noapp')).length"),4);
assert.equal(run("matchesNeed('gummy','app') && matchesNeed('gummy','noapp')"),true,'店舗による品は両方で見つかる');
assert.equal(run("matchesNeed('badge','queue')"),false);
assert.match(run('VIEWS.rules()'),/2026年11月2日/);
assert.match(run('VIEWS.how()'),/モバイルオーダー/);
console.log('PASS: 商品9区分・店舗25か所の案内、条件フィルター、数量18個');
