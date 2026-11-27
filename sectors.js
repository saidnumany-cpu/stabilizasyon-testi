/* DZC-81 · Sektör Ağı
   Homeostaz evreninde şehir adları silinmiştir; her il KISALTMA-PLAKA koduyla
   yönetilen bir sektördür. "Eski ad" yalnızca arşiv kaydı olarak tutulur. */
(function(){
'use strict';
const TYPES={
  ENDUSTRI:['ENDÜSTRİ','Endüstriyel Bölge'],
  IDARI:['İDARİ','İdari Merkez'],
  TRANSIT:['TRANSİT','Transit Düğüm'],
  TARIM:['TARIM','Sentetik Tarım Sektörü'],
  LIMAN:['LİMAN','Liman ve Lojistik Sektörü'],
  MADEN:['MADEN','Maden Çıkarım Sektörü'],
  ENERJI:['ENERJİ','Enerji Üretim Sektörü'],
  SINIR:['SINIR','Sınır Denetim Sektörü'],
  REK:['REKREASYON','Rekreasyon Kontrol Bölgesi']
};
// [kısaltma, plaka, eski ad, tip, özel ad]
const RAW=[
 ['ADA',1,'Adana','TARIM'],['ADY',2,'Adıyaman','ENERJI'],['AFY',3,'Afyonkarahisar','MADEN'],['AGR',4,'Ağrı','SINIR'],
 ['AMS',5,'Amasya','TARIM'],['ANK',6,'Ankara','IDARI','İdari Merkez Kompleksi'],['ANT',7,'Antalya','REK'],['ART',8,'Artvin','SINIR'],
 ['AYD',9,'Aydın','TARIM'],['BLK',10,'Balıkesir','TARIM'],['BLC',11,'Bilecik','ENDUSTRI'],['BNG',12,'Bingöl','ENERJI'],
 ['BTL',13,'Bitlis','TARIM'],['BOL',14,'Bolu','TRANSIT'],['BRD',15,'Burdur','TARIM'],['BRS',16,'Bursa','ENDUSTRI'],
 ['CNK',17,'Çanakkale','LIMAN'],['CKR',18,'Çankırı','TARIM'],['CRM',19,'Çorum','TARIM'],['DNZ',20,'Denizli','ENDUSTRI'],
 ['DYB',21,'Diyarbakır','IDARI','Bölgesel İdare Merkezi'],['EDR',22,'Edirne','SINIR'],['ELZ',23,'Elazığ','MADEN'],['ERZ',24,'Erzincan','TRANSIT'],
 ['ERM',25,'Erzurum','TRANSIT'],['ESK',26,'Eskişehir','ENDUSTRI'],['GAZ',27,'Gaziantep','ENDUSTRI'],['GRS',28,'Giresun','TARIM'],
 ['GMS',29,'Gümüşhane','MADEN'],['HKR',30,'Hakkari','SINIR'],['HTY',31,'Hatay','SINIR'],['ISP',32,'Isparta','TARIM'],
 ['MRS',33,'Mersin','LIMAN'],['IST',34,'İstanbul','ENDUSTRI','Endüstriyel Bölge'],['IZM',35,'İzmir','LIMAN'],['KRS',36,'Kars','SINIR'],
 ['KST',37,'Kastamonu','TARIM'],['KYS',38,'Kayseri','ENDUSTRI'],['KRK',39,'Kırklareli','SINIR'],['KSH',40,'Kırşehir','TARIM'],
 ['KOC',41,'Kocaeli','ENDUSTRI'],['KON',42,'Konya','TARIM'],['KUT',43,'Kütahya','MADEN'],['MLT',44,'Malatya','TARIM'],
 ['MNS',45,'Manisa','ENDUSTRI'],['KMR',46,'Kahramanmaraş','ENDUSTRI'],['MRD',47,'Mardin','SINIR'],['MUG',48,'Muğla','REK'],
 ['MUS',49,'Muş','TARIM'],['NEV',50,'Nevşehir','REK'],['NIG',51,'Niğde','TARIM'],['ORD',52,'Ordu','TARIM'],
 ['RIZ',53,'Rize','TARIM'],['SKR',54,'Sakarya','ENDUSTRI'],['SMS',55,'Samsun','LIMAN'],['SRT',56,'Siirt','ENERJI'],
 ['SNP',57,'Sinop','LIMAN'],['SVS',58,'Sivas','TRANSIT'],['TKD',59,'Tekirdağ','ENDUSTRI'],['TOK',60,'Tokat','TARIM'],
 ['TRB',61,'Trabzon','LIMAN'],['TNC',62,'Tunceli','ENERJI'],['SUR',63,'Şanlıurfa','TARIM'],['USK',64,'Uşak','ENDUSTRI'],
 ['VAN',65,'Van','SINIR'],['YZG',66,'Yozgat','TARIM'],['ZNG',67,'Zonguldak','MADEN'],['AKS',68,'Aksaray','TRANSIT'],
 ['BAY',69,'Bayburt','MADEN'],['KRM',70,'Karaman','TARIM'],['KKL',71,'Kırıkkale','ENDUSTRI'],['BTM',72,'Batman','ENERJI'],
 ['SRN',73,'Şırnak','SINIR'],['BRT',74,'Bartın','LIMAN'],['ARD',75,'Ardahan','SINIR'],['IGD',76,'Iğdır','SINIR'],
 ['YLV',77,'Yalova','LIMAN'],['KRB',78,'Karabük','ENDUSTRI'],['KLS',79,'Kilis','SINIR'],['OSM',80,'Osmaniye','ENDUSTRI'],
 ['DZC',81,'Düzce','TRANSIT','Geçiş ve Kontrol Düğümü']
];
const SECTORS=RAW.map(([ab,n,old,t,special])=>({
  code:ab+'-'+String(n).padStart(2,'0'),abbr:ab,plate:n,old,type:t,
  typeLabel:TYPES[t][0],name:special||TYPES[t][1]
}));
const BY=Object.fromEntries(SECTORS.map(s=>[s.code,s]));
window.DZCSectors={list:SECTORS,types:TYPES,get:c=>BY[c]||null,
  // rastgele güzergâh: yarısı IST-34 ⇄ ANK-06 koridoru, kalanı tüm ağdan
  route(rnd){
    const r=rnd||Math.random;
    const pool=SECTORS.filter(s=>s.code!=='DZC-81');
    const pick=()=>pool[Math.floor(r()*pool.length)].code;
    if(r()<.5){return r()<.5?['IST-34','ANK-06']:['ANK-06','IST-34'];}
    let a=pick(),b=pick();while(b===a)b=pick();
    if(r()<.4)b=r()<.5?'IST-34':'ANK-06';
    return [a,b];
  }};
})();
