// User login page logic: language-aware text, mobile validation, navigation
(function(){
  const LANG_KEY='appLang';
  const strings = {
    en:{title:'Login', welcome:'Welcome Back', subtitle:'Please enter your details', sign:'SIGN IN', invalid:'Invalid mobile number'},
    kn:{title:'ಲಾಗಿನ್', welcome:'ಮತ್ತೆ ಸ್ವಾಗತ', subtitle:'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ', sign:'ಲಾಗಿನ್', invalid:'ಅಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ'}
  };

  const backBtn = document.getElementById('backBtn');
  const appTitle = document.getElementById('appTitle');
  const heading = document.getElementById('login-heading');
  const sub = document.getElementById('login-sub');
  const mobile = document.getElementById('mobile');
  const mobileError = document.getElementById('mobileError');
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

  // toggle password visibility
  toggle.addEventListener('click', ()=>{
    pwd.type = pwd.type === 'password' ? 'text' : 'password';
    toggle.textContent = pwd.type === 'password' ? '👁️' : '🙈';
  });

  // mobile input: allow digits only, max 10, show error if pasted >10
  mobile.addEventListener('input', (e)=>{
    const before = mobile.value;
    // remove non-digits
    let v = before.replace(/\D+/g,'');
    if(v.length>10){
      // trim and show error
      mobileError.style.display = 'block';
      mobileError.textContent = (strings[getLang()]||strings.en).invalid;
      v = v.slice(0,10);
    } else {
      mobileError.style.display = 'none';
    }
    if(v!==before) mobile.value = v;
  });

  // back button -> welcome page
  backBtn.addEventListener('click', ()=>{
    document.documentElement.animate([{opacity:1},{opacity:0}],{duration:240,fill:'forwards'}).onfinish = ()=>{
      window.location.href = 'welcome.html';
    };
  });

  // sign in click - basic validation
  signBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const lang = getLang();
    const s = strings[lang]||strings.en;
    if(mobile.value.length!==10){
      mobileError.style.display = 'block';
      mobileError.textContent = s.invalid;
      return;
    }
    signBtn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{duration:150});
    // persist session locally
    try{ localStorage.setItem('loggedInMobile', mobile.value); }catch(e){}
    // POST to backend to create/upsert user record
    fetch('/api/users', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mobile:mobile.value})})
      .then(res=>res.json())
      .then(()=>{
        // navigate to index (dashboard)
        document.documentElement.animate([{opacity:1},{opacity:0}],{duration:240,fill:'forwards'}).onfinish = ()=>{
          window.location.href = 'index.html';
        };
      })
      .catch(err=>{
        console.error('user create error',err);
        // still navigate
        window.location.href = 'index.html';
      });
  });

  // init
  document.addEventListener('DOMContentLoaded', ()=>applyLang());

})();
