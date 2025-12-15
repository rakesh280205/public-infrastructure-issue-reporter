// Admin login page logic: language-aware text, admin ID rules, navigation
(function(){
  const LANG_KEY='appLang';
  const strings = {
    en:{title:'Login', welcome:'Welcome Back', subtitle:'Please enter your details', sign:'SIGN IN'},
    kn:{title:'ಲಾಗಿನ್', welcome:'ಮತ್ತೆ ಸ್ವಾಗತ', subtitle:'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ', sign:'ಲಾಗಿನ್'}
  };

  const backBtn = document.getElementById('backBtn');
  const appTitle = document.getElementById('appTitle');
  const heading = document.getElementById('login-heading');
  const sub = document.getElementById('login-sub');
  const adminId = document.getElementById('adminId');
  const adminError = document.getElementById('adminError');
  const pwd = document.getElementById('password');
  const toggle = document.getElementById('togglePwd');
  const signBtn = document.getElementById('signBtn');

  function getLang(){ try{return localStorage.getItem(LANG_KEY)||'en'}catch(e){return 'en'} }

  function applyLang(){
    const lang = getLang();
    const s = strings[lang]||strings.en;
    appTitle.textContent = s.title;
    heading.textContent = s.welcome;
    sub.textContent = s.subtitle;
    signBtn.textContent = s.sign;
    // theme
    signBtn.classList.remove('en','kn');
    signBtn.classList.add(lang==='kn'?'kn':'en');
  }

  toggle.addEventListener('click', ()=>{
    pwd.type = pwd.type === 'password' ? 'text' : 'password';
    toggle.textContent = pwd.type === 'password' ? '👁️' : '🙈';
  });

  // back -> welcome page
  backBtn.addEventListener('click', ()=>{
    document.documentElement.animate([{opacity:1},{opacity:0}],{duration:240,fill:'forwards'}).onfinish = ()=>{
      window.location.href = 'welcome.html';
    };
  });

  // sign in click - basic validation for admin id non-empty
  signBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(!adminId.value.trim()){
      adminError.style.display = 'block';
      adminError.textContent = 'Enter Admin ID';
      return;
    }
    adminError.style.display = 'none';
    signBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:150});
    console.log('ADMIN sign-in (demo)');
  });

  document.addEventListener('DOMContentLoaded', ()=>applyLang());

})();
