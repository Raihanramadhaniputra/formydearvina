(function(){
  /* ===== Isi halaman: ganti di sini ===== */
  var CONFIG = {
    herName: "Kamu",
    dateLabel: "",              /* contoh: "26 . 09 . 2026" (kosong = tidak tampil) */
    since: "",                  /* contoh: "2024-09-26" (kosong = penghitung hari tidak tampil) */
    letter: [
      "Happy mensiversary, sayang. Makasih ya sudah memilih aku, setiap hari, bahkan di hari-hari ketika aku susah untuk dicintai.",
      "Bersamamu, hal-hal kecil jadi punya arti: makan bersama sederhana, obrolan sebelum tidur, tawa yang entah dari mana asalnya, date astrea",
      "Aku ingin terus ada di sampingmu, belajar, tumbuh, dan selalu pulang ke kamu. I love you so much."
    ],
    captions: ["Awal kita","Hari yang seru","Tertawa bareng","Jalan-jalan","Momen favorit","Hari biasa","Bersamamu","Sampai sekarang"],
    playlistName: "Our Playlist",
    video: "foto/video.mp4",    /* taruh video di folder foto dengan nama ini (mp4 paling aman) */
    youtube: "",                /* atau isi ID video YouTube, contoh: "dQw4w9WgXcQ" (kalau diisi, video file diabaikan) */
    couponSub: "Berlaku kapan saja kamu mau",
    gifts: [
      {t:"", d:""},
      {t:"", d:""},
      {t:"", d:"mengenal dirimu lebih jauh"}
    ]
  };
  /* FOTO: tidak perlu diisi di sini.
     Cukup taruh foto di folder "foto" dengan nama persis seperti daftar di README
     (heart.jpg, tilt.jpg, strip1.jpg, j1.jpg, dst). Foto akan terpasang otomatis.
     Kalau mau pakai nama file lain, isi di bawah, contoh:  heart: "foto/berdua.jpg"  */
  var PHOTOS = {};
  /* ===================================== */

  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  /* ---- build content ---- */
  var rots = [-4,3,-2,4,3,-3,2,-4];
  var jg = $('#jGrid');
  CONFIG.captions.slice(0,8).forEach(function(cap,i){
    var f = document.createElement('figure');
    f.className = 'pola'; f.style.setProperty('--r', rots[i%rots.length]+'deg');
    f.innerHTML = '<div data-photo="j'+(i+1)+'" data-label="Foto '+(i+1)+'" data-caption="'+esc(cap)+'"></div><figcaption class="pola-cap">'+esc(cap)+'</figcaption>';
    jg.appendChild(f);
  });
  $('#dateLabel').textContent = CONFIG.dateLabel || '';
  if(!CONFIG.dateLabel) $('#dateLabel').style.display='none';
  $('#momentTitle').textContent = 'Untuk ' + CONFIG.herName;
  $('#letter').innerHTML = CONFIG.letter.map(function(p){return '<p>'+esc(p)+'</p>'}).join('');
  $('#plTitle').textContent = CONFIG.playlistName;
  /* ---- video ---- */
  function buildVideo(){
    var box = $('#videoFrame'); if(!box) return;
    if(CONFIG.youtube){
      box.innerHTML = '<iframe src="https://www.youtube.com/embed/'+encodeURIComponent(CONFIG.youtube)+'?rel=0" title="Video kita" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      return;
    }
    box.innerHTML = '<video id="plVideo" controls playsinline preload="metadata"></video>'+
      '<div class="video-empty"><svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><use href="#cam-mini"/></svg><em>Taruh video di '+esc(CONFIG.video)+'</em></div>';
    var v = $('#plVideo');
    v.addEventListener('error',function(){ box.classList.add('empty'); });
    v.addEventListener('loadedmetadata',function(){ box.classList.remove('empty'); });
    v.src = CONFIG.video;
  }
  buildVideo();
  $('#couponSub').textContent = CONFIG.couponSub;
  $('#gifts').innerHTML = CONFIG.gifts.map(function(g){
    return '<li><svg viewBox="0 0 100 90" aria-hidden="true"><use href="#heart"/></svg><div><b>'+esc(g.t)+'</b><span>'+esc(g.d)+'</span></div></li>';
  }).join('');

  /* ---- photos ---- */
  var EXTS = ['jpg','jpeg','png','webp'];
  function setImg(el,src,label){
    el.innerHTML = '<img alt="'+esc(label)+'" src="'+src+'" draggable="false">';
  }
  function findPhoto(el,k,label){
    var i = 0;
    (function next(){
      if(i>=EXTS.length) return;
      var src = 'foto/'+k+'.'+EXTS[i++], im = new Image();
      im.onload = function(){ PHOTOS[k] = src; setImg(el,src,label); };
      im.onerror = next;
      im.src = src;
    })();
  }
  function paint(){
    $$('[data-photo]').forEach(function(el){
      var k = el.dataset.photo, src = PHOTOS[k], label = el.dataset.label || 'Foto';
      el.classList.add('ph');
      if(src){ setImg(el,src,label); }
      else {
        el.innerHTML = '<span class="ph-in"><svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><use href="#cam-mini"/></svg><em>'+esc(label)+'</em></span>';
        findPhoto(el,k,label);
      }
      el.tabIndex = 0; el.setAttribute('role','button'); el.setAttribute('aria-label','Perbesar '+label);
    });
  }
  paint();

  /* ---- pocket watch (live time) ---- */
  function watchSVG(){
    var nums = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'], s='', i, a, x, y;
    for(i=0;i<12;i++){
      a = i*Math.PI/6; x = 60+31*Math.sin(a); y = 82-31*Math.cos(a)+3;
      s += '<text x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="middle" font-size="8.5" font-family="Georgia,serif" fill="#2a3068">'+nums[i]+'</text>';
    }
    return '<svg viewBox="0 0 120 134" aria-hidden="true">'+
      '<circle cx="60" cy="26" r="10" fill="none" stroke="#8d9bdd" stroke-width="4.5"/>'+
      '<rect x="53" y="31" width="14" height="9" rx="2" fill="#8d9bdd"/>'+
      '<circle cx="60" cy="86" r="46" fill="#f6f2e8" stroke="#8d9bdd" stroke-width="5.5"/>'+
      '<circle cx="60" cy="86" r="40" fill="none" stroke="#c9d0f0" stroke-width="1"/>'+
      '<g transform="translate(0 4)">'+s+
      '<line class="hh" x1="60" y1="82" x2="60" y2="60" stroke="#26306b" stroke-width="3.2" stroke-linecap="round"/>'+
      '<line class="hm" x1="60" y1="82" x2="60" y2="52" stroke="#26306b" stroke-width="2.4" stroke-linecap="round"/>'+
      '<line class="hs" x1="60" y1="86" x2="60" y2="48" stroke="#c1121f" stroke-width="1.2" stroke-linecap="round"/>'+
      '<circle cx="60" cy="82" r="3" fill="#26306b"/></g></svg>';
  }
  $$('[data-watch]').forEach(function(el){el.innerHTML = watchSVG()});
  function tick(){
    var d = new Date(), sec = d.getSeconds(), min = d.getMinutes()+sec/60, hr = (d.getHours()%12)+min/60;
    function set(cls,deg){$$('.'+cls).forEach(function(n){n.setAttribute('transform','rotate('+deg+' 60 82)')})}
    set('hh',hr*30); set('hm',min*6); set('hs',sec*6);
  }
  tick(); setInterval(tick,1000);

  /* ---- time together ---- */
  function renderSince(){
    var box = $('#since'), s = CONFIG.since;
    if(!s){ box.innerHTML = '<small>Waktu terus berjalan</small><em>Dan aku masih memilih kamu.</em>'; return; }
    var p = s.split('-').map(Number), start = new Date(p[0],p[1]-1,p[2]), now = new Date();
    var days = Math.max(0,Math.floor((now-start)/864e5));
    var y = now.getFullYear()-p[0], m = now.getMonth()-(p[1]-1), dd = now.getDate()-p[2];
    if(dd<0){m--; dd += new Date(now.getFullYear(),now.getMonth(),0).getDate()}
    if(m<0){y--; m+=12}
    var parts = [];
    if(y>0) parts.push(y+' tahun'); if(m>0) parts.push(m+' bulan'); parts.push(dd+' hari');
    box.innerHTML = '<small>Sudah bersama</small><strong>'+days.toLocaleString('id-ID')+' hari</strong><em>'+parts.join(' ')+'</em>';
  }
  renderSince();

  /* ---- scene switching ---- */
  var scenes = {}; $$('.scene').forEach(function(s){scenes[s.id.replace('s-','')] = s});
  function go(name){
    Object.keys(scenes).forEach(function(k){
      var on = k===name, s = scenes[k];
      s.classList.toggle('on',on);
      if(on){ s.removeAttribute('inert'); s.setAttribute('aria-hidden','false'); s.scrollTop = 0; }
      else { s.setAttribute('inert',''); s.setAttribute('aria-hidden','true'); }
    });
    if(name==='gift') resetGift();
    var pv = $('#plVideo'); if(pv && name!=='playlist') pv.pause();
    if(name==='moment') renderSince();
  }
  document.addEventListener('click',function(e){
    var b = e.target.closest('[data-go]'); if(b){ go(b.dataset.go); }
  });
  go('cover');

  /* ---- envelope ---- */
  var env = $('#envBtn'), opened = false;
  env.addEventListener('click',function(){
    if(opened) return; opened = true; env.classList.add('open');
    setTimeout(function(){ go('card'); setTimeout(function(){env.classList.remove('open'); opened=false},700); },1300);
  });

  /* ---- gift ---- */
  var gw = $('#giftWrap'), gopen = false;
  function resetGift(){ gopen = false; gw.classList.remove('open'); }
  function burst(){
    var box = $('#confetti'), cols = ['#f08a93','#f3d98b','#ff5a66','#ffffff','#e8b838'], i;
    for(i=0;i<34;i++){
      var s = document.createElement('span');
      s.textContent = i%3 ? '♥' : '✦';
      s.style.left = (Math.random()*100)+'%';
      s.style.setProperty('--s',(14+Math.random()*22)+'px');
      s.style.setProperty('--c',cols[i%cols.length]);
      s.style.setProperty('--d',(2.4+Math.random()*2)+'s');
      s.style.setProperty('--rot',(Math.random()*500-250)+'deg');
      s.style.animationDelay = (Math.random()*0.7)+'s';
      box.appendChild(s);
      (function(n){setTimeout(function(){n.remove()},5200)})(s);
    }
  }
  $('#giftBtn').addEventListener('click',function(){
    if(gopen) return; gopen = true; gw.classList.add('open'); burst();
    setTimeout(function(){ var sc = scenes.gift; sc.scrollTo({top:sc.scrollHeight,behavior:'smooth'}); },700);
  });

  /* ---- lightbox ---- */
  var lb = $('#lb'), items = [], idx = 0, lastFocus = null;
  function show(){
    var el = items[idx], k = el.dataset.photo, src = PHOTOS[k], label = el.dataset.label || 'Foto';
    $('#lbImg').innerHTML = src
      ? '<img alt="'+esc(label)+'" src="'+src+'">'
      : '<span class="ph-in" style="font-size:1.1rem"><svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true"><use href="#cam-mini"/></svg><em>'+esc(label)+'</em></span>';
    $('#lbCap').textContent = el.dataset.caption || '';
    var multi = items.length>1;
    $('#lbP').style.display = multi ? '' : 'none';
    $('#lbN').style.display = multi ? '' : 'none';
  }
  function openLB(el){
    var g = el.closest('[data-group]');
    items = g ? $$('[data-photo]',g) : [el];
    idx = Math.max(0,items.indexOf(el)); lastFocus = el; show();
    lb.classList.add('on'); lb.setAttribute('aria-hidden','false'); $('#lbX').focus();
  }
  function closeLB(){ lb.classList.remove('on'); lb.setAttribute('aria-hidden','true'); if(lastFocus) lastFocus.focus(); }
  function step(d){ idx = (idx+d+items.length)%items.length; show(); }
  document.addEventListener('click',function(e){
    var p = e.target.closest('[data-photo]'); if(p && !lb.contains(p)) openLB(p);
  });
  document.addEventListener('keydown',function(e){
    if(lb.classList.contains('on')){
      if(e.key==='Escape') closeLB();
      else if(e.key==='ArrowLeft') step(-1);
      else if(e.key==='ArrowRight') step(1);
      return;
    }
    if((e.key==='Enter'||e.key===' ') && e.target.matches && e.target.matches('[data-photo]')){ e.preventDefault(); openLB(e.target); }
  });
  $('#lbX').addEventListener('click',closeLB);
  $('#lbP').addEventListener('click',function(){step(-1)});
  $('#lbN').addEventListener('click',function(){step(1)});
  lb.addEventListener('click',function(e){ if(e.target===lb) closeLB(); });
})();
