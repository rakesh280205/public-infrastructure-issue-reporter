// Language selection screen logic
(function(){
  const t = {
    en: { heading: 'Select your language', next: 'NEXT' },
    kn: { heading: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', next: 'ಮುಂದೆ' }
  };

  const btnEn = document.getElementById('btn-en');
  const btnKn = document.getElementById('btn-kn');
  const nextBtn = document.getElementById('nextBtn');
  const heading = document.getElementById('heading');

  const LANG_KEY = 'appLang';

  function applyLanguage(lang){
    // update texts
    const strings = t[lang] || t.en;
    heading.textContent = strings.heading;
    nextBtn.textContent = strings.next;

    // update button styles
    btnEn.classList.toggle('selected', lang==='en');
    btnEn.classList.toggle('en', true);
    btnKn.classList.toggle('selected', lang==='kn');
    btnKn.classList.toggle('kn', true);

    // next button color & state
    nextBtn.classList.toggle('en', lang==='en');
    nextBtn.classList.toggle('kn', lang==='kn');
    nextBtn.disabled = false;
    nextBtn.classList.add('enabled');
    nextBtn.style.cursor = 'pointer';

    // persist
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
  }

  function setSelection(lang){
    applyLanguage(lang);
    // small haptic-like feedback: scale via CSS handled by :active
  }

  function readSaved(){
    try{ return localStorage.getItem(LANG_KEY); }catch(e){return null}
  }

  // ripple helper
  function rippleEffect(e){
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const span = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size/2) + 'px';
    span.style.top = (e.clientY - rect.top - size/2) + 'px';
    const container = el.querySelector('.ripple') || (function(){const d=document.createElement('div');d.className='ripple';el.appendChild(d);return d;})();
    container.appendChild(span);
    setTimeout(()=> span.remove(), 600);
  }

  // event wiring
  if(btnEn && btnKn && nextBtn){
    btnEn.addEventListener('click', (e)=>{ rippleEffect(e); setSelection('en'); });
    btnKn.addEventListener('click', (e)=>{ rippleEffect(e); setSelection('kn'); });

    nextBtn.addEventListener('click', ()=>{
      if(nextBtn.disabled) return;
      const lang = readSaved() || 'en';
      console.log('Proceeding with language:', lang);
      // brief press animation then navigate with fade-out
      nextBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:160});
      // fade-out current page then go to welcome.html which will read persisted language
      document.documentElement.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish = function(){
        window.location.href = 'welcome.html';
      };
    });

    // init
    const saved = readSaved();
    if(saved) applyLanguage(saved);
    // else keep next disabled until user picks
    else {
      nextBtn.disabled = true;
      nextBtn.classList.remove('enabled');
      nextBtn.style.cursor = 'not-allowed';
    }
  }

})();
