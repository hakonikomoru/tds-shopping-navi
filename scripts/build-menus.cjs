// DOMから収集した全件記録と画像台帳から、ビルド不要のブラウザ用データを作る。
const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'data/menu-sources/2026-11-03.json'),'utf8'));
const images=JSON.parse(fs.readFileSync(path.join(root,'data/menu-sources/images-2026-11-03.json'),'utf8'));
const byUrl=new Map(images.map(i=>[i.url,i]));
for(const [key,r] of Object.entries(raw)){
 const items=r.sections.flatMap(s=>s.items);
 assert.equal(items.length,r.observedCards+r.observedDrinkRows,key+' coverage');
 for(const i of items){
  assert.ok(i.name && i.prices.length,key+' name/price');
  if(i.image){const image=byUrl.get(i.image); assert.ok(image,key+' image');i.imageSource=i.image;i.image='img/menu/'+image.filename;assert.ok(fs.existsSync(path.join(root,i.image)));}
 }
}
const data={checkedOn:'2026-11-03',visitDate:'2026-11-04',restaurants:raw};
fs.writeFileSync(path.join(root,'data/menus.js'),'// 公式メニューの取得記録から生成。更新手順はREADME参照。\nconst MENU_DATA = '+JSON.stringify(data).replace(/</g,'\\u003c')+';\n');
console.log('Built menus for '+Object.keys(raw).length+' restaurants');
