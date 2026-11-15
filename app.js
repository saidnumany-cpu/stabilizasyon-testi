(function(){
const C={cy:'#5CCFE0',or:'#F4703F',pk:'#FF4FB0',rd:'#FF3341',am:'#FFB020',mu:'#9AA0A6',fg:'#E8E6E1',line:'#262A30',bg:'#08090B',red:'#E8202A'};
const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,'0');
const clockStr=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds())};
const fmt=(x,d)=>x.toFixed(d).replace('.',',');
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- fit to screen ---------- */
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);$('stage').style.transform='scale('+s+')';}
addEventListener('resize',fit);fit();

/* ---------- subjects ---------- */
const ZN=[['IST-34','ENDÜSTRİ'],['ANK-06','İDARİ'],['DZC-81','TRANSİT'],['DZ-TAR','S. TARIM'],['SİSMİK','ALTYAPI'],['ORB-H','ORBİTAL'],['ARŞ-0','ARŞİV'],['KRN-9','KARANTİNA']];
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
  let l1=('IDDZC81<<'+TR2A(given).replace(/ /g,'<')+'<'+TR2A(sur)).padEnd(44,'<').slice(0,44);
  let l2=(idc.replace(/[^A-Z0-9]/g,'').slice(0,12)+'9TUR'+valid).padEnd(42,'<').slice(0,42)+'06';
  return l1+'\n'+l2;
}
function gen(){
  const f=pick(FN),m=pick(MN),s=pick(SN),dp=pick(DEPTS);
  const given=(f+(m?' '+m:''));const ini=TR2A(f[0]+(m?m[0]:'X')+s[0]);
  const num=String(Math.floor(rnd(100,9999))).padStart(4,'0');
  const id='DZC-'+num+'-'+ini;
  const r=Math.random();const dev=r<.5?rnd(.002,.018):(r<.8?rnd(.021,.038):rnd(.046,.12));
  const rt=pick(ROUTES);const h=Math.floor(rnd(17,20)),mi=Math.floor(rnd(0,5))*10;
  const sy=Math.floor(rnd(2098,2100)),ey=sy+2;
  return {id,name:given+' '+s,short:s+', '+f+(m?' '+m[0]+'.':''),given,sur:s,photo:false,
    dept:dp.d,fields:[['GÖREV',dp.g],['YETKİ DÜZEYİ',dp.y],['KAN GRUBU',pick(['0 Rh+','A Rh+','B Rh-','AB Rh+','0 Rh-'])],['SENTETİK TAKVİYE',pick(['AKTİF','AKTİF','ASKIDA'])],['SİSTEM SERİ NO','SYS-'+Math.floor(rnd(1000,9999))+'-'+TR2A(s.slice(0,3))+'-'+Math.floor(rnd(100,999))],['GEÇERLİLİK',sy+'.'+pad(Math.floor(rnd(1,12)))+'.'+pad(Math.floor(rnd(1,28)))+' – '+ey+'.'+pad(Math.floor(rnd(1,12)))+'.'+pad(Math.floor(rnd(1,28)))]],
    zones:dp.z,dev,face:rnd(91,99.4),route:rt,dep:pad(h)+'.'+pad(mi),arr:pad(h+1)+'.'+pad((mi+30)%60),
    mrz:mkMrz(given,s,id,sy+'1104M'+ey+'1103'),nx:Math.floor(rnd(0,40))};
}
const ARAS={id:'DZC-8109-AKV',name:'ARAS KAAN VARDAR',short:'VARDAR, ARAS K.',given:'ARAS KAAN',sur:'VARDAR',photo:true,
  dept:'SİSMİK KALİBRASYON VE ALTYAPI DENETİMİ',
  fields:[['GÖREV','BAŞ TEKNİKER / FAZ-2'],['YETKİ DÜZEYİ','SEVİYE 4 · KISITLI BÖLGE'],['KAN GRUBU','0 Rh+'],['SENTETİK TAKVİYE','AKTİF'],['SİSTEM SERİ NO','SYS-8489-ARV-990'],['GEÇERLİLİK','2099.11.04 – 2101.11.03']],
  zones:[1,-1,1,0,1,1,-1,-1],dev:.0362,face:97.2,route:['IST-34','ANK-06'],dep:'17.50',arr:'18.20',
  mrz:'IDDZC81<<ARAS<KAAN<VARDAR<<<<<<<<<<<<<<<<<<\nDZ8109AKV9TUR20991104M21011103<<<<<<<<<<<<06',nx:8};

let upcoming=[ARAS,gen(),gen(),gen()];
let history=[['17:46:12','YÜCEL, SAİD N. · IST-34','GEÇTİ'],['17:47:40','DZC-0377-1983-C','RET'],['17:48:18','DZC-0102-6625-B','NEXUS-X'],['17:48:55','DZC-0640-0071-C','BEKLET']];
let cnt={pass:1207,ret:38,hold:61,nx:23,wait:14};
let cur=null,devTarget=0,devShown=0,step=0,testDone=false,decision=30,nexusLoad=0,busy=false,nxApplied=0,phase=0;

/* ---------- logs ---------- */
const LV={OK:C.cy,WARN:C.am,ERR:C.rd,SYS:C.mu,NXS:C.pk};
function log(lv,msg){
  const el=document.createElement('div');el.className='logl new';
  el.innerHTML='<span class="mu"></span><span></span><span></span>';
  el.children[0].textContent=clockStr();el.children[1].textContent=lv;el.children[1].style.color=LV[lv];el.children[2].textContent=msg;
  const box=$('logs');box.appendChild(el);while(box.children.length>14)box.removeChild(box.firstChild);
}

/* ---------- status ---------- */
function status(dv){
  if(!testDone&&step<4)return{c:C.am,t:'ÖLÇÜM',jp:'測定',n:'TEST SÜRÜYOR · DENEK SABİT DURMALI',k:'m'};
  if(dv<.02)return{c:C.cy,t:'STABİL',jp:'安定',n:'TÜM KANALLAR EŞİK İÇİNDE · GEÇİŞE UYGUN',k:'s'};
  if(dv<.04)return{c:C.am,t:'SAPMA',jp:'逸脱',n:'MİKRO DUYGUSAL SAPMA · RİTİM DÜZENSİZ',k:'d'};
  return{c:C.rd,t:'İHLAL',jp:'違反',n:'EŞİK AŞILDI · GEÇİŞ HAKKI ASKIDA',k:'v'};
}
let lastK='';
function paintStatus(){
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
  if(testDone&&s.k!==lastK){lastK=s.k;}
  renderDocs(s);
}

/* ---------- renderers ---------- */
function renderId(){
  $('name').textContent=cur.name;$('pid').textContent=cur.id;$('dept').textContent=cur.dept;
  $('face').textContent=fmt(cur.face,1);
  $('photo').style.display=cur.photo?'block':'none';$('silh').style.display=cur.photo?'none':'block';
  const sg=cur.sur.charAt(0)+cur.sur.slice(1,3).toLocaleLowerCase('tr');$('sig').textContent=cur.photo?'Arv':sg;
  $('fields').innerHTML='';cur.fields.forEach(([k,v])=>{const d=document.createElement('div');d.className='field';d.innerHTML='<span class="k"></span><span class="v"></span>';d.children[0].textContent=k;d.children[1].textContent=v;$('fields').appendChild(d);});
  $('mrz').textContent=cur.mrz;
  // barcode
  const bc=$('barcode');bc.innerHTML='';let seed=0;for(const ch of cur.id)seed=(seed*31+ch.charCodeAt(0))%9973;
  for(let i=0;i<56;i++){seed=(seed*73+17)%9973;const w=1+seed%3,m=1+(seed>>2)%3;const b=document.createElement('div');b.style.cssText='height:30px;width:'+w+'px;margin-right:'+m+'px;background:'+(i<32?C.fg:C.red);bc.appendChild(b);}
  const g=TR2A(cur.given).replace(/ /g,''),s=TR2A(cur.sur);$('barTxt').innerHTML='';$('barTxt').append(g);const sp=document.createElement('span');sp.style.color='#FF4552';sp.textContent=s;$('barTxt').appendChild(sp);
  // zones
  $('zones').innerHTML='';ZN.forEach(([c,n],i)=>{const m=cur.zones[i];const d=document.createElement('div');d.className='zone';
    d.innerHTML='<span class="disp" style="font-weight:800;font-size:13px;line-height:1"></span><span style="font-size:13px;line-height:1"></span><span class="mono mu" style="font-size:8.5px;letter-spacing:.3px"></span>';
    d.children[0].textContent=c;d.children[1].textContent=m===1?'■':m===0?'□':'×';d.children[1].style.color=m===1?C.cy:m===0?C.am:C.rd;d.children[2].textContent=n;$('zones').appendChild(d);});
  $('route').textContent=cur.route[0]+' → DZC-81 → '+cur.route[1];$('times').textContent=cur.dep+' → '+cur.arr;
  $('pending').textContent=cur.id+' · '+cur.short;
  $('sess').textContent=cur.id.slice(4,8)+'-C';$('baseRef').textContent=cur.photo?'SYS-8489':cur.fields[4][1].slice(0,8);
}
const TAG={'GEÇTİ':[ 'transparent',C.cy,C.cy],'BEKLET':['transparent',C.am,C.am],'NEXUS-X':['transparent',C.pk,C.pk],'RET':[C.rd,C.bg,C.rd],'SIRADA':['transparent',C.mu,C.line],'İŞLEMDE':[C.fg,C.bg,C.fg]};
function renderQueue(){
  const rows=history.slice(-4).map(h=>[h[0],h[1],h[2],false]);
  rows.push(['İŞLEMDE',cur.short+' · '+cur.id.slice(0,8),'İŞLEMDE',true]);
  upcoming.slice(0,2).forEach(u=>rows.push(['—',u.id,'SIRADA',false]));
  const q=$('queue');q.innerHTML='';
  rows.forEach((r,i)=>{const d=document.createElement('div');d.className='qrow'+(r[3]?' cur':'');
    d.innerHTML='<span class="mono mu"></span><span class="mono"></span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500"></span><span class="tag"></span>';
    d.children[0].textContent=pad(i+1);d.children[1].textContent=r[3]?clockStr().slice(0,8):r[0];d.children[2].textContent=r[1];
    const t=TAG[r[2]];d.children[3].textContent=r[2];d.children[3].style.background=t[0];d.children[3].style.color=t[1];d.children[3].style.borderColor=t[2];
    q.appendChild(d);});
  $('qWait').textContent=cnt.wait;$('cQueue').textContent=cnt.wait;
}
function renderDocs(s){
  const read=Math.min(4,Math.max(0,step-1));
  const nxState=!testDone?'BEKLENİYOR':(s.k==='s'?'STOKTA · GEREKMİYOR':(s.k==='d'?'HAZIRLANDI · 1 BİRİM':'ZORUNLU UYGULAMA'));
  const docs=[
    ['BİLET','軌道運行',C.cy,'Merkezi Transit Geçiş Belgesi',cur.route[0]+' → DZC-81 · '+cur.dep+'/'+cur.arr,'DOĞRULANDI',C.cy],
    ['KİMLİK','制限区域',C.red,'Personel Erişim Kartı',cur.id+' · '+cur.fields[1][1].split(' · ')[0],'承認 MÜHÜR GEÇERLİ',C.cy],
    ['NEXUS-X','ネクサス',C.pk,'Nöro Stabilizatör','HASAT KODU DZ-99 · '+nxApplied+' UYG.',nxState,testDone?s.c:C.mu],
    ['SYNTEX-81','合成',C.or,'Sentetik Protein Rasyonu','HASAT KODU DZ-21 · %88,4','TÜKETİLDİ 3/3',C.cy]
  ];
  const box=$('docs');box.innerHTML='';
  docs.forEach((d,i)=>{const on=i<read;const el=document.createElement('div');el.className='doc';el.style.borderTop='4px solid '+(on?d[2]:C.line);el.style.opacity=on?1:.45;
    el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:baseline"><span class="disp" style="font-weight:800;font-size:15px"></span><span class="jp mu" style="font-size:12px"></span></div><span style="font-size:11.5px;font-weight:600;line-height:1.2"></span><span class="mono mu" style="font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></span><span class="mono" style="font-size:10px;letter-spacing:1px"></span>';
    const c=el.querySelectorAll('span');c[0].textContent=d[0];c[0].style.color=on?d[2]:C.mu;c[1].textContent=d[1];c[2].textContent=d[3];c[3].textContent=d[4];c[4].textContent=on?d[5]:'TARANIYOR…';c[4].style.color=on?d[6]:C.mu;box.appendChild(el);});
  $('docCount').textContent=read+'/4 OKUNDU';
}
const STEPS=['TANIM','OCR / MRZ','KALİBRASYON','HAFIZA','UYARAN','ÇAPRAZ','承認 ONAY'];
const UYARAN=['«SIRA. SINIR. SÜREKLİLİK.»','«HÜCRE. HÜCRE. HÜCRE.»','«BİRBİRİYLE. BAĞLANTILI. HÜCRELER. SİSTEM.»','«BİREY YOK. YALNIZCA SİSTEM.»','«İTAAT. RİTİM. STANDART.»'];
function renderSteps(){
  const b=$('steps');b.innerHTML='';
  STEPS.forEach((t,i)=>{const d=document.createElement('div');d.className='step'+(i<step?' done':i===step?' on':'');d.innerHTML='<span class="mono" style="font-size:10px;letter-spacing:1px"></span><span></span>';d.children[0].textContent=pad(i+1);d.children[1].textContent=t;b.appendChild(d);});
  $('cyc').textContent=Math.min(step+1,7);
}
function renderNexus(){$('nxLoad').style.width=nexusLoad+'%';$('nxLoadT').textContent=nexusLoad+'%';}
function renderCounts(){$('cPass').textContent=cnt.pass.toLocaleString('tr-TR');$('cRet').textContent=cnt.ret;$('cHold').textContent=cnt.hold;$('cNx').textContent=cnt.nx;}

/* ---------- flow ---------- */
function loadNext(){
  cur=upcoming.shift();upcoming.push(gen());
  devTarget=cur.dev;devShown=0;step=0;testDone=false;decision=30;nexusLoad=cur.nx;nxApplied=0;busy=false;lastK='';
  $('uyT').textContent=pick(UYARAN);
  renderId();renderQueue();renderSteps();renderNexus();paintStatus();setBtns(true);
  log('SYS','R-2: '+cur.id+' çip oturumu açıldı (AES-256)');
}
function advance(){
  if(busy||testDone)return;
  step++;
  if(step===1)log('OK','MRZ sağlama [06] geçerli · OCR K06-3.7');
  if(step===2)log('OK','Yüz eşleşme '+fmt(cur.face,1)+'% · bilet '+cur.route[0]+'→DZC-81 doğrulandı');
  if(step===3)log('SYS','Baseline kaydı yüklendi · '+cur.fields[4][1]);
  if(step===4){$('uyN').textContent='05';log('SYS','Uyaran 05 iletildi · yanıt bekleniyor');}
  if(step===5)log('SYS','Çapraz sorgu: SYNTEX-81 DZ-21 · Nexus-X DZ-99');
  if(step>=6){step=6;testDone=true;const s=status(devTarget);
    log(s.k==='s'?'OK':s.k==='d'?'WARN':'ERR',s.k==='s'?'Test tamam: tüm kanallar eşik içinde':s.k==='d'?'Test tamam: mikro duygusal sapma '+devTarget.toFixed(4):'警告 システム違反 · sapma '+devTarget.toFixed(4));}
  renderSteps();paintStatus();
}
function setBtns(on){['bA','bH','bN','bR'].forEach(id=>$(id).disabled=!on);}
function stampShow(jp,tx,sub,col){
  const s=$('stamp');s.style.borderColor=col;s.style.color=col;$('stampJp').textContent=jp;$('stampTx').textContent=tx;$('stampSub').textContent=sub;s.classList.add('show');
  setTimeout(()=>s.classList.remove('show'),1300);
}
function finish(tag,jp,tx,col){
  busy=true;setBtns(false);history.push([clockStr(),cur.short+' · '+cur.id.slice(0,8),tag]);cnt.wait=Math.max(6,cnt.wait-1+(Math.random()<.6?1:0));
  stampShow(jp,tx,cur.id,col);renderCounts();
  setTimeout(loadNext,1500);
}
function act(k){
  if(busy||!cur)return;
  const s=status(devShown);
  if(k==='A'){
    if(!testDone){log('WARN','Test tamamlanmadan onay verilemez');return;}
    cnt.pass++;
    if(s.k==='v')log('ERR','İhlal durumunda onay · DNT-2207 ANK-06\'ya raporlandı');
    else log('OK','Geçiş onaylandı · '+cur.id+' → '+cur.route[1]);
    finish('GEÇTİ','承認','GEÇTİ',C.cy);
  }else if(k==='H'){
    cnt.hold++;log('WARN','Denek bekletmeye alındı · ikincil tarama sırası');finish('BEKLET','保留','BEKLET',C.am);
  }else if(k==='R'){
    cnt.ret++;log('ERR','Geçiş reddedildi · KRN-9 karantinaya sevk');finish('RET','違反','RET',C.rd);
  }else if(k==='N'){
    if(nexusLoad>=100){log('ERR','Nexus-X doz sınırı aşıldı · uygulama reddedildi');return;}
    nexusLoad=Math.min(100,nexusLoad+34);nxApplied++;cnt.nx++;devTarget=Math.max(.0018,devTarget*.32);
    $('nxLast').textContent='AKTİF · SON 2099.11.15';
    log('NXS','Nexus-X DZ-99 · 1 birim uygulandı · tekrar test');
    const f=$('pkflash');f.style.transition='none';f.style.opacity=.35;requestAnimationFrame(()=>{f.style.transition='opacity .8s';f.style.opacity=0;});
    step=2;testDone=false;decision=30;lastK='';renderSteps();renderNexus();renderCounts();paintStatus();
    stampShow('合成','NEXUS-X','STANDART AYARLARA DÖNÜŞ',C.pk);
  }
}
$('bA').onclick=()=>act('A');$('bH').onclick=()=>act('H');$('bN').onclick=()=>act('N');$('bR').onclick=()=>act('R');
addEventListener('keydown',e=>{
  const m={F1:'A',F2:'H',F3:'N',F4:'R','1':'A','2':'H','3':'N','4':'R'}[e.key];
  if(m){e.preventDefault();act(m);}
});

/* ---------- loops ---------- */
setInterval(advance,1700);
setInterval(()=>{
  $('clock').textContent=clockStr();
  if(testDone&&!busy){decision--;if(decision<=0){log('WARN','Karar süresi aşıldı · otomatik bekletme');act('H');}}
  $('timer').textContent=testDone?('00:'+pad(Math.max(0,decision))+' / 00:30'):'— / 00:30';
  $('timer').style.color=testDone&&decision<=10?C.rd:'';
  if(cur&&!busy){const q=document.querySelector('.qrow.cur span:nth-child(2)');if(q)q.textContent=clockStr();}
},1000);
setInterval(()=>{
  if(!cur)return;
  const k=testDone?1:Math.min(1,step/4.5);
  const goal=devTarget*k;devShown+=(goal-devShown)*.45;
  const shown=Math.max(0,devShown+rnd(-.0007,.0007)*(devShown>0?1:0));
  $('dev').textContent=shown.toFixed(4);
  const dv=devShown;
  const v=[70+dv*400+rnd(-1.5,1.5),4+dv*70+rnd(-.15,.15),3.8+dv*20+rnd(-.05,.05),.08+dv*5+rnd(-.01,.01)];
  const b=[72,4.1,3.8,.09];
  $('m0').textContent=Math.round(v[0]);$('m1').textContent=fmt(v[1],1);$('m2').textContent=fmt(v[2],1);$('m3').textContent=fmt(v[3],2);
  const dc=dv<.02?C.mu:(dv<.04?C.am:C.rd);
  [0,1,2,3].forEach(i=>{const d=v[i]-b[i];const el=$('d'+i);el.textContent='Δ '+(d>=0?'+':'')+(i===0?Math.round(d):fmt(d,i===3?2:1))+(i===0?' TEMELE GÖRE':'');el.style.color=dc;});
  $('lat').textContent=step>=4?fmt(.35+dv*13+rnd(-.03,.03),2)+' sn':'— sn';
  paintStatus();
},450);

let basePts='';{const a=[];for(let i=0;i<=200;i++){const x=i*4;a.push(x+','+(115+Math.sin(i*.32)*7+Math.sin(i*.09)*3).toFixed(1));}basePts=a.join(' ');$('base').setAttribute('points',basePts);}
function frame(){
  phase+=.12;
  const amp=6+Math.min(60,devShown*560);
  const a=[];
  for(let i=0;i<=180;i++){const x=i*4;const t=i+phase*3;
    let y=115+Math.sin(t*.32)*(7+amp*.35)+Math.sin(t*.13+1.3)*amp*.45+Math.sin(t*1.7)*amp*.12;
    if(Math.floor(t)%23===11)y-=amp*.9;
    a.push(x+','+Math.max(4,Math.min(226,y)).toFixed(1));}
  $('wave').setAttribute('points',a.join(' '));
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

[['SYS','Terminal T-07 açıldı · görevli DNT-2207'],['SYS','SYS-CHK-99.8 · AUTH 10938-X · Merkez ANK-06 senkron'],['OK','TRANS-METRO ORBİTAL bağlantısı · 14 ms']].forEach(l=>log(l[0],l[1]));
$('clock').textContent=clockStr();renderCounts();loadNext();
})();
