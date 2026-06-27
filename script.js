bash

cat > /tmp/part2.js << 'EOF'
<script>
const GQ=(()=>{
'use strict';
const fmt=n=>{if(n>=1e12)return(n/1e12).toFixed(1)+'T';if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return Math.floor(n)+''};
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmtD=s=>{if(s<60)return Math.ceil(s)+'s';if(s<3600)return Math.ceil(s/60)+'dk';if(s<86400)return(s/3600).toFixed(1)+'sa';return(s/86400).toFixed(1)+'gün'};

const RARS=['bronze','silver','gold','platinum','diamond','radianium','glitchanium'];
const RLBL={bronze:'BRONZ',silver:'SİLVER',gold:'ALTIN',platinum:'PLATİNYUM',diamond:'DİAMOND',radianium:'RADİANİUM',glitchanium:'GLİTCHANİUM'};
const RCOL={bronze:'#cd7f32',silver:'#c0c0c0',gold:'#ffd700',platinum:'#e5e4e2',diamond:'#a8f0ff',radianium:'#ff88ff',glitchanium:'#cc44ff'};
const RSELL={bronze:5,silver:18,gold:55,platinum:160,diamond:450,radianium:1200,glitchanium:4000};
const RBASE=[8,22,55,140,380,1000,3000];

function lootW(lvl){
  if(lvl<5)  return[90,10,0,0,0,0,0];
  if(lvl<10) return[60,35,5,0,0,0,0];
  if(lvl<20) return[35,45,18,2,0,0,0];
  if(lvl<35) return[15,35,38,10,2,0,0];
  if(lvl<55) return[5,18,42,24,9,2,0];
  if(lvl<80) return[1,6,28,36,22,6,1];
  return[0,1,10,22,35,24,8];
}
function rollRar(lvl,boost=0){
  const w=lootW(lvl).map((v,i)=>Math.max(0,v+(i>=2?boost:-boost/3)));
  const t=w.reduce((a,b)=>a+b,0);let r=Math.random()*t;
  for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return RARS[i];}
  return 'bronze';
}

const SLOTS={
  weapon:{label:'Lazer Silahı',icon:'🔫',sk:'atk',  part:'cannon'},
  hull:  {label:'Gemi Gövdesi',icon:'🛡️',sk:'hp',   part:'hull'},
  engine:{label:'Motor',       icon:'⚙️',sk:'spd',  part:'engine'},
  shield:{label:'Kalkan',      icon:'🔵',sk:'def',  part:'shield'},
  reactor:{label:'Reaktör',   icon:'⚡',sk:'gqt_m',part:'reactor'},
  sensor:{label:'Sensör',      icon:'📡',sk:'crit', part:'sensor'},
  armor: {label:'Zırh',        icon:'🔩',sk:'def2', part:'armor'},
};
function itemSV(ri,sl,st){return Math.round(RBASE[ri]*Math.pow(sl,1.4)*Math.pow(1.18,st));}

// Pixel ship rarity tints
const RT={
  bronze:   {body:'#3a1a08',bA:'#cd7f32',ck:'#ffbb44',ckG:'#ffeeaa',eg:'#cc5500',grd:'#cd7f32'},
  silver:   {body:'#1a2535',bA:'#c0c0c0',ck:'#ddeeff',ckG:'#ffffff', eg:'#aaaaff',grd:'#c0c0c0'},
  gold:     {body:'#1a1500',bA:'#ffd700',ck:'#ffffaa',ckG:'#ffffee', eg:'#ffaa00',grd:'#ffd700'},
  platinum: {body:'#101820',bA:'#e5e4e2',ck:'#ffffff',ckG:'#ffffff', eg:'#ddddff',grd:'#e5e4e2'},
  diamond:  {body:'#001520',bA:'#a8f0ff',ck:'#ccffff',ckG:'#efffff', eg:'#66aaff',grd:'#a8f0ff'},
  radianium:{body:'#1a0018',bA:'#ff88ff',ck:'#ffccff',ckG:'#ffeeff', eg:'#ff00ff',grd:'#ff88ff'},
  glitchanium:{body:'#0a0012',bA:'#cc44ff',ck:'#ff88ff',ckG:'#ffccff',eg:'#9900ff',grd:'#cc44ff'},
};
function getT(slotKey,equipped){const it=equipped[slotKey];return it?RT[it.rar]:null;}
function TA(slotKey,key,fb,equipped){const t=getT(slotKey,equipped);return(t&&t[key])?t[key]:fb;}

function drawPixelShip(ctx,cx,cy,equipped,pulse,scale=1){
  ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
  const bodyCol =TA('hull','body','#1e2a4a',equipped);
  const bodyAcc =TA('hull','bA','#00f5ff',equipped);
  const gridCol =TA('hull','grd','#00f5ff',equipped);
  const ckCol   =TA('sensor','ck','#00ccff',equipped);
  const ckGlow  =TA('sensor','ckG','#aaeeff',equipped);
  const engGlow =TA('engine','eg','#ff4422',equipped);
  const canCol  =TA('weapon','bA','#00f5ff',equipped);
  const armorCol=TA('armor','body','#162040',equipped);
  const reactCol=TA('reactor','bA','#00f5ff',equipped);

  // ENGINE EXHAUSTS
  const exLen=28+Math.sin(pulse)*8;
  [-11,10].forEach((ey,i)=>{
    const ex=ctx.createLinearGradient(-exLen,0,0,0);
    ex.addColorStop(0,i===0?'#ff442200':'#ff220000');ex.addColorStop(0.3,engGlow+'88');ex.addColorStop(1,engGlow);
    ctx.beginPath();ctx.moveTo(-20,ey-5);ctx.lineTo(-20-exLen,ey);ctx.lineTo(-20,ey+5);ctx.closePath();ctx.fillStyle=ex;ctx.fill();
  });
  // TOP NACELLE
  const eng1=TA('engine','body','#5a3020',equipped);
  ctx.fillStyle=eng1;ctx.beginPath();ctx.roundRect(-22,-16,14,10,3);ctx.fill();
  ctx.fillStyle='#2a1808';ctx.fillRect(-20,-14,10,6);
  for(let r=0;r<3;r++){ctx.strokeStyle='#1a0c04';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-8-r*3,-11,4,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle=engGlow+'cc';ctx.beginPath();ctx.arc(-9,-11,3,0,Math.PI*2);ctx.fill();
  // BOTTOM NACELLE
  ctx.fillStyle=eng1;ctx.beginPath();ctx.roundRect(-22,6,14,10,3);ctx.fill();
  ctx.fillStyle='#2a1808';ctx.fillRect(-20,8,10,6);
  for(let r=0;r<3;r++){ctx.strokeStyle='#1a0c04';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-8-r*3,11,4,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle=engGlow+'cc';ctx.beginPath();ctx.arc(-9,11,3,0,Math.PI*2);ctx.fill();
  // REACTOR CORE
  ctx.fillStyle='#050d1a';ctx.beginPath();ctx.roundRect(-12,-4,8,8,4);ctx.fill();
  ctx.beginPath();ctx.arc(-8,0,3.5,0,Math.PI*2);
  ctx.fillStyle=reactCol;ctx.shadowColor=reactCol;ctx.shadowBlur=6+Math.sin(pulse)*3;ctx.fill();ctx.shadowBlur=0;
  // MAIN BODY
  const bGrad=ctx.createLinearGradient(-18,-18,22,18);bGrad.addColorStop(0,bodyCol);bGrad.addColorStop(.4,bodyAcc+'18');bGrad.addColorStop(1,bodyCol);
  ctx.beginPath();ctx.moveTo(28,0);ctx.bezierCurveTo(24,-7,8,-14,-4,-13);ctx.lineTo(-16,-12);ctx.lineTo(-16,12);ctx.lineTo(-4,13);ctx.bezierCurveTo(8,14,24,7,28,0);ctx.closePath();
  ctx.fillStyle=bGrad;ctx.fill();ctx.strokeStyle=bodyAcc+'55';ctx.lineWidth=1;ctx.stroke();
  // GRID LINES
  ctx.strokeStyle=gridCol+'44';ctx.lineWidth=0.5;
  [-5,0,5].forEach(gy=>{ctx.beginPath();ctx.moveTo(-14,gy);ctx.lineTo(24,gy);ctx.stroke();});
  [-8,0,8,16].forEach(gx=>{ctx.beginPath();ctx.moveTo(gx,-12+Math.abs(gx)*.3);ctx.lineTo(gx,12-Math.abs(gx)*.3);ctx.stroke();});
  ctx.strokeStyle=bodyAcc+'88';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(28,0);ctx.bezierCurveTo(24,-7,8,-14,-4,-13);ctx.stroke();
  ctx.beginPath();ctx.moveTo(28,0);ctx.bezierCurveTo(24,7,8,14,-4,13);ctx.stroke();
  // ARMOR PANELS
  ctx.fillStyle=armorCol;ctx.strokeStyle=TA('armor','bA',bodyAcc,equipped)+'55';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.roundRect(4,-6,10,4,1);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.roundRect(4,2,10,4,1);ctx.fill();ctx.stroke();
  // TOP FIN
  const wGrad=ctx.createLinearGradient(0,-14,0,-28);wGrad.addColorStop(0,armorCol);wGrad.addColorStop(1,armorCol+'88');
  ctx.beginPath();ctx.moveTo(6,-12);ctx.lineTo(4,-26);ctx.lineTo(-2,-24);ctx.lineTo(-10,-12);ctx.closePath();
  ctx.fillStyle=wGrad;ctx.fill();ctx.strokeStyle=TA('armor','bA',bodyAcc,equipped)+'55';ctx.lineWidth=0.6;ctx.stroke();
  ctx.strokeStyle=gridCol+'33';ctx.lineWidth=0.4;
  [[4,-14,-1,-13],[2,-18,-2,-17],[0,-22,-2,-21]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  // BOTTOM FIN
  ctx.beginPath();ctx.moveTo(6,12);ctx.lineTo(4,26);ctx.lineTo(-2,24);ctx.lineTo(-10,12);ctx.closePath();
  ctx.fillStyle=wGrad;ctx.fill();ctx.strokeStyle=TA('armor','bA',bodyAcc,equipped)+'55';ctx.lineWidth=0.6;ctx.stroke();
  ctx.strokeStyle=gridCol+'33';ctx.lineWidth=0.4;
  [[4,14,-1,13],[2,18,-2,17],[0,22,-2,21]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  // DOME COCKPIT
  ctx.strokeStyle=gridCol+'66';ctx.lineWidth=0.8;
  for(let a=0;a<6;a++){const ang=(a/6)*Math.PI*2;ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(6+Math.cos(ang)*8,Math.sin(ang)*6);ctx.stroke();}
  const dGrad=ctx.createRadialGradient(6,-1,1,6,-1,8);
  dGrad.addColorStop(0,ckGlow);dGrad.addColorStop(0.5,ckCol+'cc');dGrad.addColorStop(1,ckCol+'44');
  ctx.beginPath();ctx.ellipse(6,-.5,8.5,6,0,0,Math.PI*2);
  ctx.fillStyle=dGrad;ctx.shadowColor=ckCol;ctx.shadowBlur=8+Math.sin(pulse)*4;ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle=ckCol+'aa';ctx.lineWidth=0.8;ctx.beginPath();ctx.ellipse(6,-.5,8.5,6,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(4,-2,4,2,-.4,0,Math.PI*2);ctx.fillStyle='rgba(220,250,255,0.5)';ctx.fill();
  // UPPER CANNON
  ctx.fillStyle='#0a1828';ctx.strokeStyle=gridCol+'44';ctx.lineWidth=0.6;
  ctx.beginPath();ctx.roundRect(8,-15,12,4,2);ctx.fill();ctx.stroke();
  ctx.fillStyle=canCol+'88';ctx.beginPath();ctx.rect(14,-14,10,2);ctx.fill();
  ctx.fillStyle=canCol+'66';ctx.beginPath();ctx.rect(10,-9,8,1.5);ctx.fill();
  ctx.beginPath();ctx.arc(24,-13,2,0,Math.PI*2);
  ctx.fillStyle=canCol;ctx.shadowColor=canCol;ctx.shadowBlur=5+Math.sin(pulse)*2;ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#0a1828';ctx.beginPath();ctx.roundRect(8,11,10,3,1.5);ctx.fill();
  ctx.fillStyle=canCol+'66';ctx.beginPath();ctx.rect(12,12,8,1.5);ctx.fill();
  // SHIELD RING
  const shIt=equipped.shield;
  if(shIt){
    const shC=RCOL[shIt.rar];
    ctx.beginPath();ctx.ellipse(4,0,36,26,0,0,Math.PI*2);ctx.strokeStyle=shC+'44';ctx.lineWidth=1.5+Math.sin(pulse);ctx.stroke();
    ctx.beginPath();ctx.ellipse(4,0,36,26,0,0,Math.PI*2);ctx.strokeStyle=shC+'22';ctx.lineWidth=3+Math.sin(pulse)*1.5;ctx.stroke();
  }
  // RUNNING LIGHTS
  [[22,-2,'#00ff88'],[22,2,'#ff3355'],[-18,-10,'#aa44ff'],[-18,10,'#aa44ff']].forEach(([lx,ly,lc])=>{
    ctx.beginPath();ctx.arc(lx,ly,1.5,0,Math.PI*2);ctx.fillStyle=lc;ctx.shadowColor=lc;ctx.shadowBlur=4+Math.sin(pulse)*2;ctx.fill();ctx.shadowBlur=0;
  });
  ctx.restore();
}
EOF
echo "Part2 OK: $(wc -c < /tmp/part2.js) bytes"
Output

Part2 OK: 9350 bytes