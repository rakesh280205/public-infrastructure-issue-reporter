// Welcome screen: reads persisted language and updates UI
(function(){
  const LANG_KEY = 'appLang';
  const strings = {
    en: { heading: 'Welcome to Bengaluru Prism', user: 'USER', admin: 'ADMIN' },
    kn: { heading: 'ಬೆಂಗಳೂರು ಪ್ರಿಸಮ್‌ಗೆ ಸ್ವಾಗತ', user: 'ಬಳಕೆದಾರ', admin: 'ನಿರ್ವಾಹಕ' }
  };

  const heading = document.getElementById('heading');
  const userBtn = document.getElementById('userBtn');
  const adminBtn = document.getElementById('adminBtn');

  function getLang(){ try{ return localStorage.getItem(LANG_KEY) || 'en' }catch(e){return 'en'} }

  function applyTheme(lang){
    const s = strings[lang] || strings.en;
    heading.textContent = s.heading;
    userBtn.textContent = s.user;
    adminBtn.textContent = s.admin;

    // theme classes
    userBtn.classList.remove('en','kn','neutral');
    adminBtn.classList.remove('en','kn','neutral');
    userBtn.classList.add(lang==='kn' ? 'kn' : 'en');
    adminBtn.classList.add(lang==='kn' ? 'kn' : 'en');
  }

  function addHandlers(){
    userBtn.addEventListener('click', ()=>{
      userBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:140});
      // navigate to login screen for users
      document.documentElement.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish = function(){
        window.location.href = 'user-login.html';
      };
    });
    adminBtn.addEventListener('click', ()=>{
      adminBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:140});
      document.documentElement.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish = function(){
        window.location.href = 'admin-login.html';
      };
    });
  }

  // back button on welcome -> go to language selection
  function addBackHandler(){
    const back = document.getElementById('backBtn');
    if(!back) return;
    back.addEventListener('click', ()=>{
      document.documentElement.animate([{opacity:1},{opacity:0}],{duration:220,fill:'forwards'}).onfinish = ()=>{
        window.location.href = 'lang.html';
      };
    });
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', ()=>{
    const lang = getLang();
    applyTheme(lang);
    addHandlers();
    addBackHandler();
    // page fade-in
    document.body.classList.add('fade-in');
  });

})();
