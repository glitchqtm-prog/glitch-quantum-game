bash

cat > /tmp/part4.js << 'EOF'
const SKEY='gqv4';
let gs;
function defState(){
  return{charLvl:1,charXp:0,charXpNext:100,shipLvl:1,essence:0,essenceMax:100,
    upgrading:false,upgradeEnd:null,hp:100,maxHp:100,gqtE:0,maxGqtE:100,
    stats:{str:10,agi:10,int:10,lck:5},kills:0,gqt:50,gold:0,pCrystals:0,speedups:0,
    wave:1,subWave:1,boxes:10,
    equipped:{weapon:null,hull:null,engine:null,shield:null,reactor:null,sensor:null,armor:null},
    bag:new Array(20).fill(null),
    glitchSkills:[],skillCDs:[0,0,0,0],
    passive:{atk:[0,0],def:[0,0],spd:[0,0]},
    abilities:[],abilityBonuses:{},
    lastDaily:null,marketDaily:{},bossBeaten:[],
    autoSettings:{autoOpen:false,autoEquip:false,autoSell:false,autoSellBag:false},
    lastOnline:Date.now()};
}
function save(){try{localStorage.setItem(SKEY,btoa(JSON.stringify(gs)));}catch(e){}}
function load(){
  try{const r=localStorage.getItem(SKEY);if(r){gs=JSON.parse(atob(r));mig();return;}}catch(e){}
  gs=defState();
}
function mig(){
  const d=defState();
  ['equipped','bag','passive','marketDaily','abilities','abilityBonuses','autoSettings','bossBeaten'].forEach(k=>{if(!gs[k])gs[k]=d[k];});
  if(!gs.bossBeaten)gs.bossBeaten=[];
  if(!gs.autoSettings)gs.autoSettings=d.autoSettings;
  if(gs.boxes===undefined)gs.boxes=10;
  if(!gs.glitchSkills)gs.glitchSkills=[];
  if(!gs.skillCDs)gs.skillCDs=[0,0,0,0];
  if(gs.subWave===undefined)gs.subWave=1;
  if(!gs.abilityBonuses)gs.abilityBonuses={};
}
function checkDaily(){
  const today=new Date().toDateString();
  if(gs.lastDaily!==today){gs.lastDaily=today;gs.marketDaily={};gs.boxes+=100;addLog('🎁 Günlük giriş: +100 Quantum Box!','#ffd700');}
}
function calcIdle(){
  const now=Date.now(),away=Math.min((now-gs.lastOnline)/1000,3600);
  if(away<30)return null;
  const g=Math.floor(away*.2),e=Math.floor(away*.05);
  gs.gold+=g;gs.essence=Math.min(gs.essenceMax,gs.essence+e);
  gs.lastOnline=now;return{gold:g,ess:e,secs:Math.floor(away)};
}
function cStats(){
  const ab=gs.abilityBonuses||{};
  let atk=10+gs.stats.str*1.5,def=3+gs.stats.str*.3,spd=.5+gs.stats.agi*.05,crit=5+gs.stats.lck*.5,maxHp=gs.maxHp,maxGqt=gs.maxGqtE;
  PASSIVE.forEach(br=>{
    br.nodes.forEach((nd,ni)=>{
      const lvl=(gs.passive[br.id]||[])[ni]||0;if(!lvl)return;
      const v=nd.base+nd.per*(lvl-1);
      if(nd.sk==='atk')atk+=v;if(nd.sk==='def')def+=v;if(nd.sk==='spd')spd+=v;
      if(nd.sk==='crit')crit+=v;if(nd.sk==='hp')maxHp+=v;
    });
  });
  Object.values(gs.equipped).forEach(it=>{
    if(!it)return;
    if(it.sk==='atk')atk+=it.sv;if(it.sk==='def'||it.sk==='def2')def+=it.sv;
    if(it.sk==='spd')spd+=it.sv;if(it.sk==='crit')crit+=it.sv;
    if(it.sk==='hp')maxHp+=it.sv;if(it.sk==='gqt_m')maxGqt+=it.sv;
  });
  if(ab.auto_dmg)atk*=(1+ab.auto_dmg);
  if(ab.spd_boost)spd*=(1+ab.spd_boost);
  if(ab.crit_boost)crit+=ab.crit_boost;
  if(ab.atk_pct)atk*=(1+ab.atk_pct);
  if(ab.def_boost)def+=ab.def_boost;
  if(ab.atk_flat)atk+=ab.atk_flat;
  if(ab.spd_flat)spd+=ab.spd_flat;
  if(ab.all_pct){const m=1+ab.all_pct;atk*=m;def*=m;spd*=m;crit*=m;}
  if(ab.godmode)atk*=1e6;
  return{atk,def,spd,crit,maxHp,maxGqt};
}
function mkItem(boost=0){
  const rar=rollRar(gs.charLvl,boost);const ri=RARS.indexOf(rar);
  const stars=Math.floor(rnd(1,6));
  const slotKey=Object.keys(SLOTS)[Math.floor(rnd(0,Object.keys(SLOTS).length))];
  const sv=itemSV(ri,gs.shipLvl,stars);
  const ac=ri>=5?3:ri>=3?2:ri>=2?1:0;
  const afs=[];const pool=[...AFFIXES];
  for(let i=0;i<ac;i++){const ai=Math.floor(rnd(0,pool.length));afs.push(pool.splice(ai,1)[0]);}
  return{slotKey,rar,ri,stars,sk:SLOTS[slotKey].sk,name:`${RLBL[rar]} ${SLOTS[slotKey].label}`,icon:SLOTS[slotKey].icon,sv,afs,sellVal:Math.ceil(RSELL[rar]*Math.pow(gs.shipLvl,.8))};
}

// ENEMIES
let enemies=[],particles=[],projs=[],pProjs=[];
let bgStars=[],bgX=0,lastT=0,aaTimer=0,pyPos=0;
let shipPulse=0,glitchT=0;
let waveActive=false,paused=false,lootQueue=[];
let pendingLoot=null,autoSellTO=null;
let uiTick=0,saveTick=0;
let gc=null,gctx=null,sc=null,sctx=null;
const PX=120;
const CW=()=>gc?gc.width:800;
const CH=()=>gc?gc.height:500;
function initBg(){bgStars=Array.from({length:90},()=>({x:rnd(0,CW()),y:rnd(0,CH()*.88),spd:rnd(.3,1.5),r:rnd(.4,1.8),a:rnd(.3,.9)}));}

function setAuto(key,val){gs.autoSettings[key]=val;save();}

function startWithBox(){
  if(gs.boxes<=0){addLog('📦 Box yok! Marketten al.','#ff3355');return;}
  gs.boxes--;waveActive=true;paused=false;lootQueue=[];
  document.getElementById('idle-sc').style.display='none';
  spawnWave();save();
}
function spawnWave(){
  enemies=[];projs=[];
  const isBW=(gs.subWave===10);
  const cnt=isBW?1:3+Math.min(gs.wave,12);
  for(let i=0;i<cnt;i++){
    const e=isBW?{...waveBossStats(gs.wave,gs.shipLvl)}:mkEnemy(gs.wave,gs.shipLvl);
    e.x=CW()+50+i*75+rnd(0,50);
    e.y=CH()*.10+rnd(0,CH()*.76);
    e.stopX=CW()*(isBW?.65:.70);
    if(!e.shootT)e.shootT=rnd(.8,2);
    enemies.push(e);
  }
  document.getElementById('wb-w').textContent=gs.wave;
  document.getElementById('wb-s').textContent=gs.subWave;
  document.getElementById('wb-k').textContent=cnt+' düşman';
  addLog(`🌊 ${gs.wave}-${gs.subWave}${isBW?' ⭐ BOSS!':''} — ${cnt} düşman`,'#ff00aa');
}
function autoAtk(dt){
  if(paused)return;
  aaTimer-=dt;if(aaTimer>0)return;
  const cs=cStats();aaTimer=1/cs.spd;
  const alive=enemies.filter(e=>!e.dead);if(!alive.length)return;
  const tgt=alive.sort((a,b)=>a.x-b.x)[0];
  const isCrit=rnd(0,100)<cs.crit;
  let dmg=Math.ceil(cs.atk*(isCrit?2:1)*rnd(.88,1.12));
  if(gs.abilityBonuses?.double_atk)dmg*=2;
  const dx=tgt.x-PX,dy=tgt.y-pyPos,dist=Math.sqrt(dx*dx+dy*dy)||1;
  pProjs.push({x:PX+28,y:pyPos,vx:(dx/dist)*440,vy:(dy/dist)*440,dmg,isCrit,life:1.2});
}
function autoSkills(dt){
  if(paused)return;
  SKILLS.forEach((_,i)=>{if(gs.skillCDs[i]<=0&&enemies.filter(e=>!e.dead).length)fireSkill(i);});
}
function fireSkill(i){
  const sk=SKILLS[i];if(gs.skillCDs[i]>0)return;
  gs.skillCDs[i]=sk.cd;
  const isG=gs.glitchSkills.includes(i);const mult=isG?sk.gm:sk.dm;
  const cs=cStats();
  enemies.filter(e=>!e.dead).forEach(e=>{
    let dmg=Math.ceil(cs.atk*mult*rnd(.85,1.3));if(gs.abilityBonuses?.double_atk)dmg*=2;
    hitEnemy(e,dmg,true);
  });
  addLog(`🔥 ${sk.name}${isG?' [G]':''} ×${mult}`,isG?'#ff00aa':'#00f5ff');
  if(i===3||isG)glitchT=.45;
  spawnBurst(i,mult);
}
function useSkill(i){fireSkill(i);}
function hitEnemy(e,dmg,isCrit=false){
  e.hp-=dmg;e.hitFlash=.25;spawnDmgP(e.x,e.y,dmg,isCrit);
  if(e.hp<=0&&!e.dead)killEnemy(e);
}
function killEnemy(e){
  e.dead=true;gs.charXp+=e.xp;gs.gold+=e.gold;
  gs.essence=Math.min(gs.essenceMax,gs.essence+(e.ess||0));gs.kills++;
  spawnDeathP(e.x,e.y,e.col);addLog(`💀 ${e.name} +${fmt(e.xp)}XP +${fmt(e.gold)}💰`,e.col);
  checkCharXp();
  if(enemies.every(e2=>e2.dead))checkWaveEnd();
}
function checkWaveEnd(){
  // Only drop loot when wave fully cleared
  const isBW=(gs.subWave===10);
  const dropChance=isBW?0.9:0.20+gs.stats.lck*.005;
  const numDrops=Math.max(0,Math.ceil(enemies.length*(isBW?1:dropChance)));
  for(let i=0;i<numDrops;i++)lootQueue.push(mkItem(isBW?2:0));
  processLoot();
}
function processLoot(){
  if(lootQueue.length>0){
    pendingLoot=lootQueue.shift();
    if(handleAutoLoot(pendingLoot)){pendingLoot=null;setTimeout(()=>processLoot(),80);return;}
    showLootPop(pendingLoot);paused=true;
    return;
  }
  advanceSubWave();
}
function handleAutoLoot(item){
  const eq=gs.equipped[item.slotKey];
  if(gs.autoSettings.autoEquip&&(!eq||item.sv>eq.sv)){
    if(eq){gs.gold+=eq.sellVal;addLog(`🤖 Old sold: ${eq.name} +${fmt(eq.sellVal)}💰`,RCOL[eq.rar]);}
    gs.equipped[item.slotKey]=item;
    addLog(`🤖 Auto-equipped: ${item.name}`,RCOL[item.rar]);
    renderInv();renderShipPrev();return true;
  }
  if(gs.autoSettings.autoSell&&eq&&item.sv<=eq.sv){
    gs.gold+=item.sellVal;addLog(`🤖 Auto-sold (zayıf): +${fmt(item.sellVal)}💰`,RCOL[item.rar]);return true;
  }
  return false;
}
function startAutoSellTimer(){
  const bar=document.getElementById('as-bar');bar.style.display='block';bar.style.transition='none';bar.style.width='100%';
  setTimeout(()=>{bar.style.transition='width 5s linear';bar.style.width='0%';},50);
  autoSellTO=setTimeout(()=>{if(pendingLoot)lootSell();},5000);
}
function clearAutoTimer(){
  if(autoSellTO){clearTimeout(autoSellTO);autoSellTO=null;}
  const bar=document.getElementById('as-bar');bar.style.display='none';bar.style.transition='';bar.style.width='100%';
}
function advanceSubWave(){
  gs.subWave++;
  if(gs.subWave>10){gs.subWave=1;gs.wave++;}
  document.getElementById('wb-w').textContent=gs.wave;
  document.getElementById('wb-s').textContent=gs.subWave;
  addLog(`✅ Dalga temizlendi! ${gs.wave}-${gs.subWave} hazırlanıyor`,'#00ff88');
  if(gs.autoSettings.autoSellBag)doAutoSellBag();
  if(gs.boxes>0){gs.boxes--;setTimeout(()=>spawnWave(),1200);save();}
  else{
    waveActive=false;enemies=[];projs=[];pProjs=[];
    document.getElementById('idle-sc').style.display='flex';
    document.getElementById('idle-cnt').textContent=gs.boxes;
    addLog('📦 Box bitti. Yeni box açarak devam et.','#ffd700');save();
  }
}
function doAutoSellBag(){
  gs.bag.forEach((it,i)=>{
    if(!it)return;const eq=gs.equipped[it.slotKey];
    if(eq&&it.sv<eq.sv){gs.gold+=it.sellVal;gs.bag[i]=null;addLog(`🤖 Bag sold: ${it.name}`,RCOL[it.rar]);}
  });renderInv();
}
function checkCharXp(){
  while(gs.charXp>=gs.charXpNext){
    gs.charXp-=gs.charXpNext;gs.charLvl++;
    gs.charXpNext=Math.ceil(120*Math.pow(1.3,gs.charLvl-1));
    gs.stats.str++;gs.stats.agi++;gs.stats.int++;
    if(gs.charLvl%5===0)gs.stats.lck++;
    gs.maxHp+=15;gs.hp=gs.maxHp;
    addLog(`✨ KARAKTER Lvl ${gs.charLvl}!`,'#ffd700');
  }
}
function tryShipUpgrade(){
  if(gs.upgrading){openSlvl();return;}
  const cost=essCost(gs.shipLvl);
  if(gs.essence<cost){addLog(`⚠️ Öz yetersiz: ${fmt(cost)} gerekli`,'#ff3355');return;}
  gs.essence-=cost;gs.upgrading=true;
  gs.upgradeEnd=Date.now()+upTime(gs.shipLvl)*1000;
  addLog(`⚙️ Gemi geliştirme başladı! ${fmtD(upTime(gs.shipLvl))}`,'#00f5ff');
  renderShipUpgZ();save();
}
function checkUpgrade(){
  if(!gs.upgrading)return;
  if(Date.now()>=gs.upgradeEnd){
    gs.upgrading=false;gs.upgradeEnd=null;gs.shipLvl++;
    gs.essenceMax=Math.ceil(100*Math.pow(1.6,gs.shipLvl-1));gs.maxGqtE+=10;
    addLog(`🚀 GEMİ SEVİYE ${gs.shipLvl}!`,'#ffd700');
    renderShipUpgZ();renderShipPrev();save();
  }
}
function useSpeed(){
  if(!gs.speedups){addLog('⚠️ Hızlandırıcı yok!','#ff3355');return;}
  if(!gs.upgrading){addLog('Yükseltme aktif değil.','#ff3355');return;}
  gs.speedups--;gs.upgradeEnd=Math.max(Date.now(),gs.upgradeEnd-30*60*1000);
  addLog('⚡ Hızlandırıcı: -30dk!','#ffd700');
  document.getElementById('sl-sp').textContent=gs.speedups;save();
}
function respawn(){
  gs.hp=gs.maxHp;if(gs.subWave>1)gs.subWave--;else if(gs.wave>1){gs.wave--;gs.subWave=10;}
  enemies=[];projs=[];pProjs=[];lootQueue=[];paused=false;clearAutoTimer();
  addLog('💔 Yenildin! Respawn.','#ff3355');
  if(waveActive&&gs.boxes>0){gs.boxes--;setTimeout(()=>spawnWave(),1200);}
  else{waveActive=false;document.getElementById('idle-sc').style.display='flex';}
}
function spawnBurst(i,m){const c=['#00f5ff','#aa44ff','#ff8800','#ff00aa'][i];for(let j=0;j<8;j++){const a=rnd(0,Math.PI*2),s=rnd(60,120);particles.push({x:PX+26,y:pyPos,vx:Math.cos(a)*s,vy:Math.sin(a)*s,txt:'✦',col:c,life:.6,ml:.6,sz:7+m});}}
function spawnDmgP(x,y,d,ic,ip=false){particles.push({x,y:y-16,vx:rnd(-25,25),vy:rnd(-65,-38),txt:(ic?'CRIT! ':'')+fmt(d),col:ip?'#ff3355':ic?'#ffd700':'#00f5ff',life:1.5,ml:1.5,sz:ic?13:10});}
function spawnDeathP(x,y,col){for(let i=0;i<7;i++){const a=(i/7)*Math.PI*2;particles.push({x,y,vx:Math.cos(a)*80,vy:Math.sin(a)*80,txt:'✦',col,life:.7,ml:.7,sz:11});}}
EOF
echo "Part4 OK: $(wc -c < /tmp/part4.js) bytes"
Output

Part4 OK: 11801 bytes
