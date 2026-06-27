bash

cat > /tmp/part3.js << 'EOF'
const SKILLS=[
  {name:'PULSE', icon:'⚡',cd:3, dm:1.8,gm:3.2,desc:'Hızlı enerji atışı.'},
  {name:'VORTEX',icon:'🌀',cd:7, dm:2.4,gm:4.2,desc:'Tüm düşmanlara girdap.'},
  {name:'NOVA',  icon:'💥',cd:13,dm:3.5,gm:6.0,desc:'Devasa patlama dalgası.'},
  {name:'ULTI',  icon:'🔮',cd:28,dm:6.0,gm:10.0,desc:'Gerçekliği parçalar.'},
];
const ABILITIES=[
  {id:'turret',  name:'Oto-Top',           rarReq:'bronze',   lvlReq:1,  cost:200,   eff:'auto_dmg',  val:0.10,icon:'🔰',desc:'Auto saldırı +%10',         label:'ATK +%10'},
  {id:'odrive',  name:'Aşırı İtim',        rarReq:'silver',   lvlReq:5,  cost:600,   eff:'spd_boost', val:0.15,icon:'💨',desc:'Saldırı hızı +%15',         label:'SPD +%15'},
  {id:'crit_s',  name:'Kritik Gözetleme',  rarReq:'silver',   lvlReq:8,  cost:900,   eff:'crit_boost',val:5,   icon:'🎯',desc:'Kritik şansı +5',           label:'CRIT +5'},
  {id:'qlens',   name:'Kuantum Merceği',   rarReq:'gold',     lvlReq:12, cost:2000,  eff:'atk_pct',   val:0.20,icon:'🔭',desc:'Tüm hasar +%20',            label:'ALL DMG +%20'},
  {id:'snova',   name:'Kalkan Novas',       rarReq:'gold',     lvlReq:15, cost:3000,  eff:'def_boost', val:25,  icon:'🌐',desc:'Savunma +25',               label:'DEF +25'},
  {id:'vtap',    name:'Void Kanalı',        rarReq:'platinum', lvlReq:20, cost:8000,  eff:'ess_gain',  val:2,   icon:'🌀',desc:'Öz kazanım x2',             label:'ÖZ x2'},
  {id:'mlaser',  name:'Erime Lazeri',       rarReq:'platinum', lvlReq:25, cost:12000, eff:'atk_flat',  val:500, icon:'🔥',desc:'Sabit ATK +500',            label:'ATK +500'},
  {id:'pdash',   name:'Faz Koşusu',         rarReq:'diamond',  lvlReq:35, cost:50000, eff:'spd_flat',  val:0.5, icon:'⚡',desc:'Hız +0.5/s',               label:'SPD +0.5'},
  {id:'dark_m',  name:'Karanlık Madde',     rarReq:'diamond',  lvlReq:40, cost:80000, eff:'all_pct',   val:0.35,icon:'🌑',desc:'Tüm istatistikler +%35',   label:'ALL +%35'},
  {id:'rad_c',   name:'Radyanium Çekirdeği',rarReq:'radianium',lvlReq:55,cost:500000, eff:'double_atk',val:1,   icon:'☢️',desc:'Çift vuruş',               label:'DOUBLE HIT'},
  {id:'ggod',    name:'Glitch Tanrısı',     rarReq:'glitchanium',lvlReq:80,cost:5e6,  eff:'godmode',   val:1,   icon:'👾',desc:'Hasar milyonlarla çarpılır',label:'GOD MODE'},
];
function highRi(eq){const ri=Object.values(eq).filter(Boolean).map(i=>RARS.indexOf(i.rar));return ri.length?Math.max(...ri):-1;}
const PASSIVE=[
  {id:'atk',name:'Saldırı',icon:'⚔️',nodes:[
    {nm:'Temel Ateş',   sk:'atk', base:5,  per:3,   cc:[1,3,8,20,50,120,300]},
    {nm:'Kritik Fırtına',sk:'crit',base:2, per:1.5, cc:[2,5,12,30,75,180,450]},
  ]},
  {id:'def',name:'Savunma',icon:'🛡️',nodes:[
    {nm:'Zırh Takviye', sk:'def', base:4,  per:2.5, cc:[1,3,8,20,50,120,300]},
    {nm:'Can Yenile',   sk:'hp',  base:20, per:15,  cc:[2,5,12,30,75,180,450]},
  ]},
  {id:'spd',name:'Hız',icon:'💨',nodes:[
    {nm:'Reaktif Motor',sk:'spd', base:0.05,per:0.03,cc:[1,3,8,20,50,120,300]},
    {nm:'Şans Avcısı',  sk:'lck', base:1,  per:0.8, cc:[2,5,12,30,75,180,450]},
  ]},
];
const SP_BOSSES=[
  {id:0,name:'PRIME ANOMALİ',  req:1,  hp:5000,    dmg:50,    rw:{gold:500,  gqt:0,  boxes:5,  rar:'silver'}},
  {id:1,name:'VOID EMPEROR',   req:5,  hp:80000,   dmg:800,   rw:{gold:3000, gqt:10, boxes:10, rar:'gold'}},
  {id:2,name:'NEXUS OVERLORD', req:10, hp:2000000, dmg:15000, rw:{gold:20000,gqt:50, boxes:20, rar:'platinum'}},
  {id:3,name:'GLITCH TITAN',   req:20, hp:5e7,     dmg:200000,rw:{gold:1e5,  gqt:200,boxes:50, rar:'diamond'}},
  {id:4,name:'RADİANT YIKICI', req:35, hp:2e9,     dmg:5e6,   rw:{gold:5e5, gqt:1000,boxes:100,rar:'radianium'}},
  {id:5,name:'GLİTCHANİUM TANRI',req:55,hp:1e12,  dmg:5e8,   rw:{gold:5e6, gqt:5000,boxes:300,rar:'glitchanium'}},
];
const MKT=[
  {id:'l100',name:'100 GQT Yükle',icon:'💠',desc:'100 GQT token eklenir (simülasyon).',realMoney:true,realAmt:100},
  {id:'l500',name:'500 GQT Yükle',icon:'💠',desc:'500 GQT token eklenir (simülasyon).',realMoney:true,realAmt:500},
  {id:'qbg', name:'Quantum Box x10',icon:'📦',desc:'GQT ile. Günde 999 limit.',gqtP:50, goldP:0, gqtL:999,goldL:0, eff:'boxes',amt:10},
  {id:'qbgd',name:'Quantum Box x1', icon:'📦',desc:'Gold ile. Günde 100 limit.',gqtP:0,  goldP:200,gqtL:0,goldL:100,eff:'boxes',amt:1},
  {id:'pcg', name:'Pasif Kristal x100',icon:'💎',desc:'GQT ile.',gqtP:100,goldP:0,gqtL:9999,goldL:0,eff:'pcryst',amt:100},
  {id:'pcgd',name:'Pasif Kristal x1', icon:'💎',desc:'Gold ile. Günde 10 limit.',gqtP:0,goldP:500,gqtL:0,goldL:10,eff:'pcryst',amt:1},
  {id:'spg', name:'Hızlandırıcı x10',icon:'⚡',desc:'Her biri -30dk. GQT ile.',gqtP:80,goldP:0,gqtL:9999,goldL:0,eff:'speedup',amt:10},
  {id:'spgd',name:'Hızlandırıcı x1', icon:'⚡',desc:'Gold ile. Günde 2 limit.',gqtP:0,goldP:1000,gqtL:0,goldL:2,eff:'speedup',amt:1},
];
const UPTIMES=[30,60,240,480,1800,3600,14400,28800,86400,172800,345600,604800,1209600,1814400];
function upTime(sl){return UPTIMES[Math.min(sl-1,UPTIMES.length-1)];}
function essCost(sl){return Math.ceil(50*Math.pow(1.8,sl-1));}
const ETYPES=[
  {name:'Anomali', col:'#ff3355',xm:1, gm:1,  em:0.2},
  {name:'Glitchör',col:'#ff00aa',xm:2, gm:2,  em:0.5},
  {name:'Voidar',  col:'#aa44ff',xm:4, gm:4,  em:1},
  {name:'Nexus',   col:'#ffd700',xm:10,gm:10, em:3},
];
const AFFIXES=['+5% Crit','+HP/öldürme','+ATK %8','Güç+','Şans+','+GQT %15','Yavaşlatma','Savunma+'];
function waveBossStats(wave,sl){
  const sc=Math.pow(1.18,wave-1)*Math.pow(1.28,sl-1)*6;
  return{name:`WAVE ${wave} BOSS`,col:'#ffd700',isBoss:true,
    hp:Math.ceil(500*sc),maxHp:Math.ceil(500*sc),
    dmg:Math.ceil(20*Math.pow(1.12,wave-1)*Math.pow(1.2,sl-1)),
    xp:Math.ceil(200*sc),gold:Math.ceil(100*Math.pow(1.08,wave-1)),
    ess:Math.ceil(15*Math.pow(1.05,wave-1))};
}
function mkEnemy(wave,sl){
  const ti=Math.min(Math.floor((wave-1)/3),ETYPES.length-1);
  const et=ETYPES[Math.floor(Math.random()*(ti+1))];
  const sc=Math.pow(1.18,wave-1)*Math.pow(1.28,sl-1);
  return{name:et.name,col:et.col,isBoss:false,
    hp:Math.ceil(20*sc),maxHp:Math.ceil(20*sc),
    dmg:Math.ceil(3*Math.pow(1.1,wave-1)*Math.pow(1.18,sl-1)),
    xp:Math.ceil(5*et.xm*sc),gold:Math.ceil(2*et.gm*Math.pow(1.05,wave-1)),
    ess:Math.ceil(et.em*Math.pow(1.03,wave-1)),
    x:0,y:0,stopX:0,spd:50+rnd(0,35),shootT:rnd(.8,2),hitFlash:0,dead:false};
}
EOF
echo "Part3 OK: $(wc -c < /tmp/part3.js) bytes"
Output

Part3 OK: 6426 bytes