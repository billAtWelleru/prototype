// WellerU Mobile Prototype JS with Accolades + Confetti
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>Array.from(el.querySelectorAll(s));

const App = {
  // set true during development to unlock extra features
  debug: false,
  state: JSON.parse(localStorage.getItem('welleru_mobile')||'{}'),
  init(){
    // make sure collections exist
    this.state.celebrated = this.state.celebrated || {}; // M1..M5
    this.state.users = this.state.users || {};      // stored accounts by email
    this.bindChrome();
    this.route();
    window.addEventListener('hashchange', ()=>this.route());
    this.refreshAuth();
  },
  persist(){ localStorage.setItem('welleru_mobile', JSON.stringify(this.state)); },
  authed(){ return !!this.state.user; },
  // translation helper
  t(key){
    // global language preference falls back to user setting, then global state, then English
    const lang = this.state.user?.lang || this.state.language || 'en';
    const dict = {
      en: {
        'Welcome to WellerU':'Welcome to WellerU',
        'Sign in':'Sign in',
        'Sign out':'Sign out',
        'Create your account':'Create your account',
        'Phone Verification':'Phone Verification',
        'This application requires a second form of authentication.':'This application requires a second form of authentication.',
        'First Name':'First Name',
        'Last Name':'Last Name',
        'Email':'Email',
        'Password':'Password',
        'Confirm Password':'Confirm Password',
        'Create Account':'Create Account',
        'Plan ID (6 digits)':'Plan ID (6 digits)',
        'Group ID (6 digits)':'Group ID (6 digits)',
        'Date of Birth':'Date of Birth',
        'Submit':'Submit',
        'Connect with Payor':'Connect with Payor',
        'Enter your plan information to locate your account.':'Enter your plan information to locate your account.',
        'Payor identified:':'Payor identified:',
        'Confirm Payor':'Confirm Payor',
        'Wellness Rewards':'Wellness Rewards',
        'Your wellness journey is rewarded through an Amazon gift card.':'Your wellness journey is rewarded through an Amazon gift card.',
        'Amazon Account Email':'Amazon Account Email',
        'Next':'Next',
        'Previous':'Previous',
        'of':'of',
        'Select...':'Select...',
        'Submit HRA':'Submit HRA',
        'Enter the 6-digit code sent to your phone.':'Enter the 6-digit code sent to your phone.',
        'Verify':'Verify',
        'Your Journey':'Your Journey',
        'Milestones':'Milestones',
        'Primary Care Provider':'Primary Care Provider',
        'Health Risk Assessment':'Health Risk Assessment',
        'Page':'Page',
        'Make Appointment':'Make Appointment',
        'Confirm AWV Completion':'Confirm AWV Completion',
        'Rewards':'Rewards',
        'View Rewards':'View Rewards',
        'complete':'complete',
        'earned':'earned',
        'Profile':'Profile',
        'Full Name':'Full Name',
        'Payor':'Payor',
        'PCP':'PCP',
        'Language':'Language',
        'English':'English',
        'Español':'Español',
        'Saved':'Saved',
        'Mark as Completed':'Mark as Completed',
        'Upload visit summary (mock)':'Upload visit summary (mock)',
        'Phone Number':'Phone Number',
        'SMS Opt-In: I agree to receive SMS messaging in support of authentication as described in the ':'SMS Opt-In: I agree to receive SMS messaging in support of authentication as described in the ',
        'Validate Phone Number':'Validate Phone Number',
      },
      es: {
        'Welcome to WellerU':'Bienvenido a WellerU',
        'Sign in':'Iniciar sesión',
        'Sign out':'Cerrar sesión',
        'Create your account':'Crea tu cuenta',
        'Phone Verification':'Verificación de teléfono',
        'This application requires a second form of authentication.':'Esta aplicación requiere una segunda forma de autenticación.',
        'First Name':'Nombre',
        'Last Name':'Apellido',
        'Email':'Correo electrónico',
        'Password':'Contraseña',
        'Confirm Password':'Confirmar contraseña',
        'Create Account':'Crear cuenta',
        'Plan ID (6 digits)':'ID del plan (6 dígitos)',
        'Group ID (6 digits)':'ID del grupo (6 dígitos)',
        'Date of Birth':'Fecha de nacimiento',
        'Submit':'Enviar',
        'Connect with Payor':'Conectar con el pagador',
        'Enter your plan information to locate your account.':'Introduce la información de tu plan para localizar tu cuenta.',
        'Payor identified:':'Pagador identificado:',
        'Confirm Payor':'Confirmar pagador',
        'Wellness Rewards':'Recompensas de bienestar',
        'Your wellness journey is rewarded through an Amazon gift card.':'Tu viaje de bienestar se recompensa con una tarjeta de regalo de Amazon.',
        'Amazon Account Email':'Correo de cuenta de Amazon',
        'Next':'Siguiente',
        'Previous':'Anterior',
        'of':'de',
        'Select...':'Seleccione...',
        'Submit HRA':'Enviar HRA',
        'Enter the 6-digit code sent to your phone.':'Introduce el código de 6 dígitos enviado a tu teléfono.',
        'Verify':'Verificar',
        'Your Journey':'Tu viaje',
        'Milestones':'Hitos',
        'Primary Care Provider':'Proveedor de atención primaria',
        'Health Risk Assessment':'Evaluación de riesgos de salud',
        'Page':'Página',
        'Make Appointment':'Hacer cita',
        'Confirm AWV Completion':'Confirmar finalización de AWV',
        'Rewards':'Recompensas',
        'View Rewards':'Recompensas',
        'complete':'completo',
        'earned':'ganado',
        'Profile':'Perfil',
        'Full Name':'Nombre completo',
        'Payor':'Pagador',
        'PCP':'PCP',
        'Language':'Idioma',
        'English':'Inglés',
        'Español':'Español',
        'Saved':'Guardado',
        'Mark as Completed':'Marcar como completado',
        'Select':'Seleccionar',
        'Upload visit summary (mock)':'Subir resumen de la visita (simulado)',
        'Phone Number':'Número de teléfono',
        'SMS Opt-In: I agree to receive SMS messaging in support of authentication as described in the ':'SMS Opt-In: Acepto recibir mensajes SMS para autenticación según la ',
        'Validate Phone Number':'Validar número de teléfono',
        'Date':'Fecha',
        'Time':'Hora',
        'Location / Address':'Ubicación / Dirección',
        'Option 1: Upload visit summary (mock)':'Opción 1: Subir resumen de la visita (simulado)',
        'Option 2: Mark as Completed':'Opción 2: Marcar como completado',
        'Mark as Completed':'Marcar como completado',
        'Current:':'Actual:',
        'Date':'Date',
        'Time':'Time',
        'Location / Address':'Location / Address',
        'Option 1: Upload visit summary (mock)':'Option 1: Upload visit summary (mock)',
        'Option 2: Mark as Completed':'Option 2: Mark as Completed',
        'Mark as Completed':'Mark as Completed',
        'Select':'Select',
      }
    };
    return dict[lang] && dict[lang][key] ? dict[lang][key] : key;
  },
  bindChrome(){
    $('#menuToggle').addEventListener('click', ()=>{ $('#sideMenu').hidden=false; });
    $('#closeMenu').addEventListener('click', ()=>{ $('#sideMenu').hidden=true; });
    $('#contrastToggle').addEventListener('click', ()=>{ document.documentElement.classList.toggle('high-contrast'); });

    // language toggle
    const langBtn = $('#languageToggle');
    if(langBtn){
      const updateLangBtn = ()=>{
        const cur = this.state.user?.lang || this.state.language || 'en';
        langBtn.textContent = cur==='en' ? 'EN' : 'ES';
      };
      updateLangBtn();
      langBtn.addEventListener('click', ()=>{
        const cur = this.state.user?.lang || this.state.language || 'en';
        const next = cur === 'en' ? 'es' : 'en';
        if(this.state.user) this.state.user.lang = next;
        this.state.language = next;
        this.persist();
        updateLangBtn();
        this.route();
      });
      // expose for later route updates
      this.updateLangBtn = updateLangBtn;
    }

    $('#logoutBtn').addEventListener('click', ()=>{ this.state.user=null; this.state.language='en'; this.persist(); this.refreshAuth(); location.hash='#login'; });

    // debug dump option
    const dbg = $('#debugDump');
    if(dbg){
      dbg.addEventListener('click', e=>{
        e.preventDefault();
        console.log('Localstorage state:', JSON.stringify(this.state, null, 2));
      });
    }

    // reset prototype
    const reset = $('#resetBtn');
    if(reset){
      reset.addEventListener('click', e=>{
        e.preventDefault();
        if(confirm('This will erase all stored data and log you out. Continue?')){
          localStorage.clear();
          location.hash='#login';
          location.reload();
        }
      });
    }
  },
  refreshAuth(){
    $$('.authed').forEach(el=>{
      if(el.id==='debugDump' && !this.debug){
        el.hidden = true;
      } else {
        el.hidden = !this.authed();
      }
    });
  },
  route(){
    const r = (location.hash.slice(1)||'login');
    // reset to english when showing login screen
    if(r==='login'){
      this.state.language = 'en';
      this.persist();
    }
    const views = { login:Views.Login, signup:Views.Signup, 'signup-phone':Views.SignupPhone, 'signup-mfa':Views.SignupMFA, 'signup-payor':Views.SignupPayor, 'signup-amazon':Views.SignupAmazon, mfa:Views.MFA, dashboard:Views.Dashboard, pcp:Views.PCP, hra:Views.HRA, appointment:Views.Appointment, awv:Views.AWV, rewards:Views.Rewards, profile:Views.Profile, celebration:Views.Celebration };
    const View = views[r] || Views.Login;
    $('#screen').innerHTML = View.render();
    View.bind?.();
    this.refreshAuth();
    if(this.updateLangBtn) this.updateLangBtn();
    $$('.tab').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+r));
    $('#sideMenu').hidden=true;
  },
  celebrate(mId){
    // record the milestone if not already done, but always navigate
    if(!this.state.celebrated[mId]){
      this.state.celebrated[mId] = true;
      this.persist();
    }
    this.celebrationData = { mId, reward: {M1:5,M2:5,M3:5,M4:10,M5:50}[mId], next: {M1:'#pcp',M2:'#hra',M3:'#appointment',M4:'#awv',M5:'#rewards'}[mId] };
    location.hash='#celebration';
  },
  showAccolade({title, subtitle, nextHref, nextText}){
    const ov = $('#overlay');
    const box = document.createElement('div');
    box.className='accolade';
    box.innerHTML = `
      <div class='icon'>🏆</div>
      <div class='content'>
        <div class='title'>${title}</div>
        <div class='subtitle'>${subtitle}</div>
      </div>
      <div class='actions'>
        <button class='btn-inline close' aria-label='Close'>Close</button>
        <a class='btn-inline' href='${nextHref}'>${nextText}</a>
      </div>`;
    ov.appendChild(box);
    const close = ()=>{ box.remove(); };
    box.querySelector('.close').addEventListener('click', close);
    setTimeout(close, 6000);
  },
  launchConfetti(ms=2000){
    const ov = $('#overlay');
    const canvas = document.createElement('canvas');
    canvas.className='confetti-canvas'; ov.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio||1);
    const rect = ov.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px'; ctx.scale(dpr,dpr);

    const colors = ['#A7C7E7','#BFD8B8','#F5EBD6','#FF6B6B','#2F3E46'];
    const N = 140; const parts=[];
    for(let i=0;i<N;i++){
      parts.push({
        x: Math.random()*rect.width,
        y: -20 - Math.random()*rect.height*0.3,
        r: 4+Math.random()*6,
        a: Math.random()*Math.PI*2,
        v: 1.5+Math.random()*2.5,
        w: 0.02+Math.random()*0.08,
        col: colors[i%colors.length]
      });
    }
    let start=null;
    function step(ts){
      if(!start) start=ts; const t=ts-start; ctx.clearRect(0,0,rect.width,rect.height);
      parts.forEach(p=>{ p.y += p.v; p.x += Math.sin(p.a+=p.w)*0.9; ctx.save(); ctx.fillStyle=p.col; ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r); ctx.restore(); });
      if(t<ms){ requestAnimationFrame(step);} else { canvas.remove(); }
    }
    requestAnimationFrame(step);
  },
  launchCelebrationConfetti(ms=2000){
    const screen = $('#screen');
    const canvas = document.createElement('canvas');
    canvas.className='celebration-confetti'; screen.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio||1);
    const rect = screen.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; canvas.style.width=rect.width+'px'; canvas.style.height=rect.height+'px'; ctx.scale(dpr,dpr);

    const colors = ['#A7C7E7','#BFD8B8','#F5EBD6','#FF6B6B','#2F3E46'];
    const N = 200; const parts=[];
    for(let i=0;i<N;i++){
      parts.push({
        x: Math.random()*rect.width,
        y: -20 - Math.random()*rect.height*0.3,
        r: 4+Math.random()*8,
        a: Math.random()*Math.PI*2,
        v: 1.5+Math.random()*3,
        w: 0.02+Math.random()*0.1,
        col: colors[i%colors.length]
      });
    }
    let start=null;
    function step(ts){
      if(!start) start=ts; const t=ts-start; ctx.clearRect(0,0,rect.width,rect.height);
      parts.forEach(p=>{ p.y += p.v; p.x += Math.sin(p.a+=p.w)*0.9; ctx.save(); ctx.fillStyle=p.col; ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r); ctx.restore(); });
      if(t<ms){ requestAnimationFrame(step);} else { canvas.remove(); }
    }
    requestAnimationFrame(step);
  }
};

const HRA = [
  {id:1, q:'In the past 7 days, how many days did you exercise?', type:'number', req:true},
  {id:2, q:'How intense was your typical exercise?', type:'select', opts:['Light','Moderate','Heavy','Very heavy','Not exercising']},
  {id:3, q:'In the last 30 days, have you smoked tobacco?', type:'select', opts:['Yes','No'], req:true},
  {id:4, q:'How many sugar-sweetened beverages per day (past 7 days)?', type:'number'},
  {id:5, q:'In the past 2 weeks, how often have you felt down?', type:'select', opts:['Almost all','Most','Some','Almost never']},
];

const Views = {
  Login:{
    render(){return `
      <section class='card'>
        <div class='h1'>${App.t('Welcome to WellerU')}</div>
        <form id='f' class='grid'>
          <div class='form-row'><label>${App.t('Email')}<input class='input' name='email' type='email' required></label></div>
          <div class='form-row'><label>${App.t('Password')}<input class='input' name='pwd' type='password'></label></div>
          <button class='btn' type='submit'>${App.t('Sign in')||'Sign in'}</button>
          <button class='btn ghost' type='button' id='toSignup'>${App.t('Create Account')}</button>
        </form>
      </section>`;},
    bind(){
      $('#f').addEventListener('submit',e=>{
        e.preventDefault();
        const fd=new FormData(e.target);
        const email = fd.get('email');
        // password ignored completely
        const users = App.state.users || {};
        if(!users[email]){
          alert('No account found for that email. Please create an account first.');
          location.hash='#signup';
          return;
        }
        // always succeed regardless of password
        App.state.user = users[email];
        // remember language for login screen when logged out
        App.state.language = App.state.user.lang || App.state.language;
        App.persist();
        location.hash='#mfa';
      });
      $('#toSignup').addEventListener('click',()=>location.hash='#signup');
    }
  },
  Signup:{
    render(){return `
      <section class='card'>
        <div class='h1'>${App.t('Create your account')}</div>
        <form id='sign' class='grid'>
          <label class='form-row'>${App.t('First Name')}<input class='input' name='fname' required></label>
          <label class='form-row'>${App.t('Last Name')}<input class='input' name='lname' required></label>
          <label class='form-row'>${App.t('Email')}<input class='input' name='email' type='email' required></label>
          <label class='form-row'>${App.t('Password')}<input class='input' name='pwd' type='password'></label>
          <label class='form-row'>${App.t('Confirm Password')}<input class='input' name='pwdconfirm' type='password'></label>
          <button class='btn' type='submit'>${App.t('Create Account')}</button>
        </form>
        <p style='font-size:0.85rem; color:#666; margin-top:2rem;'>
          ${App.t('This prototype stores data locally on your computer. Nothing is transmitted.') || 'This prototype stores data locally on your computer. Nothing is transmitted.'}
        </p>
      </section>`;},
    bind(){
      $('#sign').addEventListener('submit', e=>{
        e.preventDefault();
        const fd = new FormData(e.target);
        const email = fd.get('email');
        if(App.state.users[email]){
          alert('An account already exists with that email. Please log in.');
          location.hash = '#login';
          return;
        }
        // Start a signup session (not persisting user until final step)
        App.state.signupSession = {
          fname: fd.get('fname'),
          lname: fd.get('lname'),
          email,
          // password ignored/not stored
        };
        App.persist();
        location.hash='#signup-phone';
      });
    }
  },
  SignupPhone:{
    render(){return `
      <section class='card'>
        <div class='h1'>${App.t('Phone Verification')}</div>
        <p>${App.t('This application requires a second form of authentication.')}</p>
        <form id='phone-form' class='grid'>
          <label class='form-row'>${App.t('Phone Number')}<input class='input' name='phone' type='tel' placeholder='(XXX) XXX-XXXX' required></label>
          <label class='checkbox-row'>
            <input type='checkbox' name='smsOptIn' id='smsOptIn'>
            <span>${App.t('SMS Opt-In: I agree to receive SMS messaging in support of authentication as described in the ')}<a href='https://www.welleru.com/smsprivacy' target='_blank'>SMS Privacy Policy</a></span>
          </label>
          <button class='btn' type='submit' id='validatePhoneBtn' disabled>${App.t('Validate Phone Number')}</button>
        </form>
      </section>`;},
    bind(){
      const form = $('#phone-form');
      const phoneInput = form.querySelector('input[name="phone"]');
      const smsCheckbox = form.querySelector('#smsOptIn');
      const submitBtn = form.querySelector('#validatePhoneBtn');
      
      const updateButtonState = ()=>{
        submitBtn.disabled = !phoneInput.value || !smsCheckbox.checked;
      };
      
      phoneInput.addEventListener('input', updateButtonState);
      smsCheckbox.addEventListener('change', updateButtonState);
      
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const fd = new FormData(form);
        App.state.signupSession.phone = fd.get('phone');
        App.persist();
        location.hash='#signup-mfa';
      });
    }
  },
  SignupMFA:{
    render(){
      const mfaCode = String(Math.floor(Math.random()*1000000)).padStart(6,'0');
      return `
      <section class='card'>
        <div class='h1'>${App.t('Multi-Factor Authentication')}</div>
        <p>${App.t('Enter the 6-digit code sent to your phone.')}</p>
        <form id='mfa-form' class='grid'>
          <label class='form-row'>6-Digit Code<input class='input' name='mfacode' type='text' pattern='\\d{6}' maxlength='6' value='${mfaCode}' required></label>
          <button class='btn' type='submit'>${App.t('Next')}</button>
        </form>
      </section>`;},

    bind(){
      const form = $('#mfa-form');
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const fd = new FormData(form);
        App.state.signupSession.mfaCode = fd.get('mfacode');
        App.persist();
        location.hash='#signup-payor';
      });
    }
  },
  SignupPayor:{
    render(){
      const payor = App.state.signupSession?.payor;
      return `
      <section class='card'>
        <div class='h1'>${App.t('Connect with Payor')}</div>
        <p>${App.t('Enter your plan information to locate your account.')}</p>
        ${!payor ? `
        <form id='payor-form' class='grid'>
          <label class='form-row'>${App.t('Plan ID (6 digits)')}<input class='input' name='plan' type='text' placeholder='XXX-XXX' required></label>
          <label class='form-row'>${App.t('Group ID (6 digits)')}<input class='input' name='group' type='text' placeholder='XXX-XXX' required></label>
          <label class='form-row'>${App.t('Date of Birth')}<input class='input' name='dob' type='date' required></label>
          <button class='btn' type='submit'>${App.t('Submit')}</button>
        </form>` : `
        <p><strong>${App.t('Payor identified:')}</strong> ${payor}</p>
        <button id='confirmPayor' class='btn'>${App.t('Confirm Payor')}</button>`}
      </section>`;
    },

    bind(){
      const payor = App.state.signupSession?.payor;
      if(!payor){
        const form = $('#payor-form');
        form.addEventListener('submit', e=>{
          e.preventDefault();
          const fd = new FormData(form);
          App.state.signupSession.plan = fd.get('plan');
          App.state.signupSession.group = fd.get('group');
          App.state.signupSession.dob = fd.get('dob');
          App.persist();
          
          // Show payor confirmation
          const payors = ['Cascade Health Plan', 'Evergreen Benefit Alliance', 'SummitCare Insurance'];
          const selectedPayor = payors[Math.floor(Math.random()*payors.length)];
          App.state.signupSession.payor = selectedPayor;
          App.persist();
          // re-render current view so user can confirm
          App.route();
        });
      } else {
        $('#confirmPayor').addEventListener('click', ()=>{
          location.hash='#signup-amazon';
        });
      }
    }
  },
  SignupAmazon:{
    render(){
      const email = App.state.signupSession?.email || '';
      return `
      <section class='card'>
        <div class='h1'>${App.t('Wellness Rewards')}</div>
        <p>${App.t('Your wellness journey is rewarded through an Amazon gift card.')}</p>
        <form id='amazon-form' class='grid'>
          <label class='form-row'>${App.t('Amazon Account Email')}<input class='input' name='amazon' type='email' value='${email}' required></label>
          <button class='btn' type='submit'>${App.t('Next')}</button>
        </form>
      </section>`;},
    bind(){
      const form = $('#amazon-form');
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const fd = new FormData(form);
        const email = App.state.signupSession.email;
        
        // Create final user object (without password)
        const amazonEmail = fd.get('amazon');
        const user = {
          email,
          fname: App.state.signupSession.fname,
          lname: App.state.signupSession.lname,
          phone: App.state.signupSession.phone,
          dob: App.state.signupSession.dob,
          plan: App.state.signupSession.plan,
          group: App.state.signupSession.group,
          payor: App.state.signupSession.payor,
          amazon: amazonEmail,
          lang: 'en',
          journey:{m1:false,m2:false,m3:false,m4:false,m5:false}
        };
        
        App.state.users[email] = user;
        App.state.user = user;
        App.state.amazon = amazonEmail;
        App.state.language = user.lang;
        delete App.state.signupSession;
        App.persist();
        
        // Mark M1 complete and fire celebration
        App.state.user.journey.m1 = true;
        App.persist();
        App.celebrate('M1');
        // in case celebrate() was already called earlier, ensure navigation
        if(location.hash !== '#celebration'){
          location.hash = '#celebration';
        }
      });
    }
  },
  MFA:{
    render(){return `
      <section class='card'>
        <div class='h1'>Multi‑Factor Authentication</div>
        <form id='mf' class='grid'>
          <label class='form-row'>Enter 6‑digit code<input class='input' name='code' pattern='\\d{6}' maxlength='6' required></label>
          <button class='btn' type='submit'>Verify</button>
        </form>
      </section>`;},
    bind(){ $('#mf').addEventListener('submit',e=>{e.preventDefault();App.state.user.journey.m1=true;App.persist();App.celebrate('M1');location.hash='#dashboard';}); }
  },
  Dashboard:{
    render(){
      const j=App.state.user?.journey||{};
      const pct=Math.round(((j.m1+j.m2+j.m3+j.m4+j.m5)/5)*100);
      const next=!j.m2?'#pcp':!j.m3?'#hra':!j.m4?'#appointment':!j.m5?'#awv':'#rewards';
      const names = {M1:App.t('Create Account'),M2:App.t('Select PCP'),M3:App.t('Complete HRA'),M4:App.t('Make Appointment'),M5:App.t('Complete AWV'),default:App.t('View Rewards')};
      const nextKey = !j.m2 ? 'M2' : !j.m3 ? 'M3' : !j.m4 ? 'M4' : !j.m5 ? 'M5' : 'default';
      const nextName = names[nextKey];
      const earn=(j.m1?5:0)+(j.m2?5:0)+(j.m3?5:0)+(j.m4?10:0)+(j.m5?50:0);
      return `
        <section class='card'>
          <div class='h1'>${App.t('Your Journey')}</div>
          <div class='progress' aria-valuenow='${pct}'><span style='width:${pct}%'></span></div>
          <div class='kpi'><span>${pct}% ${App.t('complete')}</span><span class='badge'>$${earn} ${App.t('earned')}</span></div>
        </section>
        <section class='card'>
          <div class='h2'>${App.t('Milestones')}</div>
          <ol>
            <li>M1: Create Account ${j.m1?'✅':''}</li>
            <li>M2: Select PCP ${j.m2?'✅':''}</li>
            <li>M3: Complete HRA ${j.m3?'✅':''}</li>
            <li>M4: Make Appointment ${j.m4?'✅':''}</li>
            <li>M5: Complete AWV ${j.m5?'✅':''}</li>
          </ol>
        </section>
        <a class='btn' href='${next}'>Continue${nextName?': '+nextName:''}</a>`;
    },
    bind(){
      // nothing to bind for dashboard now
    }
  },
  PCP:{
    render(){ 
      const cur=App.state.pcpName||'No PCP on file'; 
      const hasProvider = !!App.state.pcpName;
      return `
      <section class='card'>
        <div class='h1'>${App.t('Primary Care Provider')}</div>
        <p><strong>${App.t('Current:')||'Current:'}</strong> ${cur}</p>
        <div class='grid'>
          <button id='confirm' class='btn' ${hasProvider ? '' : 'disabled'}>Confirm Existing PCP</button>
          <details class='card'><summary>Choose Provider</summary>
            <textarea class='input' id='aiChat' placeholder='AI chat will occur here to assist the user with finding a best match, or the user can perform a manual search.' rows='6' readonly></textarea>
            <label class='form-row'>Search<input class='input' id='q' placeholder='City or name'></label>
            <div id='list'></div>
          </details>
        </div>
      </section>`;},
    bind(){
      const hasProvider = !!App.state.pcpName;
      const alreadyRewarded = App.state.user.journey.m2;
      $('#confirm').addEventListener('click',()=>{
        // ensure PCP info persisted
        if(App.state.pcpName && App.state.pcpCity){
          App.persist();
        }
        if(!alreadyRewarded){
          App.state.user.journey.m2=true;
          App.persist();
          App.celebrate('M2');
        }else{
          location.hash='#dashboard';
        }
      });
      const providers=[{name:'Dr. Lee',specialty:'Family Medicine',city:'Grapevine'},{name:'Dr. Patel',specialty:'Internal Medicine',city:'Dallas'},{name:'Dr. Garcia',specialty:'Family Medicine',city:'Irving'}];
      const render=q=>{ const wrap=$('#list'); wrap.innerHTML=''; providers.filter(p=>!q||`${p.name} ${p.city}`.toLowerCase().includes(q.toLowerCase())).forEach(p=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<strong>${p.name}</strong><br><small>${p.specialty} • ${p.city}</small><br><button class='btn pick'>${App.t('Select')}</button>`; d.querySelector('.pick').addEventListener('click',()=>{App.state.pcpName=p.name;App.state.pcpCity=p.city;App.persist();if(!alreadyRewarded){App.state.user.journey.m2=true;App.persist();App.celebrate('M2');}else{location.hash='#dashboard';}}); wrap.appendChild(d); }); };
      render(''); $('#q').addEventListener('input',e=>render(e.target.value));
    }
  },
  HRA:{
    render(){ 
      const a=App.state.hra||{}; 
      const page = App.state.hraPage || 1;
      const perPage = 3;
      const totalPages = Math.ceil(HRA.length / perPage);
      const start = (page-1)*perPage;
      const currentQuestions = HRA.slice(start, start+perPage);
      const answered = Object.keys(a).length;
      const complete = HRA.every(q=>!q.req||a[q.id]);
      
      let questionsHtml = '';
      currentQuestions.forEach(q=>{
        if(q.type==='number'){
          questionsHtml += `<div class='form-row'><label>${q.q}${q.req?" <span class='badge'>*</span>":''}<input class='input' type='number' data-id='${q.id}' value='${a[q.id]||''}'></label></div>`;
        }else{
          questionsHtml += `<div class='form-row'><label>${q.q}${q.req?" <span class='badge'>*</span>":''}<select class='input' data-id='${q.id}'><option value=''>${App.t('Select...')}</option>${(q.opts||[]).map(o=>`<option ${a[q.id]===o?'selected':''}>${o}</option>`).join('')}</select></label></div>`;
        }
      });
      
      let buttons = '';
      if(page > 1){
        buttons += `<button id='prevBtn' class='btn ghost'>${App.t('Previous')}</button>`;
      }
      if(page < totalPages){
        buttons += `<button id='nextBtn' class='btn'>${App.t('Next')}</button>`;
      } else {
        buttons += `<button id='submit' class='btn' ${complete?'':'disabled'}>${App.t('Submit HRA')}</button>`;
      }
      
      return `
      <section class='card'>
        <div class='h1'>${App.t('Health Risk Assessment')}</div>
        <p>${App.t('Page')} ${page} ${App.t('of')} ${totalPages}</p>
        <form id='hf'>${questionsHtml}</form>
        <div class='progress'><span style='width:${Math.round(answered/HRA.length*100)}%'></span></div>
        <div class='grid' style='margin-top:1rem;'>
          ${buttons}
        </div>
      </section>`;
    },
    bind(){ 
      const form=$('#hf'); 
      const a=App.state.hra||{}; 
      const perPage = 3;
      const totalPages = Math.ceil(HRA.length / perPage);
      
      form.addEventListener('input',e=>{ 
        const id=e.target.dataset.id; 
        if(!id) return; 
        App.state.hra=App.state.hra||{}; 
        App.state.hra[id]=e.target.value; 
        App.persist();
        this.renderPageButtons();
      });
      
      this.renderPageButtons = ()=>{
        const complete = HRA.every(q=>!q.req||a[q.id]);
        const submitBtn = $('#submit');
        if(submitBtn){
          submitBtn.disabled = !complete;
        }
      };
      
      const nextBtn = $('#nextBtn');
      if(nextBtn){
        nextBtn.addEventListener('click',()=>{
          App.state.hraPage = Math.min(totalPages, (App.state.hraPage||1)+1);
          App.persist();
          App.route();
        });
      }
      
      const prevBtn = $('#prevBtn');
      if(prevBtn){
        prevBtn.addEventListener('click',()=>{
          App.state.hraPage = Math.max(1, (App.state.hraPage||1)-1);
          App.persist();
          App.route();
        });
      }
      
      const submitBtn = $('#submit');
      if(submitBtn){
        submitBtn.addEventListener('click',()=>{ 
          App.state.user.journey.m3=true; 
          App.state.hraPage = 1;
          App.persist(); 
          App.celebrate('M3');
        });
      }
      
      this.renderPageButtons();
    }
  },
  Appointment:{
    render(){ const a=App.state.appt||{}; const pcpName=App.state.pcpName||''; const pcpCity=App.state.pcpCity||''; const defaultLoc = a.loc||pcpCity;
      return `
      <section class='card'>
        <div class='h1'>${App.t('Make Appointment')}</div>
        ${pcpName?`<p>${App.t('PCP')}: <strong>${pcpName}${pcpCity?` (${pcpCity})`:''}</strong></p>`:''}
        <form id='af' class='grid'>
          <label class='form-row'>${App.t('Date')}<input class='input' name='date' type='date' value='${a.date||''}' required></label>
          <label class='form-row'>${App.t('Time')}<input class='input' name='time' type='time' value='${a.time||''}' required></label>
          <label class='form-row'>${App.t('Location / Address')}<input class='input' name='loc' value='${defaultLoc||''}' required></label>
          <button class='btn' type='submit'>${App.t('Submit')}</button>
        </form>
      </section>`;
    },
    bind(){ $('#af').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);App.state.appt={date:fd.get('date'),time:fd.get('time'),loc:fd.get('loc'),pcp:App.state.pcpName||'',pcpCity:App.state.pcpCity||''};App.state.user.journey.m4=true;App.persist();App.celebrate('M4');});
    }
  },
  AWV:{
    render(){ return `
      <section class='card'>
        <div class='h1'>${App.t('Confirm AWV Completion')}</div>
        <p>${App.t('Option 1: Upload visit summary (mock)')}</p>
        <input type='file' aria-label='Upload visit summary'>
        <p>${App.t('Option 2: Mark as Completed')}</p>
        <button id='done' class='btn'>${App.t('Mark as Completed')}</button>
      </section>`;},
    bind(){ $('#done').addEventListener('click',()=>{App.state.user.journey.m5=true;App.persist();App.celebrate('M5');location.hash='#dashboard';}); }
  },
  Rewards:{
    render(){ const j=App.state.user?.journey||{}; const total=(j.m1?5:0)+(j.m2?5:0)+(j.m3?5:0)+(j.m4?10:0)+(j.m5?50:0); const amazon = App.state.user?.amazon || App.state.amazon || 'not linked'; return `
      <section class='card'>
        <div class='h1'>${App.t('Rewards')}</div>
        <p>Total Earned: <strong>$${total}</strong></p>
        <p>Gift card account: <code>${amazon}</code></p>
      </section>`; }
  },
  Profile:{
    render(){ 
      const user = App.state.user || {};
      const fname = user.fname || '';
      const lname = user.lname || '';
      const full = `${fname} ${lname}`.trim();
      const payor = user.payor || '';
      const pcp = App.state.pcpName || '';
      const pcpCity = App.state.pcpCity || '';
      return `
      <section class='card'>
        <div class='h1'>${App.t('Profile')}</div>
        ${full?`<p><strong>${App.t('Full Name')}:</strong> ${full}</p>`:''}
        ${payor?`<p><strong>${App.t('Payor')}:</strong> ${payor}</p>`:''}
        ${pcp?`<p><strong>${App.t('PCP')}:</strong> ${pcp}${pcpCity?` (${pcpCity})`:''}</p>`:''}
        <form id='pf' class='grid'>
          <label class='form-row'>${App.t('Amazon Account Email')}
            <input class='input' name='amazon' value='${user.amazon||''}' placeholder='name@example.com'>
          </label>
          <button class='btn' type='submit'>${App.t('Save')}</button>
        </form>
      </section>`;
    },
    bind(){ $('#pf').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);
        const amazon = fd.get('amazon');
        if(App.state.user){
          App.state.user.amazon = amazon;
        }
        App.state.amazon = amazon; // mirror for backwards compatibility
        App.persist();
        alert(App.t('Saved'));
        // re-render to potentially update toggle text
        App.route();
    }); }
  },
  Celebration:{
    render(){ 
      const data = App.celebrationData || {};
      return `
      <div class='celebration-screen'>
        <div class='trophy-wrapper'>
          <div class='trophy'>🏆</div>
        </div>
        <div class='celebration-content'>
          <div class='milestone-title'>Achievement Unlocked!</div>
          <div class='reward-amount'>+$${data.reward || 0}</div>
          <div class='reward-text'>added to your gift card</div>
        </div>
        <div class='celebration-actions'>
          <button id='continue-btn' class='btn celebration-btn'>Continue</button>
          <a href='#dashboard' class='btn ghost celebration-btn'>Dashboard</a>
        </div>
      </div>`;
    },
    bind(){ 
      const data = App.celebrationData || {};
      $('#continue-btn').addEventListener('click', ()=>{ location.hash = data.next || '#dashboard'; });
      App.launchCelebrationConfetti(4000);
    }
  }
};

window.addEventListener('DOMContentLoaded',()=>App.init());
