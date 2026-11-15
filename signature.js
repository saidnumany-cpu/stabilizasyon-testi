/* DZC-81 · Prosedürel biyometrik imza
   Kimlik kodundan (seed) ve kişinin adındaki harflerden tek parça bir kalem çizgisi üretir.
   Aynı kişi → hep aynı imza; farklı kişi → farklı eğim, boyut, ilmek, içerik ve kuyruk. */
(function(){
'use strict';
const cache=new Map();
function hashStr(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const ASC=new Set('bdfhklt'.split('')),DESC=new Set('gjpqyğ'.split('')),DOT=new Set('iüöj'.split('')),CED=new Set('çş'.split(''));
const lower=s=>s.toLocaleLowerCase('tr');

// Catmull-Rom → kübik bezier
function smooth(pts,t){
  if(pts.length<2)return '';
  let d='M'+pts[0][0].toFixed(1)+' '+pts[0][1].toFixed(1);
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i],p1=pts[i],p2=pts[i+1],p3=pts[i+2]||p2;
    const c1=[p1[0]+(p2[0]-p0[0])*t,p1[1]+(p2[1]-p0[1])*t],c2=[p2[0]-(p3[0]-p1[0])*t,p2[1]-(p3[1]-p1[1])*t];
    d+=' C'+c1[0].toFixed(1)+' '+c1[1].toFixed(1)+' '+c2[0].toFixed(1)+' '+c2[1].toFixed(1)+' '+p2[0].toFixed(1)+' '+p2[1].toFixed(1);
  }
  return d;
}

function build(sub){
  const r=rng(hashStr((sub.id||'')+'|'+(sub.name||'')));
  const given=(sub.given||'').split(' ').filter(Boolean),sur=sub.sur||'';
  // içerik varyantı
  const v=r();
  let parts;
  if(v<.28)parts=[given[0],sur];                       // Ad Soyad
  else if(v<.52)parts=[given[0][0],sur];               // A. Soyad
  else if(v<.72)parts=[sur];                            // Soyad
  else if(v<.88)parts=[given.map(g=>g[0]).join('')+sur[0]]; // baş harfler paraf
  else parts=[given[0]];                                // yalnız ad
  parts=parts.map(p=>{const l=lower(p);return l.charAt(0).toLocaleUpperCase('tr')+l.slice(1);});
  const maxLen=v<.88&&v>=.72?4:10;

  const H=24+r()*20, W=6+r()*9, slant=-(0.02+r()*0.6), base=70, tension=0.08+r()*0.24;
  const capType=Math.floor(r()*3), loopy=r()<.45, legible=2+Math.floor(r()*3), waveTail=r()<.55, waveF=0.6+r()*0.9;
  const capScale=1.25+r()*0.5, wob=1.5+r()*3.5, compress=0.75+r()*0.5;
  const strokes=[],dots=[];
  let x=12;
  parts.forEach((word,wi)=>{
    const pts=[];const chars=[...word].slice(0,wi===parts.length-1?maxLen:Math.min(maxLen,3));
    chars.forEach((ch,ci)=>{
      const lc=lower(ch),cap=ci===0;
      const w=W*(cap?1.6:1)*(0.8+r()*0.5)*compress;
      const y0=base+(r()-.5)*wob;
      if(!cap&&waveTail&&wi===parts.length-1&&ci>=legible){
        // okunmaz dalga kuyruk
        const amp=H*(0.25+r()*0.3)*Math.max(.35,1-(ci-legible)*0.18);
        pts.push([x+w*0.3*waveF,y0-amp]);pts.push([x+w*0.65*waveF,y0+amp*0.15]);
        x+=w*0.8*waveF;return;
      }
      if(cap){
        pts.push([x,y0+2]);
        if(capType===0){ // uzun sivri
          pts.push([x+w*0.15,y0-H*capScale]);pts.push([x+w*0.55,y0-H*capScale*0.5]);pts.push([x-w*0.1,y0-H*0.35]);
        }else if(capType===1){ // büyük oval ilmek
          pts.push([x-w*0.4,y0-H*0.7]);pts.push([x+w*0.4,y0-H*capScale]);pts.push([x+w*1.2,y0-H*0.75]);pts.push([x+w*0.5,y0-H*0.15]);pts.push([x-w*0.2,y0-H*0.45]);
        }else{ // kanca + çift vuruş
          pts.push([x+w*0.5,y0-H*capScale*0.9]);pts.push([x+w*0.2,y0-H*capScale]);pts.push([x+w*0.35,y0]);pts.push([x+w*0.7,y0-H*capScale*0.6]);
        }
        pts.push([x+w*0.7,y0-H*0.25*r()]);
        pts.push([x+w,y0]);
      }else if(ASC.has(lc)){
        pts.push([x+w*0.2,y0-H*(0.9+r()*0.3)]);pts.push([x+w*0.05,y0-H*0.45]);pts.push([x+w*0.6,y0]);
      }else if(DESC.has(lc)){
        pts.push([x+w*0.3,y0-H*0.35]);pts.push([x+w*0.5,y0+H*(0.55+r()*0.3)]);pts.push([x+w*0.15,y0+H*0.35]);pts.push([x+w*0.8,y0-H*0.05]);
      }else if('mnrvwu'.includes(lc)){
        pts.push([x+w*0.25,y0-H*(0.35+r()*0.15)]);if(loopy)pts.push([x+w*0.12,y0-H*0.18]);pts.push([x+w*0.5,y0]);if('mw'.includes(lc)){pts.push([x+w*0.75,y0-H*0.35]);pts.push([x+w,y0]);}
      }else{
        // a e o s c vb. küçük kıvrım
        if(loopy){pts.push([x+w*0.45,y0-H*(0.3+r()*0.2)]);pts.push([x+w*0.15,y0-H*0.1]);pts.push([x+w*0.7,y0+1]);}
        else{pts.push([x+w*0.35,y0-H*(0.22+r()*0.2)]);pts.push([x+w*0.7,y0+1]);}
      }
      if(DOT.has(lc))dots.push([x+w*0.4,y0-H*(0.75+r()*0.3)]);
      if(CED.has(lc))dots.push([x+w*0.45,y0+H*0.25]);
      x+=w*(cap?0.9:0.85);
    });
    // kelime sonu: hafif yukarı kuyruk
    const last=pts[pts.length-1];pts.push([last[0]+W*0.8,last[1]-H*0.15*r()]);
    strokes.push(pts);
    x+=W*(1.2+r()*1.2);
  });
  // kuyruk / alt çizgi
  const endX=x,u=r(),lastPt=strokes[strokes.length-1].slice(-1)[0];
  if(u<.35){strokes.push([[lastPt[0],lastPt[1]],[endX+W,base+H*0.25],[endX*0.55,base+H*0.55],[8,base+H*0.35],[24,base+H*0.3]]);}
  else if(u<.6){strokes.push([[14,base+H*0.45],[endX*0.5,base+H*0.3+(r()-.5)*6],[endX+W*2,base+H*0.1]]);}
  else if(u<.8){strokes[strokes.length-1].push([lastPt[0]+W*2,lastPt[1]-H*0.7],[lastPt[0]+W*0.5,lastPt[1]-H*0.2],[lastPt[0]+W*3.5,lastPt[1]+H*0.1]);}
  // eğim uygula
  const tf=p=>[p[0]+(base-p[1])*(-slant),p[1]];
  const all=strokes.map(s=>s.map(tf)),dd=dots.map(tf);
  // sınırlar
  let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
  all.flat().concat(dd).forEach(([px,py])=>{minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);});
  const pad=8,sw=(1.8+r()*1.6).toFixed(2);
  const vb=[(minX-pad).toFixed(1),(minY-pad).toFixed(1),(maxX-minX+pad*2).toFixed(1),(maxY-minY+pad*2).toFixed(1)].join(' ');
  const paths=all.map((s,i)=>'<path pathLength="1" style="animation-delay:'+(i*0.35).toFixed(2)+'s" d="'+smooth(s,tension)+'"/>').join('')+
    dd.map((p,i)=>'<circle class="sigdot" style="animation-delay:'+(all.length*0.35+0.2+i*0.05).toFixed(2)+'s" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(sw*0.7).toFixed(2)+'"/>').join('');
  return {vb,sw,paths};
}

window.DZCSignature=function(sub,cls){
  if(!sub)return '';
  const k=(sub.id||'')+'|'+(sub.name||'');
  if(!cache.has(k)){try{cache.set(k,build(sub));}catch(e){cache.set(k,null);}}
  const s=cache.get(k);if(!s)return '';
  return '<svg class="sigsvg '+(cls||'')+'" viewBox="'+s.vb+'" preserveAspectRatio="xMinYMid meet" role="img" aria-label="'+String(sub.name||'').replace(/"/g,'')+' biyometrik imzası"><g fill="none" stroke="currentColor" stroke-width="'+s.sw+'" stroke-linecap="round" stroke-linejoin="round">'+s.paths+'</g></svg>';
};
})();
