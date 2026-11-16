/* DZC-81 · Prosedürel veri portresi
   Her kimlik kodundan (seed) tekrar etmeyen, monokrom bir vesikalık üretir. */
(function(){
'use strict';
const FEMALE=new Set(['MÜNTEHA','SERRA','DEFNE','MERVE','ELİF','İLKİM','SELİN','ZEYNEP','AYLİN','NAZ','ECE','DERİN']);
const cache=new Map();

function hashStr(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const g=v=>{v=Math.max(0,Math.min(255,Math.round(v)));return 'rgb('+v+','+v+','+v+')';};

function draw(sub){
  const W=300,H=345,cx=150;
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;
  const x=cv.getContext('2d');
  const r=rng(hashStr(sub.id||sub.name));
  const first=(sub.given||sub.name||'').split(' ')[0];
  const fem=FEMALE.has(first);

  const skin=118+r()*92;
  const hair=18+r()*70;
  const fw=58+r()*12, fh=78+r()*10, hy=150+r()*8;
  const jacket=26+r()*40;
  const styles=fem?['long','bob','bun','undercut','long']:['crop','buzz','side','crop','mohawk','bald'];
  const style=styles[Math.floor(r()*styles.length)];

  // arka plan
  let gr=x.createRadialGradient(150,120,10,150,150,280);gr.addColorStop(0,g(104));gr.addColorStop(1,g(30));
  x.fillStyle=gr;x.fillRect(0,0,W,H);

  // uzun saç (arka)
  if(style==='long'||style==='bob'){
    const bottom=style==='long'?310:hy+fh*0.95;
    x.fillStyle=g(hair*0.8);x.beginPath();
    x.moveTo(cx-fw*1.2,hy-fh*0.2);
    x.bezierCurveTo(cx-fw*1.45,hy+fh*0.4,cx-fw*1.35,bottom-10,cx-fw*1.1,bottom);
    x.lineTo(cx+fw*1.1,bottom);
    x.bezierCurveTo(cx+fw*1.35,bottom-10,cx+fw*1.45,hy+fh*0.4,cx+fw*1.2,hy-fh*0.2);
    x.closePath();x.fill();
  }

  // omuzlar / ceket
  gr=x.createLinearGradient(0,250,0,H);gr.addColorStop(0,g(jacket+18));gr.addColorStop(1,g(jacket*0.6));
  x.fillStyle=gr;x.beginPath();
  const sy=hy+fh*1.12;x.moveTo(-10,H);x.bezierCurveTo(-4,sy+40,30,sy+6,cx-44,sy);x.lineTo(cx+44,sy);x.bezierCurveTo(270,sy+6,304,sy+40,310,H);x.closePath();x.fill();
  x.strokeStyle='rgba(255,255,255,0.16)';x.lineWidth=2;x.beginPath();x.moveTo(4,sy+60);x.bezierCurveTo(10,sy+20,40,sy+6,cx-44,sy);x.moveTo(296,sy+60);x.bezierCurveTo(290,sy+20,260,sy+6,cx+44,sy);x.stroke();
  // boyun
  gr=x.createLinearGradient(0,hy+fh*0.6,0,270);gr.addColorStop(0,g(skin*0.55));gr.addColorStop(1,g(skin*0.78));
  x.fillStyle=gr;const nw=fem?24:30;x.fillRect(cx-nw,hy+fh*0.55,nw*2,fh*0.7);
  // yaka
  const collar=r();
  x.strokeStyle=g(jacket+40);x.lineWidth=2;
  if(collar<0.5){x.beginPath();x.moveTo(cx-32,sy);x.lineTo(cx-8,H);x.moveTo(cx+32,sy);x.lineTo(cx+8,H);x.stroke();
    x.strokeStyle=g(jacket+70);x.lineWidth=1.5;x.beginPath();x.moveTo(cx,sy+12);x.lineTo(cx,H);x.stroke();}
  else{x.fillStyle=g(jacket+10);x.beginPath();x.moveTo(cx-36,sy-6);x.quadraticCurveTo(cx,sy+10,cx+36,sy-6);x.lineTo(cx+42,sy+22);x.quadraticCurveTo(cx,sy+40,cx-42,sy+22);x.closePath();x.fill();}
  // boyun barkodu
  if(r()<0.25){x.fillStyle=g(skin*0.35);for(let i=0;i<14;i++){const w=r()<.5?1:2;x.fillRect(cx+6+i*2.2,hy+fh*0.95,w,9);}}

  // kulaklar
  x.fillStyle=g(skin*0.82);
  [-1,1].forEach(s=>{x.beginPath();x.ellipse(cx+s*fw*0.98,hy+6,9,17,0,0,Math.PI*2);x.fill();});

  // kafa
  const head=()=>{x.beginPath();x.moveTo(cx,hy-fh);
    x.bezierCurveTo(cx+fw*1.05,hy-fh,cx+fw*1.05,hy+fh*0.3,cx+fw*0.6,hy+fh*0.82);
    x.quadraticCurveTo(cx,hy+fh*1.08,cx-fw*0.6,hy+fh*0.82);
    x.bezierCurveTo(cx-fw*1.05,hy+fh*0.3,cx-fw*1.05,hy-fh,cx,hy-fh);x.closePath();};
  gr=x.createRadialGradient(cx-22,hy-28,8,cx,hy,fh*1.35);gr.addColorStop(0,g(skin*1.12));gr.addColorStop(.6,g(skin*0.9));gr.addColorStop(1,g(skin*0.55));
  head();x.fillStyle=gr;x.fill();
  // çene gölgesi
  x.save();head();x.clip();
  gr=x.createLinearGradient(0,hy+fh*0.4,0,hy+fh*1.05);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,0.28)');x.fillStyle=gr;x.fillRect(0,0,W,H);
  // sakal izi
  if(!fem&&r()<0.55){for(let i=0;i<900;i++){const a=r()*Math.PI,rr=r();const px=cx+Math.cos(a)*fw*0.75*rr,py=hy+fh*0.45+Math.sin(a)*fh*0.5*rr;x.fillStyle='rgba(0,0,0,'+(0.08+r()*0.12)+')';x.fillRect(px,py,1.2,1.2);}}
  x.restore();

  // yüz hatları
  const ey=hy+fh*0.02,edx=fw*0.42;
  [-1,1].forEach(s=>{const ex=cx+s*edx;
    gr=x.createRadialGradient(ex,ey,2,ex,ey,22);gr.addColorStop(0,'rgba(0,0,0,0.28)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.beginPath();x.ellipse(ex,ey,22,14,0,0,Math.PI*2);x.fill();
    x.fillStyle=g(Math.min(215,skin*1.25));x.beginPath();x.ellipse(ex,ey,10.5,4.6,0,0,Math.PI*2);x.fill();
    x.fillStyle=g(22+r()*30);x.beginPath();x.arc(ex+s*0.5,ey,4.3,0,Math.PI*2);x.fill();
    x.fillStyle=g(235);x.fillRect(ex-1.5,ey-2.2,1.6,1.6);
    x.strokeStyle=g(skin*0.3);x.lineWidth=1.8;x.beginPath();x.ellipse(ex,ey+0.5,11,5.2,0,Math.PI*1.05,Math.PI*1.95);x.stroke();
    // kaş
    x.strokeStyle=g(hair*0.9);x.lineWidth=fem?3:4.6;x.lineCap='round';x.beginPath();
    const tilt=(r()-.5)*4;x.moveTo(ex-s*13,ey-13+tilt);x.quadraticCurveTo(ex,ey-19,ex+s*13,ey-14-tilt);x.stroke();
  });
  // burun
  const ny=hy+fh*0.4;
  x.strokeStyle='rgba(0,0,0,0.22)';x.lineWidth=2;x.beginPath();x.moveTo(cx-4,ey+4);x.quadraticCurveTo(cx-9,ny-10,cx-10,ny);x.stroke();
  x.fillStyle='rgba(0,0,0,0.3)';[-1,1].forEach(s=>{x.beginPath();x.ellipse(cx+s*6,ny+1,3.4,2,0,0,Math.PI*2);x.fill();});
  x.fillStyle='rgba(255,255,255,0.10)';x.beginPath();x.ellipse(cx,ny-6,4,8,0,0,Math.PI*2);x.fill();
  // ağız
  const my=hy+fh*0.64,mw=fem?12:14;
  x.fillStyle=g(skin*(fem?0.62:0.7));x.beginPath();x.moveTo(cx-mw,my);x.quadraticCurveTo(cx,my-4,cx+mw,my);x.quadraticCurveTo(cx,my+7,cx-mw,my);x.fill();
  x.strokeStyle=g(skin*0.32);x.lineWidth=1.6;x.beginPath();x.moveTo(cx-mw,my);x.quadraticCurveTo(cx,my+1.5,cx+mw,my);x.stroke();

  // implant (Aras'taki göz halkası gibi)
  const imp=r();
  if(imp<0.35){const s=r()<.5?-1:1,ex=cx+s*(edx+15);x.strokeStyle=g(225);x.lineWidth=1.4;x.beginPath();x.arc(ex,ey-2,6,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(ex,ey+4);x.quadraticCurveTo(ex+s*2,ey+18,ex-s*6,ey+24);x.stroke();}
  else if(imp<0.55){x.fillStyle=g(230);for(let i=0;i<3;i++){x.beginPath();x.arc(cx-8+i*8,hy-fh*0.55,1.8,0,Math.PI*2);x.fill();}}

  // ön saç
  const capPath=drop=>{x.beginPath();x.moveTo(cx-fw*1.05,hy-fh*0.02);
    x.bezierCurveTo(cx-fw*1.2,hy-fh*1.45,cx+fw*1.2,hy-fh*1.45,cx+fw*1.05,hy-fh*0.02);
    x.lineTo(cx+fw*0.93,hy-fh*0.18);x.quadraticCurveTo(cx+fw*0.9,hy-fh*0.5,cx+fw*0.6,hy-fh*0.56);
    x.quadraticCurveTo(cx,hy-fh*(0.7-drop),cx-fw*0.6,hy-fh*0.56);
    x.quadraticCurveTo(cx-fw*0.9,hy-fh*0.5,cx-fw*0.93,hy-fh*0.18);x.closePath();};
  let lastDrop=0;
  const cap=(drop,fill)=>{lastDrop=drop;capPath(drop);gr=x.createLinearGradient(cx-fw,hy-fh*1.2,cx+fw,hy);gr.addColorStop(0,fill);gr.addColorStop(1,'rgba(0,0,0,0.6)');x.fillStyle=fill;x.fill();x.fillStyle=gr;x.globalAlpha=0.35;x.fill();x.globalAlpha=1;};
  const strands=(n,a)=>{x.save();capPath(lastDrop);x.clip();x.strokeStyle='rgba(255,255,255,'+(a*1.6)+')';x.lineWidth=1;
    for(let i=0;i<n;i++){const sx=cx-fw*1.1+r()*fw*2.2,sy2=hy-fh*1.15+r()*fh*0.4;x.beginPath();x.moveTo(sx,sy2);x.quadraticCurveTo(sx+(r()-.5)*14,sy2+16,sx+(sx<cx?-1:1)*(4+r()*12),sy2+34);x.stroke();}x.restore();};
  if(style==='crop'||style==='side'){cap(style==='side'?0.18:0.02,g(hair));strands(40,0.06);
    if(style==='side'){x.strokeStyle=g(hair+40);x.lineWidth=2;x.beginPath();x.moveTo(cx-fw*0.35,hy-fh*1.05);x.lineTo(cx-fw*0.28,hy-fh*0.55);x.stroke();}}
  else if(style==='buzz'){x.globalAlpha=0.75;cap(-0.05,g(hair*0.9));x.globalAlpha=1;for(let i=0;i<500;i++){x.fillStyle='rgba(0,0,0,0.25)';x.fillRect(cx-fw+r()*fw*2,hy-fh*1.1+r()*fh*0.75,1,1);}}
  else if(style==='mohawk'){x.globalAlpha=0.5;cap(-0.05,g(hair*1.2));x.globalAlpha=1;x.fillStyle=g(hair);x.beginPath();x.moveTo(cx-16,hy-fh*0.5);x.quadraticCurveTo(cx-20,hy-fh*1.35,cx,hy-fh*1.42);x.quadraticCurveTo(cx+20,hy-fh*1.35,cx+16,hy-fh*0.5);x.closePath();x.fill();strands(14,0.08);}
  else if(style==='bald'){x.fillStyle='rgba(255,255,255,0.12)';x.beginPath();x.ellipse(cx-18,hy-fh*0.75,22,10,-0.4,0,Math.PI*2);x.fill();}
  else if(style==='long'||style==='bob'){cap(0.08,g(hair));
    x.fillStyle=g(hair);[-1,1].forEach(s=>{x.beginPath();x.moveTo(cx+s*fw*1.04,hy-fh*0.1);x.quadraticCurveTo(cx+s*fw*1.2,hy+fh*0.4,cx+s*fw*1.08,style==='long'?hy+fh*1.2:hy+fh*0.85);x.lineTo(cx+s*fw*0.86,style==='long'?hy+fh*1.15:hy+fh*0.8);x.quadraticCurveTo(cx+s*fw*0.95,hy+fh*0.2,cx+s*fw*0.82,hy-fh*0.3);x.closePath();x.fill();});
    strands(60,0.07);}
  else if(style==='bun'){cap(-0.02,g(hair));x.fillStyle=g(hair*0.9);x.beginPath();x.arc(cx,hy-fh*1.18,24,0,Math.PI*2);x.fill();strands(30,0.07);}
  else if(style==='undercut'){x.save();x.beginPath();x.rect(cx-fw*0.4,0,W,H);x.clip();cap(0.1,g(hair));x.restore();
    x.fillStyle=g(hair);x.beginPath();x.moveTo(cx+fw*1.04,hy-fh*0.1);x.quadraticCurveTo(cx+fw*1.2,hy+fh*0.4,cx+fw*1.0,hy+fh*0.7);x.lineTo(cx+fw*0.8,hy+fh*0.6);x.quadraticCurveTo(cx+fw*0.95,hy,cx+fw*0.6,hy-fh*0.4);x.closePath();x.fill();
    for(let i=0;i<300;i++){x.fillStyle='rgba(0,0,0,0.25)';x.fillRect(cx-fw+r()*fw*0.6,hy-fh*0.9+r()*fh*0.8,1,1);}strands(30,0.07);}

  // vinyet
  gr=x.createRadialGradient(cx,150,120,cx,170,260);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,0.55)');x.fillStyle=gr;x.fillRect(0,0,W,H);

  // grenli monokrom + tarama çizgisi
  const im=x.getImageData(0,0,W,H),d=im.data;
  for(let i=0;i<d.length;i+=4){
    const y=(i/4/W)|0;let v=d[i]*0.3+d[i+1]*0.59+d[i+2]*0.11;
    v=(v-128)*1.12+128+(r()-.5)*26;if(y%3===0)v*=0.9;
    d[i]=d[i+1]=d[i+2]=v<0?0:v>255?255:v;}
  x.putImageData(im,0,0);
  return cv.toDataURL('image/jpeg',0.86);
}

window.DZCPortrait=function(sub){
  if(!sub)return '';
  if(sub.photo)return 'assets/aras-kaan-vardar.jpg';
  const k=sub.id||sub.name;
  if(!cache.has(k)){try{cache.set(k,draw(sub));}catch(e){cache.set(k,'');}}
  return cache.get(k);
};
})();
