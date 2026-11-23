const user=Auth.user();
const cv=document.getElementById('cv'),ctx=cv.getContext('2d'),W=480,H=720,$=id=>document.getElementById(id);
const TYPES={basic:{s:'e_basic',hp:2,v:90,pts:100,w:54},fast:{s:'e_fast',hp:1,v:190,pts:150,w:48},
 side:{s:'e_side',hp:2,v:80,pts:200,w:58},heavy:{s:'e_heavy',hp:6,v:55,pts:400,w:76,shoot:1}};
let G,keys={},touch=null,last=0,raf=0;
const stars=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*2+.5}));
function reset(){G={on:true,paused:false,t:0,score:0,kills:0,hp:100,inv:0,fire:0,shield:0,rapid:0,boss:null,nb:60,bk:0,spawn:1,ast:3,
 p:{x:W/2,y:H-90},bl:[],en:[],eb:[],as:[],pu:[],fx:[]};
 $('over').style.display=$('pause').style.display='none';$('pb').disabled=false}
const hit=(a,b,r)=>Math.hypot(a.x-b.x,a.y-b.y)<r;
function spawn(){const t=G.t,k=['basic'];if(t>12)k.push('fast');if(t>25)k.push('side');if(t>45)k.push('heavy');
 const n=k[Math.random()*k.length|0],d=TYPES[n];
 G.en.push({n,d,x:40+Math.random()*(W-80),y:-40,hp:d.hp,x0:0,ph:Math.random()*6,sh:2})}
function boom(x,y,s){G.fx.push({x,y,s,a:0})}
function damage(n){if(G.inv>0||G.shield>0)return;G.hp-=n;G.inv=1;boom(G.p.x,G.p.y,40);if(G.hp<=0)end()}
function update(dt){
 G.t+=dt;const p=G.p,sp=300,L=1+G.t/120;
 let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);
 if(touch){p.x+=(touch.x-p.x)*Math.min(1,dt*14);p.y+=(touch.y-60-p.y)*Math.min(1,dt*14)}
 p.x=Math.max(30,Math.min(W-30,p.x+dx*sp*dt));p.y=Math.max(40,Math.min(H-40,p.y+dy*sp*dt));
 G.inv-=dt;G.fire-=dt;G.shield-=dt;G.rapid-=dt;
 if((keys[' ']||touch)&&G.fire<=0){G.fire=G.rapid>0?.09:.2;G.bl.push({x:p.x,y:p.y-30})}
 G.bl.forEach(b=>b.y-=640*dt);
 G.spawn-=dt;if(G.spawn<=0){spawn();G.spawn=Math.max(.45,1.4-G.t*.01)*(G.boss?2:1)}
 G.ast-=dt;if(G.ast<=0){G.as.push({x:Math.random()*W,y:-40,r:20+Math.random()*14,v:90+Math.random()*80,sp:Math.random()*6|0,hp:3});G.ast=Math.max(1.5,3-G.t*.01)}
 for(const e of G.en){e.y+=e.d.v*L*dt;if(e.n==='side')e.x+=Math.sin(G.t*2+e.ph)*120*dt;
  if(e.d.shoot){e.sh-=dt;if(e.sh<=0){e.sh=1.8;G.eb.push({x:e.x,y:e.y+30})}}
  if(hit(e,p,e.d.w*.5+14)){e.hp=0;damage(25)}}
 G.eb.forEach(b=>{b.x+=(b.vx||0)*dt;b.y+=260*dt;if(hit(b,p,18)){b.y=H+99;damage(15)}});
 for(const a of G.as){a.y+=a.v*dt;if(hit(a,p,a.r+12)){a.hp=0;damage(20)}}
 for(const b of G.bl){for(const e of G.en)if(e.hp>0&&hit(b,e,e.d.w*.5)){e.hp--;b.y=-99;boom(b.x,b.y+10,14)}
  for(const a of G.as)if(a.hp>0&&hit(b,a,a.r)){a.hp--;b.y=-99}}
 for(const e of G.en)if(e.hp<=0){G.score+=e.d.pts;G.kills++;boom(e.x,e.y,e.d.w);if(Math.random()<.12)G.pu.push({x:e.x,y:e.y,k:'hsr'[Math.random()*3|0]})}
 for(const a of G.as)if(a.hp<=0){G.score+=50;boom(a.x,a.y,a.r*2)}
 for(const q of G.pu){q.y+=80*dt;if(hit(q,p,28)){q.y=H+99;if(q.k==='h')G.hp=Math.min(100,G.hp+25);else if(q.k==='s')G.shield=6;else G.rapid=8}}
 if(!G.boss&&G.t>=G.nb){const m=60+G.bk*30;G.boss={x:W/2,y:-120,hp:m,m,t:0,sh:1.5}}
 const B=G.boss;
 if(B){B.t+=dt;B.y=Math.min(120,B.y+60*dt);B.x=W/2+Math.sin(B.t*.8)*140;B.sh-=dt;
  if(B.sh<=0){B.sh=1.3;const n=B.hp<B.m/2?7:5;for(let i=0;i<n;i++){const a=Math.PI/2+(i-(n-1)/2)*.28;G.eb.push({x:B.x,y:B.y+90,vx:Math.cos(a)*260})}}
  for(const b of G.bl)if(hit(b,B,90)){B.hp--;b.y=-99;boom(b.x,b.y+10,16)}
  if(hit(B,p,100))damage(30);
  if(B.hp<=0){G.score+=2000;G.kills++;boom(B.x,B.y,220);boom(B.x-60,B.y+30,120);boom(B.x+60,B.y-20,120);G.pu.push({x:B.x,y:B.y,k:'s'});G.boss=null;G.nb=G.t+60;G.bk++}}
 G.bl=G.bl.filter(b=>b.y>-40);G.en=G.en.filter(e=>e.hp>0&&e.y<H+60);G.eb=G.eb.filter(b=>b.y<H+40);
 G.as=G.as.filter(a=>a.hp>0&&a.y<H+60);G.pu=G.pu.filter(q=>q.y<H+40);
 G.fx.forEach(f=>f.a+=dt*9);G.fx=G.fx.filter(f=>f.a<6);
 for(const s of stars){s.y+=s.z*40*dt;if(s.y>H){s.y=0;s.x=Math.random()*W}}
 $('sc').textContent=G.score;$('tm').textContent=SF.fmt(G.t);$('hpf').style.width=Math.max(0,G.hp)+'%'}
function draw(){
 ctx.imageSmoothingEnabled=false;ctx.fillStyle='#05060f';ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#9fe8ff';for(const s of stars)ctx.fillRect(s.x,s.y,s.z>1.5?3:2,s.z>1.5?3:2);
 for(const a of G.as)spr(ctx,ATLAS.ast[a.sp],a.x,a.y,a.r*2.2);
 for(const q of G.pu)spr(ctx,ATLAS[{h:'p_heart',s:'p_shield',r:'p_rapid'}[q.k]],q.x,q.y,34);
 if(G.boss){const B=G.boss;spr(ctx,ATLAS.boss,B.x,B.y,240);ctx.fillStyle='#300';ctx.fillRect(60,8,W-120,10);ctx.fillStyle='#ff3c5c';ctx.fillRect(60,8,(W-120)*Math.max(0,B.hp)/B.m,10)}
 for(const e of G.en)spr(ctx,ATLAS[e.d.s],e.x,e.y,e.d.w,0);
 ctx.globalCompositeOperation='lighter';
 for(const b of G.bl)spr(ctx,ATLAS.b_player,b.x,b.y,12);
 for(const b of G.eb)spr(ctx,ATLAS.b_enemy,b.x,b.y,18,1);
 for(const f of G.fx)spr(ctx,ATLAS.boom[Math.min(5,f.a|0)],f.x,f.y,f.s*1.4);
 ctx.globalCompositeOperation='source-over';
 if(G.hp>0&&(G.inv<=0||(G.t*12|0)%2))spr(ctx,ATLAS.player,G.p.x,G.p.y,56);
 if(G.shield>0){ctx.strokeStyle='#5ef0ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(G.p.x,G.p.y,40,0,7);ctx.stroke()}
 ctx.fillStyle='#fff';ctx.font='14px monospace';if(G.shield>0)ctx.fillText('SHIELD '+G.shield.toFixed(0),8,H-24);if(G.rapid>0)ctx.fillText('RAPID '+G.rapid.toFixed(0),8,H-8)}
function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;
 if(G.on&&!G.paused)update(dt);draw();raf=requestAnimationFrame(loop)}
function end(){G.on=false;const s=SF.saveRun(user.id,user.username,G.score,G.t,G.kills);
 $('fs').textContent=G.score;$('bs').textContent=s.high;$('ft').textContent=SF.fmt(G.t);$('over').style.display='flex';$('pb').disabled=true}
function pause(){if(!G.on)return;G.paused=!G.paused;$('pause').style.display=G.paused?'flex':'none'}
addEventListener('keydown',e=>{if(e.key==='Escape')return pause();keys[e.key.length>1?e.key:e.key.toLowerCase()]=1;if(e.key===' ')e.preventDefault()});
addEventListener('keyup',e=>{keys[e.key.length>1?e.key:e.key.toLowerCase()]=0});
const pt=e=>{const r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}};
cv.addEventListener('pointerdown',e=>{touch=pt(e);cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(touch)touch=pt(e)});
['pointerup','pointercancel'].forEach(n=>cv.addEventListener(n,()=>touch=null));
$('pb').onclick=pause;$('rs').onclick=pause;$('re').onclick=reset;
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.on&&!G.paused)pause()});
if(user){reset();IMG.complete?raf=requestAnimationFrame(loop):IMG.onload=()=>raf=requestAnimationFrame(loop)}
