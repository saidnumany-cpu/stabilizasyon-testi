(function(){
'use strict';
const C={cy:'#5CCFE0',or:'#F4703F',pk:'#FF4FB0',rd:'#FF3341',am:'#FFB020',mu:'#9AA0A6',fg:'#E8E6E1',line:'#262A30',bg:'#08090B',red:'#E8202A'};
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const clockStr=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds())};
const fmt=(x,d)=>x.toFixed(d).replace('.',',');
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================= ekrana sığdır ================= */
function fit(){
  const mob=innerWidth<900||(innerWidth<innerHeight&&innerWidth<1100);
  document.documentElement.classList.toggle('mob',mob);
  if(mob){$('stage').style.transform='';return;}
  const s=Math.min(innerWidth/1920,innerHeight/1080);
  $('stage').style.transform='scale('+s+')';
}
let rotDismissed=false;
$('rotX').onclick=()=>{rotDismissed=true;$('rot').style.display='none';};
addEventListener('resize',fit);fit();

/* ================= ses ================= */
let actx=null,soundOn=true;
function tone(freq,dur,type,vol,slide){
  if(!soundOn)return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime;
    o.type=type||'square';o.frequency.setValueAtTime(freq,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
    g.gain.setValueAtTime(vol||.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+dur+.02);
  }catch(e){}
}
const SFX={
  click:()=>tone(1400,.04,'square',.03),
  step:()=>tone(880,.03,'sine',.025),
  ok:()=>{tone(660,.09,'square',.04);setTimeout(()=>tone(990,.14,'square',.04),90);},
  hold:()=>{tone(520,.12,'triangle',.05);setTimeout(()=>tone(520,.12,'triangle',.05),160);},
  bad:()=>{tone(160,.35,'sawtooth',.06);},
  nexus:()=>tone(300,.6,'sine',.07,1500),
  alarm:()=>{tone(740,.18,'square',.05);setTimeout(()=>tone(560,.18,'square',.05),200);setTimeout(()=>tone(740,.18,'square',.05),400);},
  err:()=>tone(220,.12,'square',.05)
};

/* ================= veri ================= */
const ZN=[['IST-34','ENDÜSTRİ'],['ANK-06','İDARİ'],['DZC-81','TRANSİT'],['DZ-TAR','S. TARIM'],['SİSMİK','ALTYAPI'],['ORB-H','ORBİTAL'],['ARŞ-0','ARŞİV'],['KRN-9','KARANTİNA']];
const ZINFO={
  'IST-34':['IST-34 ENDÜSTRİYEL BÖLGE','Eski adıyla İstanbul. Sistemin sanayi ve üretim yükünü taşıyan ağır endüstri sektörü.'],
  'ANK-06':['ANK-06 İDARİ MERKEZ KOMPLEKSİ','Eski adıyla Ankara. Yönetimin merkezi; tüm ihlal bildirimleri buraya iletilir.'],
  'DZC-81':['DZC-81 TRANSİT DÜĞÜMÜ','IST-34 ile ANK-06 arasındaki en büyük ve en sıkı korunan geçiş ve kontrol düğümü.'],
  'DZ-TAR':['DZC-81 SENTETİK TARIM KOMPLEKSİ','Düzce\'nin tarım kimliğinin endüstriyelleşmiş hali. SYNTEX-81 rasyonları burada üretilir.'],
  'SİSMİK':['SİSMİK KALİBRASYON VE ALTYAPI','Fay hattı üzerindeki düğümün yapısal stabilitesini izleyen denetim birimi.'],
  'ORB-H':['TRANS-METRO ORBİTAL HAT','Yörünge sefer sistemi (軌道運行システム). Hiper-hızlı kargo ve yolcu akışı.'],
  'ARŞ-0':['MERKEZİ ARŞİV','Tüm geçiş, test ve karar kayıtlarının kalıcı olarak yazıldığı arşiv.'],
  'KRN-9':['KRN-9 KARANTİNA','Temel çizgiden sapan bireylerin "standart ayarlarına" döndürüldüğü stabilizasyon tesisi.']
};
const DEPTS=[
 {d:'SENTETİK TARIM KOMPLEKSİ',g:'HASAT OPERATÖRÜ / FAZ-1',y:'SEVİYE 2 · ÜRETİM',z:[1,-1,1,1,-1,0,-1,-1]},
 {d:'TRANS-METRO ORBİTAL BAKIM',g:'HAT TEKNİSYENİ / FAZ-3',y:'SEVİYE 3 · ORBİTAL HAT',z:[1,-1,1,-1,0,1,-1,-1]},
 {d:'ARŞİV VE KAYIT BİRİMİ',g:'KAYIT MEMURU / FAZ-2',y:'SEVİYE 3 · ARŞİV',z:[0,0,1,-1,-1,-1,1,-1]},
 {d:'IST-34 AĞIR SANAYİ HATTI',g:'PRES OPERATÖRÜ / FAZ-1',y:'SEVİYE 1 · ENDÜSTRİ',z:[1,-1,1,-1,-1,0,-1,-1]},
 {d:'ANK-06 İDARİ LOJİSTİK',g:'SEVKİYAT YÖNETİCİSİ',y:'SEVİYE 4 · İDARİ',z:[1,1,1,0,-1,1,0,-1]},
 {d:'KARANTİNA VE STABİLİZASYON',g:'NÖRO-TEKNİSYEN / FAZ-2',y:'SEVİYE 4 · KARANTİNA',z:[0,-1,1,-1,-1,0,-1,1]}
];
const FN=['DEFNE','KEREM','MERVE','ONUR','ELİF','BARIŞ','İLKİM','TOLGA','SELİN','EMRE','ZEYNEP','ARDA'];
const MN=['ATA','ÇAĞ','ILGAZ','TAN','NUR','SU','ALP','DORUK',''];
const SN=['SOYSAL','ERKAN','TUNA','BAYKAL','KORAL','DEMİREL','AKSU','YALIN','ÖZER','KAYAR','TEMİZ','ULUÇ'];
const TR2A=s=>s.replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C');
const ROUTES=[['IST-34','ANK-06'],['ANK-06','IST-34'],['IST-34','DZ-TAR'],['ORB-H','ANK-06']];
function mkMrz(given,sur,idc,valid){
  const l1=('IDDZC81<<'+TR2A(given).replace(/ /g,'<')+'<'+TR2A(sur)).padEnd(44,'<').slice(0,44);
  const l2=(idc.replace(/[^A-Z0-9]/g,'').slice(0,12)+'9TUR'+valid).padEnd(42,'<').slice(0,42)+'06';
  return l1+'\n'+l2;
}
function gen(){
  const f=pick(FN),m=pick(MN),s=pick(SN),dp=pick(DEPTS);
  const given=f+(m?' '+m:'');const ini=TR2A(f[0]+(m?m[0]:'X')+s[0]);
  const id='DZC-'+String(Math.floor(rnd(100,9999))).padStart(4,'0')+'-'+ini;
  const r=Math.random();const dev=r<.5?rnd(.002,.018):(r<.8?rnd(.021,.038):rnd(.046,.12));
  const rt=pick(ROUTES);const h=Math.floor(rnd(18,21)),mi=Math.floor(rnd(0,5))*10;
  const sy=Math.floor(rnd(2098,2100)),ey=sy+2;
  return {id,name:given+' '+s,short:s+', '+f+(m?' '+m[0]+'.':''),given,sur:s,photo:false,dept:dp.d,
    fields:[['GÖREV',dp.g],['YETKİ DÜZEYİ',dp.y],['KAN GRUBU',pick(['0 Rh+','A Rh+','B Rh-','AB Rh+','0 Rh-'])],['SENTETİK TAKVİYE',pick(['AKTİF','AKTİF','ASKIDA'])],['SİSTEM SERİ NO','SYS-'+Math.floor(rnd(1000,9999))+'-'+TR2A(s.slice(0,3))+'-'+Math.floor(rnd(100,999))],['GEÇERLİLİK',sy+'.'+pad(Math.floor(rnd(1,12)))+'.'+pad(Math.floor(rnd(1,28)))+' – '+ey+'.'+pad(Math.floor(rnd(1,12)))+'.'+pad(Math.floor(rnd(1,28)))]],
    zones:dp.z.slice(),dev,face:rnd(91,99.4),route:rt,dep:pad(h)+'.'+pad(mi),arr:pad(h+1)+'.'+pad((mi+30)%60),
    mrz:mkMrz(given,s,id,sy+'1104M'+ey+'1103'),nx:Math.floor(rnd(0,40)),rations:pick([3,3,3,2,1])};
}
const ARAS={id:'DZC-8109-AKV',name:'ARAS KAAN VARDAR',short:'VARDAR, ARAS K.',given:'ARAS KAAN',sur:'VARDAR',photo:true,
  dept:'SİSMİK KALİBRASYON VE ALTYAPI DENETİMİ',
  fields:[['GÖREV','BAŞ TEKNİKER / FAZ-2'],['YETKİ DÜZEYİ','SEVİYE 4 · KISITLI BÖLGE'],['KAN GRUBU','0 Rh+'],['SENTETİK TAKVİYE','AKTİF'],['SİSTEM SERİ NO','SYS-8489-ARV-990'],['GEÇERLİLİK','2099.11.04 – 2101.11.03']],
  zones:[1,-1,1,0,1,1,-1,-1],dev:.0362,face:97.2,route:['IST-34','ANK-06'],dep:'17.50',arr:'18.20',
  mrz:'IDDZC81<<ARAS<KAAN<VARDAR<<<<<<<<<<<<<<<<<<\nDZ8109AKV9TUR20991104M21011103<<<<<<<<<<<<06',nx:8,rations:3};
const YUCEL={id:'DZC-2408-SNY',name:'SAİD NUMAN YÜCEL',given:'SAİD NUMAN',sur:'YÜCEL',short:'YÜCEL, SAİD N.',dept:'YOLCU · MERKEZİ TRANSİT',route:['IST-34','DZC-81'],dep:'17.50',arr:'18.20',fields:[['YETKİ DÜZEYİ','SEVİYE 2 · YOLCU']]};

let upcoming=[ARAS,gen(),gen(),gen()];
let history=[
  {t:'17:46:12',s:YUCEL,label:'YÜCEL, SAİD N. · IST-34',tag:'GEÇTİ',dev:.0041},
  ...[['17:47:40','RET',.0712],['17:48:18','NEXUS-X',.0288],['17:48:55','BEKLET',.0235]].map(([t,tag,dev])=>{const g=gen();return{t,s:g,label:g.short+' · '+g.id.slice(0,8),tag,dev};})];
let cnt={pass:1207,ret:38,hold:61,nx:23,wait:14};
let cur=null,devTarget=0,devShown=0,step=0,testDone=false,decision=30,nexusLoad=0,busy=false,nxApplied=0,phase=0,paused=false,started=false,modalOpen=false,modalPrimary=null,lastAlarmFor=null;

/* ================= kayıt akışı ================= */
const LV={OK:C.cy,WARN:C.am,ERR:C.rd,SYS:C.mu,NXS:C.pk};
function log(lv,msg){
  const el=document.createElement('div');el.className='logl new';
  el.innerHTML='<span class="mu"></span><span></span><span></span>';
  el.children[0].textContent=clockStr();el.children[1].textContent=lv;el.children[1].style.color=LV[lv];el.children[2].textContent=msg;el.title=msg;
  const box=$('logs');box.appendChild(el);while(box.children.length>(document.documentElement.classList.contains('mob')?30:16))box.removeChild(box.firstChild);box.scrollTop=box.scrollHeight;
}
let toastT=null;
function toast(msg,col){
  const t=$('toast');t.textContent=msg;t.style.borderLeftColor=col||C.am;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200);
}

/* ================= durum ================= */
function status(dv){
  if(!testDone&&step<4)return{c:C.am,t:'ÖLÇÜM',jp:'測定',n:'TEST SÜRÜYOR · DENEK SABİT DURMALI',k:'m'};
  if(dv<.02)return{c:C.cy,t:'STABİL',jp:'安定',n:'TÜM KANALLAR EŞİK İÇİNDE · GEÇİŞE UYGUN',k:'s'};
  if(dv<.04)return{c:C.am,t:'SAPMA',jp:'逸脱',n:'MİKRO DUYGUSAL SAPMA · RİTİM DÜZENSİZ',k:'d'};
  return{c:C.rd,t:'İHLAL',jp:'違反',n:'EŞİK AŞILDI · GEÇİŞ HAKKI ASKIDA',k:'v'};
}
function paintStatus(){
  if(!cur)return;
  const s=status(devShown);
  document.documentElement.style.setProperty('--st',s.c);
  $('wave').setAttribute('stroke',s.c);
  $('stTxt').textContent=s.t;$('stJp').textContent=s.jp;$('stNote').textContent=s.n;
  $('warnband').classList.toggle('alarm',s.k==='v'&&testDone);
  let adv='TEST SÜRÜYOR…',pr='DEĞERLENDİRİLİYOR',pc=C.mu;
  if(testDone){
    if(s.k==='s'){adv='GEÇİŞE İZİN VER · 承認';pr='GEREKMİYOR';pc=C.cy;}
    else if(s.k==='d'){adv='NEXUS-X 1 BİRİM · TEKRAR TEST';pr='ÖNERİLİR · 1 BİRİM';pc=C.am;}
    else {adv='ZORUNLU STABİLİZASYON · KARANTİNA';pr='ZORUNLU · DERHAL';pc=C.rd;}
  }
  $('advice').textContent=adv;$('nxProto').textContent=pr;$('nxProto').style.color=pc;
  // onay butonu sadece test bitince
  const bA=$('bA');bA.disabled=busy;bA.classList.toggle('locked',!testDone);bA.setAttribute('aria-disabled',String(!testDone));bA.title=testDone?'':'Test tamamlanmadan onay verilemez';
  ['bH','bN','bR'].forEach(id=>$(id).disabled=busy);
  renderDocs(s);
}

/* ================= çizimler ================= */
function renderId(){
  $('name').textContent=cur.name;$('pid').textContent=cur.id;$('dept').textContent=cur.dept;
  $('face').textContent=fmt(cur.face,1);
  $('photo').src=window.DZCPortrait(cur);$('photo').alt=cur.name+' vesikalık';$('photo').style.display='block';$('silh').style.display='none';
  $('sig').textContent=cur.photo?'Arv':cur.sur.charAt(0)+cur.sur.slice(1,3).toLocaleLowerCase('tr');
  $('fields').innerHTML='';
  cur.fields.forEach(([k,v])=>{const d=document.createElement('div');d.className='field';d.innerHTML='<span class="k"></span><span class="v"></span>';d.children[0].textContent=k;d.children[1].textContent=v;$('fields').appendChild(d);});
  $('mrz').textContent=cur.mrz;
  const bc=$('barcode');bc.innerHTML='';let seed=0;for(const ch of cur.id)seed=(seed*31+ch.charCodeAt(0))%9973;
  for(let i=0;i<56;i++){seed=(seed*73+17)%9973;const b=document.createElement('div');b.style.cssText='height:30px;width:'+(1+seed%3)+'px;margin-right:'+(1+(seed>>2)%3)+'px;background:'+(i<32?C.fg:C.red);bc.appendChild(b);}
  $('barTxt').textContent=TR2A(cur.given).replace(/ /g,'');const sp=document.createElement('span');sp.style.color='#FF4552';sp.textContent=TR2A(cur.sur);$('barTxt').appendChild(sp);
  renderZones();
  $('route').textContent=cur.route[0]+' → DZC-81 → '+cur.route[1];$('times').textContent=cur.dep+' → '+cur.arr;
  $('pending').textContent=cur.id+' · '+cur.short;
  $('sess').textContent=cur.id.slice(4,8)+'-C';$('baseRef').textContent=cur.photo?'SYS-8489':cur.fields[4][1].slice(0,8);
}
function renderZones(){
  const z=$('zones');z.innerHTML='';
  ZN.forEach(([c,n],i)=>{const m=cur.zones[i];const d=document.createElement('button');d.type='button';d.className='rb zone';
    d.innerHTML='<span class="disp" style="font-weight:800;font-size:13px;line-height:1"></span><span style="font-size:13px;line-height:1"></span><span class="mono mu" style="font-size:8.5px;letter-spacing:.3px"></span>';
    d.children[0].textContent=c;d.children[1].textContent=m===1?'■':m===0?'□':'×';d.children[1].style.color=m===1?C.cy:m===0?C.am:C.rd;d.children[2].textContent=n;
    d.setAttribute('aria-label',c+' '+n+': '+(m===1?'açık':m===0?'koşullu':'kapalı'));
    d.onclick=()=>{SFX.click();openZone(i);};z.appendChild(d);});
}
const TAG={'GEÇTİ':['transparent',C.cy,C.cy],'BEKLET':['transparent',C.am,C.am],'NEXUS-X':['transparent',C.pk,C.pk],'RET':[C.rd,C.bg,C.rd],'SIRADA':['transparent',C.mu,C.line],'İŞLEMDE':[C.fg,C.bg,C.fg]};
function renderQueue(){
  const rows=history.slice(-4).map(h=>({t:h.t,label:h.label,tag:h.tag,kind:'h',ref:h}));
  rows.forEach((r)=>r.sub=r.ref&&r.ref.s);
  rows.push({t:clockStr(),label:cur.short+' · '+cur.id.slice(0,8),tag:'İŞLEMDE',kind:'c',sub:cur});
  upcoming.slice(0,2).forEach((u,i)=>rows.push({t:'—',label:u.id,tag:'SIRADA',kind:'u',idx:i,sub:u}));
  const q=$('queue');q.innerHTML='';
  rows.forEach((r,i)=>{const d=document.createElement('button');d.type='button';d.className='rb qrow'+(r.kind==='c'?' cur':'');
    d.innerHTML='<span class="mono mu"></span><span class="mono"></span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500"></span><span class="tag"></span>';
    d.children[0].textContent=pad(i+1);d.children[1].textContent=r.t;
    if(r.sub){const im=document.createElement('img');im.src=window.DZCPortrait(r.sub);im.alt='';im.className='qav';d.children[2].appendChild(im);}
    d.children[2].appendChild(document.createTextNode(r.label));
    const t=TAG[r.tag];d.children[3].textContent=r.tag;d.children[3].style.background=t[0];d.children[3].style.color=t[1];d.children[3].style.borderColor=t[2];
    d.onclick=()=>{SFX.click();if(r.kind==='h')openRecord(r.ref);else if(r.kind==='u')openUpcoming(r.idx);else openDoc(1);};
    q.appendChild(d);});
  $('qWait').textContent=cnt.wait;$('cQueue').textContent=cnt.wait;
}
function docState(s){
  const nx=!testDone?'BEKLENİYOR':(s.k==='s'?'STOKTA · GEREKMİYOR':(s.k==='d'?'HAZIRLANDI · 1 BİRİM':'ZORUNLU UYGULAMA'));
  return [
    ['BİLET','軌道運行',C.cy,'Merkezi Transit Geçiş Belgesi',cur.route[0]+' → DZC-81 · '+cur.dep+'/'+cur.arr,'DOĞRULANDI',C.cy],
    ['KİMLİK','制限区域',C.red,'Personel Erişim Kartı',cur.id+' · '+cur.fields[1][1].split(' · ')[0],'承認 MÜHÜR GEÇERLİ',C.cy],
    ['NEXUS-X','ネクサス',C.pk,'Nöro Stabilizatör','HASAT KODU DZ-99 · '+nxApplied+' UYG.',nx,testDone?s.c:C.mu],
    ['SYNTEX-81','合成',C.or,'Sentetik Protein Rasyonu','HASAT KODU DZ-21 · %88,4','TÜKETİLDİ '+cur.rations+'/3',cur.rations<3?C.am:C.cy]
  ];
}
function renderDocs(s){
  const read=Math.min(4,Math.max(0,step-1));
  const box=$('docs');
  if(box.children.length!==4){box.innerHTML='';
    for(let i=0;i<4;i++){const el=document.createElement('button');el.type='button';el.className='rb doc';
      el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:baseline"><span class="disp" style="font-weight:800;font-size:15px"></span><span class="jp mu" style="font-size:12px"></span></div><span style="font-size:11.5px;font-weight:600;line-height:1.2"></span><span class="mono mu" style="font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></span><span class="mono" style="font-size:10px;letter-spacing:1px"></span>';
      el.onclick=()=>{SFX.click();openDoc(i);};box.appendChild(el);}}
  docState(s).forEach((d,i)=>{const on=i<read;const el=box.children[i];
    el.style.borderTop='4px solid '+(on?d[2]:C.line);el.style.opacity=on?1:.45;
    const c=el.querySelectorAll('span');c[0].textContent=d[0];c[0].style.color=on?d[2]:C.mu;c[1].textContent=d[1];c[2].textContent=d[3];c[3].textContent=d[4];c[4].textContent=on?d[5]:'TARANIYOR…';c[4].style.color=on?d[6]:C.mu;
    el.setAttribute('aria-label',d[0]+' belgesini aç');});
  $('docCount').textContent=read+'/4 OKUNDU';
}
const STEPS=['TANIM','OCR / MRZ','KALİBRASYON','HAFIZA','UYARAN','ÇAPRAZ','承認 ONAY'];
const UYARAN=['«SIRA. SINIR. SÜREKLİLİK.»','«HÜCRE. HÜCRE. HÜCRE.»','«BİRBİRİYLE. BAĞLANTILI. HÜCRELER. SİSTEM.»','«BİREY YOK. YALNIZCA SİSTEM.»','«İTAAT. RİTİM. STANDART.»'];
function renderSteps(){
  const b=$('steps');b.innerHTML='';
  STEPS.forEach((t,i)=>{const d=document.createElement('div');d.className='step'+(i<step?' done':i===step?' on':'');d.innerHTML='<span class="mono" style="font-size:10px;letter-spacing:1px"></span><span></span>';d.children[0].textContent=pad(i+1);d.children[1].textContent=t;b.appendChild(d);});
  $('cyc').textContent=Math.min(step+1,7);
}
function renderNexus(){$('nxLoad').style.width=nexusLoad+'%';$('nxLoadT').textContent=nexusLoad+'%';$('nxRat').textContent=cur.rations+'/3 BLOK · PROTEİN %88,4';}
function renderCounts(){$('cPass').textContent=cnt.pass.toLocaleString('tr-TR');$('cRet').textContent=cnt.ret;$('cHold').textContent=cnt.hold;$('cNx').textContent=cnt.nx;$('qWait').textContent=cnt.wait;$('cQueue').textContent=cnt.wait;}

/* ================= modal ================= */
let lastFocus=null;
function openModal(title,jp,body,buttons){
  lastFocus=document.activeElement;
  $('mTitle').textContent=title;$('mJp').textContent=jp||'';$('mBody').innerHTML=body;
  const f=$('mFoot');f.innerHTML='';modalPrimary=null;
  (buttons||[{label:'KAPAT',kind:'ghost'}]).forEach(b=>{
    const el=document.createElement('button');el.type='button';el.className='btn';
    const st={primary:'background:var(--cy);color:var(--bg);border:none',danger:'background:var(--rd);color:var(--bg);border:none',pink:'background:transparent;color:var(--pk);border:1px solid var(--pk)',ghost:'background:transparent;color:var(--fg);border:1px solid var(--fg)'}[b.kind||'ghost'];
    el.style.cssText=st;el.innerHTML=esc(b.label)+(b.primary?' <small>[ENTER]</small>':'');
    el.onclick=()=>{closeModal();if(b.fn)b.fn();};
    if(b.primary)modalPrimary=el;f.appendChild(el);});
  $('overlay').classList.add('show');$('overlay').setAttribute('aria-hidden','false');modalOpen=true;
  setTimeout(()=>(modalPrimary||$('mClose')).focus(),30);
}
function closeModal(){$('overlay').classList.remove('show');$('overlay').setAttribute('aria-hidden','true');modalOpen=false;if(lastFocus&&lastFocus.focus)lastFocus.focus();}
$('mClose').onclick=()=>{SFX.click();closeModal();};
$('overlay').addEventListener('mousedown',e=>{if(e.target===$('overlay'))closeModal();});

const kv=pairs=>'<div class="kv">'+pairs.map(([k,v,c])=>'<div><span class="k">'+esc(k)+'</span><span class="v"'+(c?' style="color:'+c+'"':'')+'>'+esc(v)+'</span></div>').join('')+'</div>';

function openDoc(i){
  const s=status(devShown);
  if(i===0){
    openModal('MERKEZİ TRANSİT GEÇİŞ BELGESİ','軌道運行システム',
      '<div class="band" style="background:var(--or)"><span class="jp" style="font-size:30px">軌道運行システム</span><span class="disp" style="font-weight:900;font-size:26px">'+esc(cur.route[0])+'</span></div>'+
      '<div class="band" style="background:var(--cy)"><span class="jp" style="font-size:24px">制限区域 · 承認</span><span class="disp" style="font-weight:900;font-size:26px">DZC-81</span></div>'+
      kv([['YOLCU',cur.name],['PERSONEL KODU',cur.id],['KALKIŞ',cur.dep],['VARIŞ',cur.arr],['GÜZERGÂH',cur.route[0]+' → DZC-81 → '+cur.route[1]],['OCR DOĞRULAMA','K06-3.7 · GEÇERLİ',C.cy]])+
      '<div class="micro">Bu transit geçiş belgesi sadece sisteme kayıtlı bireyler için geçerlidir ve DZC-81 ağı katı güvenlik protokollerine tabidir. İzinsiz bölge değişimi veya sahte kimlik kullanımı tespit edildiğinde belge derhal iptal edilecektir. 警告:システム違反 durumunda cezai işlem uygulanacaktır. SYS-CHK-99.8 &gt;&gt; AUTH: 10938-X &gt;&gt; TRANS-METRO ORBITAL NETWORKS</div>',
      [{label:'KAPAT',kind:'ghost'},{label:'SEFERİ YENİDEN SORGULA',kind:'primary',primary:true,fn:()=>{log('OK','Sefer '+cur.dep+' '+cur.route[0]+'→DZC-81 yeniden sorgulandı · geçerli');toast('SEFER KAYDI GEÇERLİ',C.cy);SFX.ok();}}]);
  }else if(i===1){
    openModal('PERSONEL ERİŞİM KARTI','制限区域',
      '<div style="display:flex;gap:18px;align-items:center"><div style="width:120px;height:120px;border-radius:50%;border:4px solid var(--red);overflow:hidden;flex:none;background:#1A1D22">'+'<img src="'+window.DZCPortrait(cur)+'" alt="" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1)">'+'</div><div style="display:flex;flex-direction:column;gap:4px"><span class="disp" style="font-weight:800;font-size:30px">'+esc(cur.name)+'</span><span class="mono" style="color:var(--rl);font-size:14px;letter-spacing:1.5px">PERSONEL KODU: '+esc(cur.id)+'</span><span style="font-weight:600">'+esc(cur.dept)+'</span></div></div>'+
      kv(cur.fields.map(f=>[f[0],f[1]]).concat([['BASELINE DURUMU',s.t+' // KALİBRASYON: '+devShown.toFixed(4),s.c],['YÜZ EŞLEŞME',fmt(cur.face,1)+'%']]))+
      '<pre class="mono" style="margin:0;background:#111318;border-left:6px solid var(--red);padding:10px 12px;font-size:14px;letter-spacing:1.3px">'+esc(cur.mrz)+'</pre>'+
      '<div class="micro">Bu kimlik kartı DZC-81 otoritesinin mülkiyetindedir. Yalnızca yetkili personelin kullanımına açıktır. Birbiriyle bağlantılı hücreler sistemi protokolü gereğince kart sahibinin zihinsel stabilizasyon ve temel çizgi testi doğrulaması periyodik olarak yapılmaktadır. İzinsiz kullanım kimliğin anında iptaline yol açar.</div>',
      [{label:'KAPAT',kind:'ghost'},{label:'BİYOMETRİK YENİDEN TARAMA',kind:'primary',primary:true,fn:()=>{cur.face=Math.min(99.8,cur.face+rnd(.1,.8));$('face').textContent=fmt(cur.face,1);log('OK','Yüz yeniden tarandı · eşleşme '+fmt(cur.face,1)+'%');toast('YÜZ EŞLEŞME '+fmt(cur.face,1)+'%',C.cy);SFX.ok();}}]);
  }else if(i===2){
    openModal('NEXUS-X · NÖRO STABİLİZATÖR','ネクサス-X · 合成',
      '<div class="band" style="background:var(--pk)"><span class="disp" style="font-weight:900;font-size:40px">NEXUS-X</span><span class="jp" style="font-size:34px">合成</span></div>'+
      '<figure class="nxFig"><img src="assets/nexus-x-urun.jpg" alt="Nexus-X nöro stabilizatör kutusu ve şişesi"><figcaption class="mono">NEXUS-X · NÖRO STABİLİZATÖR · KUTU + ŞİŞE · HASAT KODU DZ-99</figcaption></figure>'+
      kv([['HASAT KODU','DZ-99'],['PROTOKOL',$('nxProto').textContent,$('nxProto').style.color],['DOZAJ YÜKÜ',nexusLoad+'%'],['BU OTURUMDA UYGULANAN',nxApplied+' BİRİM'],['SENTETİK TAKVİYE','AKTİF'],['UYARI','RADYOAKTİF YAN ETKİ OLABİLİR',C.am]])+
      '<div class="micro">Sistemin dışına çıkan veya insani belirtiler gösteren bireylere verilir. Mikro düzeydeki duygusal sapmaları ve ritim bozukluklarını baskılayarak bireyi makineleşmiş düzene yeniden entegre eder. İyileştirmez; standart ayarlara döndürür. TEMEL ÇİZGİ TESTİ ÖNCESİ KULLANIM İÇİNDİR.</div>',
      [{label:'KAPAT',kind:'ghost'},{label:'1 BİRİM UYGULA',kind:'pink',primary:true,fn:()=>act('N')}]);
  }else{
    openModal('SYNTEX-81 · SENTETİK PROTEİN RASYONU','合成タンパク質',
      '<div class="band" style="background:var(--or)"><span class="disp" style="font-weight:900;font-size:40px">SYNTEX-81</span><span class="mono" style="font-size:13px;letter-spacing:2px">PROTEİN KAPSÜLÜ</span></div>'+
      kv([['ÜRETİCİ','DZC-81 SENTETİK TARIM KOMPLEKSİ'],['HASAT KODU','DZ-21'],['SENTETİK PROTEİN ORANI','%88,4'],['BUGÜNKÜ TÜKETİM',cur.rations+'/3 BLOK',cur.rations<3?C.am:C.cy]])+
      '<div class="micro">Sistem vatandaşlarının günlük kalori ve zihinsel stabilizasyon ihtiyacı için optimize edilmiştir. Payınızı tüketiniz ve sisteme itaat ediniz. Standartlaştırılmış beslenmeye uyulmaması temel çizgi sapmasına yol açar.</div>',
      [{label:'KAPAT',kind:'ghost'},{label:cur.rations<3?'EKSİK RASYONU TESLİM ET':'TÜKETİM KAYDINI DOĞRULA',kind:'primary',primary:true,fn:()=>{
        if(cur.rations<3){cur.rations=3;devTarget=Math.max(.002,devTarget*.85);log('OK','SYNTEX-81 DZ-21 eksik rasyon teslim edildi · 3/3');toast('RASYON TAMAMLANDI · 3/3',C.cy);}
        else{log('OK','SYNTEX-81 DZ-21 tüketim kaydı doğrulandı · 3/3');toast('TÜKETİM KAYDI GEÇERLİ',C.cy);}
        renderNexus();paintStatus();SFX.ok();}}]);
  }
}
function openZone(i){
  const [c]=ZN[i],m=cur.zones[i],inf=ZINFO[c];
  const st=m===1?['AÇIK',C.cy]:m===0?['KOŞULLU · AMİR ONAYI',C.am]:['KAPALI',C.rd];
  openModal(inf[0],c==='KRN-9'?'隔離':'区域',
    '<div class="micro" style="font-size:13px;color:var(--fg)">'+esc(inf[1])+'</div>'+kv([['SEKTÖR KODU',c],['DENEK',cur.id],['ERİŞİM DURUMU',st[0],st[1]],['YETKİ',cur.fields[1][1]]]),
    m===1?[{label:'KAPAT',kind:'ghost'}]:[{label:'KAPAT',kind:'ghost'},{label:'GEÇİCİ ERİŞİM TALEP ET',kind:'primary',primary:true,fn:()=>{
      log('SYS','Geçici erişim talebi '+c+' · ANK-06\'ya iletildi');toast('TALEP ANK-06\'YA İLETİLDİ',C.am);SFX.click();
      setTimeout(()=>{if(Math.random()<.35&&m===0){cur.zones[i]=1;renderZones();log('OK',c+' geçici erişim onaylandı · 24 saat');toast(c+' ERİŞİMİ ONAYLANDI',C.cy);SFX.ok();}
        else{log('ERR',c+' erişim talebi reddedildi · ANK-06');toast(c+' TALEBİ REDDEDİLDİ',C.rd);SFX.bad();}},2200);}}]);
}
const face=(sub,col)=>sub?'<div style="display:flex;gap:18px;align-items:center"><img src="'+window.DZCPortrait(sub)+'" alt="" style="width:110px;height:110px;border-radius:50%;object-fit:cover;border:4px solid '+(col||C.red)+';flex:none"><div style="display:flex;flex-direction:column;gap:4px"><span class="disp" style="font-weight:800;font-size:26px">'+esc(sub.name)+'</span><span class="mono" style="color:var(--rl);font-size:13px;letter-spacing:1.5px">'+esc(sub.id)+'</span><span style="font-weight:600;font-size:13px">'+esc(sub.dept||'')+'</span></div></div>':'';
function openRecord(h){
  const col=TAG[h.tag][2]===C.line?C.mu:TAG[h.tag][2];
  openModal('KARAR KAYDI · '+h.tag,'記録',
    face(h.s,col)+kv([['KİMLİK',h.label],['KARAR',h.tag,col],['ZAMAN',h.t],['BASELINE SAPMASI',h.dev.toFixed(4)],['GÖREVLİ','DNT-2207 · ÇELİK, O.'],['ARŞİV','ARŞ-0 · BLOK 448-93-11-0']])+
    '<div class="micro">Bu karar düğüm arşivine kalıcı olarak yazılmıştır. Görevli kararları Merkez ANK-06 tarafından denetlenir ve geri alınamaz.</div>',
    [{label:'KAPAT',kind:'ghost'}]);
}
function openUpcoming(i){
  const u=upcoming[i];
  openModal('SIRADAKİ DENEK · '+u.id,'待機',
    face(u,C.mu)+kv([['AD SOYAD',u.name],['DEPARTMAN',u.dept],['GÜZERGÂH',u.route[0]+' → DZC-81 → '+u.route[1]],['SEFER',u.dep+' → '+u.arr],['YETKİ',u.fields[1][1]],['ÖN TARAMA','BEKLENİYOR',C.mu]]),
    [{label:'KAPAT',kind:'ghost'},...(i>0?[{label:'SIRADA ÖNE AL',kind:'primary',primary:true,fn:()=>{upcoming.unshift(upcoming.splice(i,1)[0]);renderQueue();log('SYS',u.id+' sırada öne alındı');toast('SIRA GÜNCELLENDİ',C.cy);SFX.click();}}]:[])]);
}
function openHelp(){
  openModal('GÖREVLİ KILAVUZU','手引き',
    '<div class="micro" style="font-size:13px;color:var(--fg)">Her denek için Temel Çizgi Testi otomatik ilerler (7 adım). Test bitince sistem bir öneri verir; karar sende. Kuyruktaki satırlara, taranan belgelere ve yetki matrisindeki bölgelere tıklayarak ayrıntıları açabilirsin.</div>'+
    kv([['F1 · 1','ONAYLA (test bitince)'],['F2 · 2','BEKLET'],['F3 · 3','NEXUS-X UYGULA'],['F4 · 4','REDDET / KARANTİNA'],['P','TESTİ DURAKLAT / SÜRDÜR'],['M','SESİ AÇ / KAPAT'],['ESC','PENCEREYİ KAPAT'],['?','BU KILAVUZ']]),
    [{label:'ANLAŞILDI',kind:'primary',primary:true}]);
}

/* ================= akış ================= */
function loadNext(){
  cur=upcoming.shift();upcoming.push(gen());
  devTarget=cur.dev;devShown=0;step=0;testDone=false;decision=30;nexusLoad=cur.nx;nxApplied=0;busy=false;lastAlarmFor=null;
  $('uyT').textContent=pick(UYARAN);$('nxLast').textContent='AKTİF · SON 2099.10.02';
  renderId();renderQueue();renderSteps();renderNexus();paintStatus();
  log('SYS','R-2: '+cur.id+' çip oturumu açıldı (AES-256)');SFX.step();
}
function advance(){
  if(!started||busy||testDone||paused||modalOpen)return;
  step++;SFX.step();
  if(step===1)log('OK','MRZ sağlama [06] geçerli · OCR K06-3.7');
  if(step===2)log('OK','Yüz eşleşme '+fmt(cur.face,1)+'% · bilet '+cur.route[0]+'→DZC-81 doğrulandı');
  if(step===3)log('SYS','Baseline kaydı yüklendi · '+cur.fields[4][1]);
  if(step===4)log('SYS','Uyaran 05 iletildi · yanıt bekleniyor');
  if(step===5)log('SYS','Çapraz sorgu: SYNTEX-81 DZ-21 · Nexus-X DZ-99');
  if(step>=6){step=6;testDone=true;decision=30;const s=status(devTarget);
    log(s.k==='s'?'OK':s.k==='d'?'WARN':'ERR',s.k==='s'?'Test tamam: tüm kanallar eşik içinde':s.k==='d'?'Test tamam: mikro duygusal sapma '+devTarget.toFixed(4):'警告 システム違反 · sapma '+devTarget.toFixed(4));
    if(s.k==='v'&&lastAlarmFor!==cur.id){lastAlarmFor=cur.id;SFX.alarm();toast('警告 · İHLAL TESPİT EDİLDİ',C.rd);}
    else if(s.k==='s')SFX.ok();else SFX.hold();}
  renderSteps();paintStatus();
}
function stampShow(jp,tx,sub,col){
  const s=$('stamp');s.style.borderColor=col;s.style.color=col;$('stampJp').textContent=jp;$('stampTx').textContent=tx;$('stampSub').textContent=sub;s.classList.add('show');
  setTimeout(()=>s.classList.remove('show'),1600);
}
function press(id){const b=$(id);b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),160);}
function finish(tag,jp,tx,col){
  busy=true;paintStatus();
  history.push({t:clockStr(),s:cur,label:cur.short+' · '+cur.id.slice(0,8),tag,dev:devShown});
  cnt.wait=Math.max(6,cnt.wait-1+(Math.random()<.6?1:0));
  stampShow(jp,tx,cur.id,col);renderCounts();renderQueue();
  setTimeout(loadNext,1800);
}
function doApprove(){cnt.pass++;
  if(status(devShown).k==='v')log('ERR','İhlal durumunda onay · DNT-2207 ANK-06\'ya raporlandı');
  else log('OK','Geçiş onaylandı · '+cur.id+' → '+cur.route[1]);
  SFX.ok();finish('GEÇTİ','承認','GEÇTİ',C.cy);}
function doReject(){cnt.ret++;log('ERR','Geçiş reddedildi · '+cur.id+' KRN-9 karantinaya sevk');SFX.bad();finish('RET','違反','RET',C.rd);}
function act(k,auto){
  if(!started||busy||!cur||modalOpen&&!auto)return;
  const s=status(devShown);
  if(k==='A'){press('bA');
    if(!testDone){toast('TEST TAMAMLANMADAN ONAY VERİLEMEZ');SFX.err();return;}
    if(s.k==='v'){openModal('İHLAL DURUMUNDA ONAY','違反',
      '<div class="micro" style="font-size:14px;color:var(--fg)">'+esc(cur.id)+' temel çizgi eşiğini aştı (sapma '+devShown.toFixed(4)+'). Bu denek için onay vermek protokol dışıdır; karar ve görevli kimliğin (DNT-2207) ANK-06 İdari Merkezi\'ne raporlanacaktır.</div>',
      [{label:'VAZGEÇ',kind:'ghost',primary:true},{label:'YİNE DE ONAYLA',kind:'danger',fn:doApprove}]);SFX.alarm();return;}
    doApprove();
  }else if(k==='H'){press('bH');
    cnt.hold++;log('WARN',(auto?'Karar süresi aşıldı · otomatik bekletme':'Denek bekletmeye alındı · ikincil tarama sırası'));SFX.hold();finish('BEKLET','保留','BEKLET',C.am);
  }else if(k==='R'){press('bR');
    openModal('KARANTİNAYA SEVK','隔離 · KRN-9',
      '<div class="micro" style="font-size:14px;color:var(--fg)">'+esc(cur.name)+' ('+esc(cur.id)+') geçişi reddedilecek ve KRN-9 Karantina tesisine sevk edilecek. Kimlik askıya alınır, transit belgesi iptal edilir. Bu işlem geri alınamaz.</div>'+
      kv([['BASELINE SAPMASI',devShown.toFixed(4),s.c],['SİSTEM ÖNERİSİ',$('advice').textContent]]),
      [{label:'İPTAL',kind:'ghost'},{label:'SEVK ET',kind:'danger',primary:true,fn:doReject}]);SFX.err();
  }else if(k==='N'){press('bN');
    if(nexusLoad>=100){log('ERR','Nexus-X doz sınırı aşıldı · uygulama reddedildi');toast('DOZ SINIRI AŞILDI · UYGULAMA REDDEDİLDİ',C.rd);SFX.err();return;}
    nexusLoad=Math.min(100,nexusLoad+34);nxApplied++;cnt.nx++;devTarget=Math.max(.0018,devTarget*.32);
    $('nxLast').textContent='AKTİF · SON 2099.11.15';
    log('NXS','Nexus-X DZ-99 · 1 birim uygulandı · tekrar test');SFX.nexus();
    const f=$('pkflash');f.style.transition='none';f.style.opacity=.35;requestAnimationFrame(()=>{f.style.transition='opacity .8s';f.style.opacity=0;});
    step=2;testDone=false;decision=30;renderSteps();renderNexus();renderCounts();paintStatus();
    stampShow('合成','NEXUS-X','STANDART AYARLARA DÖNÜŞ',C.pk);
  }
}
$('bA').onclick=()=>act('A');$('bH').onclick=()=>act('H');$('bN').onclick=()=>act('N');$('bR').onclick=()=>act('R');

/* ================= kontroller ================= */
function setPause(v){paused=v;$('stage').classList.toggle('paused',v);$('cPause').setAttribute('aria-pressed',String(v));$('cPause').firstChild.textContent=v?'SÜRDÜR ':'DURAKLAT ';log('SYS',v?'Test görevli tarafından duraklatıldı':'Test sürdürüldü');}
function setSound(v){soundOn=v;$('cSound').setAttribute('aria-pressed',String(v));$('cSound').firstChild.textContent=v?'SES: AÇIK ':'SES: KAPALI ';if(v)SFX.click();}
$('cPause').onclick=()=>{SFX.click();setPause(!paused);};
$('cSound').onclick=()=>setSound(!soundOn);
$('cHelp').onclick=()=>{SFX.click();openHelp();};
$('nxImg').onclick=()=>{if(!started)return;SFX.click();openDoc(2);};
$('cFull').onclick=()=>{SFX.click();try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>toast('TAM EKRAN BU GÖRÜNÜMDE DESTEKLENMİYOR'));}catch(e){toast('TAM EKRAN BU GÖRÜNÜMDE DESTEKLENMİYOR');}};

addEventListener('keydown',e=>{
  if(!started){if(e.key==='Enter'&&!$('bootBtn').disabled){e.preventDefault();startSession();}return;}
  if(modalOpen){
    if(e.key==='Escape'){e.preventDefault();closeModal();}
    else if(e.key==='Enter'&&modalPrimary&&document.activeElement&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();modalPrimary.click();}
    else if(e.key==='Tab'){const f=[...document.querySelectorAll('#overlay button')];const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}
    return;
  }
  const m={F1:'A',F2:'H',F3:'N',F4:'R','1':'A','2':'H','3':'N','4':'R'}[e.key];
  if(m){e.preventDefault();act(m);return;}
  if(e.key==='p'||e.key==='P'){setPause(!paused);}
  else if(e.key==='m'||e.key==='M'){setSound(!soundOn);}
  else if(e.key==='?'){openHelp();}
});

/* ================= döngüler ================= */
setInterval(advance,1700);
setInterval(()=>{
  $('clock').textContent=clockStr();
  // sonraki sefer geri sayımı
  const d=new Date();const left=600-((d.getMinutes()%10)*60+d.getSeconds());$('nextDep').textContent=pad(Math.floor(left/60))+':'+pad(left%60);
  if(!started||!cur)return;
  if(testDone&&!busy&&!paused&&!modalOpen){decision--;if(decision===10){toast('KARAR İÇİN 10 SANİYE',C.am);SFX.err();}if(decision<=0){act('H',true);}}
  $('timer').textContent=testDone?('00:'+pad(Math.max(0,decision))+' / 00:30'):'— / 00:30';
  $('timer').style.color=testDone&&decision<=10?C.rd:'';
  const q=document.querySelector('.qrow.cur span:nth-child(2)');if(q&&!busy)q.textContent=clockStr();
},1000);
setInterval(()=>{
  if(!cur||paused)return;
  const k=testDone?1:Math.min(1,step/4.5);
  devShown+=(devTarget*k-devShown)*.45;
  const shown=Math.max(0,devShown+(devShown>0?rnd(-.0007,.0007):0));
  $('dev').textContent=shown.toFixed(4);
  const dv=devShown;
  const v=[70+dv*400+rnd(-1.5,1.5),4+dv*70+rnd(-.15,.15),3.8+dv*20+rnd(-.05,.05),.08+dv*5+rnd(-.01,.01)];
  const b=[72,4.1,3.8,.09];
  $('m0').textContent=Math.round(v[0]);$('m1').textContent=fmt(v[1],1);$('m2').textContent=fmt(v[2],1);$('m3').textContent=fmt(v[3],2);
  const dc=dv<.02?C.mu:(dv<.04?C.am:C.rd);
  [0,1,2,3].forEach(i=>{const dd=v[i]-b[i];const el=$('d'+i);el.textContent='Δ '+(dd>=0?'+':'')+(i===0?Math.round(dd):fmt(dd,i===3?2:1))+(i===0?' TEMELE GÖRE':'');el.style.color=dc;});
  $('lat').textContent=step>=4?fmt(.35+dv*13+rnd(-.03,.03),2)+' sn':'— sn';
  paintStatus();
},450);
// ortam olayları
const AMB=[['SYS','Sensör dizisi ping · 6/6 kanal · 3 ms'],['SYS','Orbital sefer ORB-H-17 DZC-81 peronuna yanaştı'],['OK','Arşiv yazımı blok 448-93-11-0 tamam'],['SYS','SYNTEX-81 sevkiyatı DZ-TAR → DZC-81 kabul edildi'],['WARN','Şerit D: sensör kalibrasyon sapması · teknisyen çağrıldı'],['SYS','ANK-06 senkron · AUTH 10938-X yenilendi'],['SYS','Sismik izleme: fay hattı stabil · 0.0012 g'],['NXS','KRN-9: 2 birey standart ayarlara döndürüldü']];
(function amb(){setTimeout(()=>{if(started&&!paused){const a=pick(AMB);log(a[0],a[1]);if(Math.random()<.4){cnt.wait=Math.max(6,cnt.wait+(Math.random()<.5?1:-1));renderCounts();}}amb();},rnd(6000,12000));})();

$('base').setAttribute('points',(()=>{const a=[];for(let i=0;i<=200;i++)a.push(i*4+','+(115+Math.sin(i*.32)*7+Math.sin(i*.09)*3).toFixed(1));return a.join(' ');})());
function frame(){
  if(!paused)phase+=.12;
  const amp=6+Math.min(60,devShown*560);const a=[];
  for(let i=0;i<=180;i++){const t=i+phase*3;
    let y=115+Math.sin(t*.32)*(7+amp*.35)+Math.sin(t*.13+1.3)*amp*.45+Math.sin(t*1.7)*amp*.12;
    if(Math.floor(t)%23===11)y-=amp*.9;
    a.push(i*4+','+Math.max(4,Math.min(226,y)).toFixed(1));}
  $('wave').setAttribute('points',a.join(' '));
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ================= açılış ================= */
const BOOT=['> DZC/OS 8.1.4 · TERMİNAL T-07 ŞERİT B','> TRANS-METRO ORBİTAL AĞI ............ BAĞLANDI','> ANK-06 İDARİ MERKEZ SENKRON ......... AUTH 10938-X','> BİYO-SENSÖR DİZİSİ .................. 6/6 KANAL','> OCR / MRZ OKUYUCU R-2 ............... HAZIR','> NEXUS-X DZ-99 STOK ................... 412 BİRİM','> BİRBİRİYLE BAĞLANTILI HÜCRELER PROTOKOLÜ · AKTİF','> GÖREVLİ DNT-2207 · OTURUM BEKLENİYOR_'];
(function bootType(i){if(i>=BOOT.length){$('bootBtn').disabled=false;$('bootBtn').focus();return;}$('bootLog').textContent+=(i?'\n':'')+BOOT[i];setTimeout(()=>bootType(i+1),i===0?300:260);})(0);
function startSession(){
  if(started)return;started=true;
  setSound(true);SFX.ok();
  $('boot').classList.add('gone');setTimeout(()=>$('boot').style.display='none',600);
  [['SYS','Terminal T-07 açıldı · görevli DNT-2207'],['SYS','SYS-CHK-99.8 · Merkez ANK-06 senkron'],['OK','TRANS-METRO ORBİTAL bağlantısı · 14 ms']].forEach(l=>log(l[0],l[1]));
  loadNext();
  setTimeout(()=>toast(document.documentElement.classList.contains('mob')?'KARAR TUŞLARI ALTTA · KILAVUZ ÜSTTE':'KILAVUZ İÇİN [?] · KISAYOLLAR F1–F4',C.cy),900);
}
$('bootBtn').onclick=startSession;
$('clock').textContent=clockStr();renderCounts();
})();
