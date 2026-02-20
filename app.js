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
  bindChrome(){
    $('#menuToggle').addEventListener('click', ()=>{ $('#sideMenu').hidden=false; });
    $('#closeMenu').addEventListener('click', ()=>{ $('#sideMenu').hidden=true; });
    $('#contrastToggle').addEventListener('click', ()=>{ document.documentElement.classList.toggle('high-contrast'); });
    $('#logoutBtn').addEventListener('click', ()=>{ this.state.user=null; this.persist(); this.refreshAuth(); location.hash='#login'; });

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
    const views = { login:Views.Login, signup:Views.Signup, 'signup-phone':Views.SignupPhone, 'signup-mfa':Views.SignupMFA, 'signup-payor':Views.SignupPayor, 'signup-amazon':Views.SignupAmazon, mfa:Views.MFA, dashboard:Views.Dashboard, pcp:Views.PCP, hra:Views.HRA, appointment:Views.Appointment, awv:Views.AWV, rewards:Views.Rewards, profile:Views.Profile, celebration:Views.Celebration };
    const View = views[r] || Views.Login;
    $('#screen').innerHTML = View.render();
    View.bind?.();
    this.refreshAuth();
    $$('.tab').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+r));
    $('#sideMenu').hidden=true;
  },
  celebrate(mId){
    if(this.state.celebrated[mId]) return; // avoid duplicates in demo
    this.state.celebrated[mId] = true; this.persist();
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
        <div class='h1'>Welcome to WellerU</div>
        <form id='f' class='grid'>
          <div class='form-row'><label>Email<input class='input' name='email' type='email' required></label></div>
          <div class='form-row'><label>Password<input class='input' name='pwd' type='password'></label></div>
          <button class='btn' type='submit'>Sign in</button>
          <button class='btn ghost' type='button' id='toSignup'>Create Account</button>
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
        App.persist();
        location.hash='#mfa';
      });
      $('#toSignup').addEventListener('click',()=>location.hash='#signup');
    }
  },
  Signup:{
    render(){return `
      <section class='card'>
        <div class='h1'>Create your account</div>
        <form id='sign' class='grid'>
          <label class='form-row'>First Name<input class='input' name='fname' required></label>
          <label class='form-row'>Last Name<input class='input' name='lname' required></label>
          <label class='form-row'>Email<input class='input' name='email' type='email' required></label>
          <label class='form-row'>Password<input class='input' name='pwd' type='password'></label>
          <label class='form-row'>Confirm Password<input class='input' name='pwdconfirm' type='password'></label>
          <button class='btn' type='submit'>Create Account</button>
        </form>
        <p style='font-size:0.85rem; color:#666; margin-top:2rem;'>
          This prototype stores data locally on your computer. Nothing is transmitted.
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
        <div class='h1'>Phone Verification</div>
        <p>This application requires a second form of authentication.</p>
        <form id='phone-form' class='grid'>
          <label class='form-row'>Phone Number<input class='input' name='phone' type='tel' placeholder='(XXX) XXX-XXXX' required></label>
          <label class='checkbox-row'>
            <input type='checkbox' name='smsOptIn' id='smsOptIn'>
            <span>SMS Opt-In: I agree to receive SMS messaging in support of authentication as described in the <a href='https://www.welleru.com/smsprivacy' target='_blank'>SMS Privacy Policy</a></span>
          </label>
          <button class='btn' type='submit' id='validatePhoneBtn' disabled>Validate Phone Number</button>
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
        <div class='h1'>Multi-Factor Authentication</div>
        <p>Enter the 6-digit code sent to your phone.</p>
        <form id='mfa-form' class='grid'>
          <label class='form-row'>6-Digit Code<input class='input' name='mfacode' type='text' pattern='\\d{6}' maxlength='6' value='${mfaCode}' required></label>
          <button class='btn' type='submit'>Next</button>
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
        <div class='h1'>Connect with Payor</div>
        <p>Enter your plan information to locate your account.</p>
        ${!payor ? `
        <form id='payor-form' class='grid'>
          <label class='form-row'>Plan ID (6 digits)<input class='input' name='plan' type='text' placeholder='XXX-XXX' required></label>
          <label class='form-row'>Group ID (6 digits)<input class='input' name='group' type='text' placeholder='XXX-XXX' required></label>
          <label class='form-row'>Date of Birth<input class='input' name='dob' type='date' required></label>
          <button class='btn' type='submit'>Submit</button>
        </form>` : `
        <p><strong>Payor identified:</strong> ${payor}</p>
        <button id='confirmPayor' class='btn'>Confirm Payor</button>`}
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
        <div class='h1'>Wellness Rewards</div>
        <p>Your wellness journey is rewarded through an Amazon gift card.</p>
        <form id='amazon-form' class='grid'>
          <label class='form-row'>Amazon Account Email<input class='input' name='amazon' type='email' value='${email}' required></label>
          <button class='btn' type='submit'>Continue</button>
        </form>
      </section>`;},
    bind(){
      const form = $('#amazon-form');
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const fd = new FormData(form);
        const email = App.state.signupSession.email;
        
        // Create final user object (without password)
        const user = {
          email,
          fname: App.state.signupSession.fname,
          lname: App.state.signupSession.lname,
          phone: App.state.signupSession.phone,
          dob: App.state.signupSession.dob,
          plan: App.state.signupSession.plan,
          group: App.state.signupSession.group,
          payor: App.state.signupSession.payor,
          amazon: fd.get('amazon'),
          journey:{m1:false,m2:false,m3:false,m4:false,m5:false}
        };
        
        App.state.users[email] = user;
        App.state.user = user;
        delete App.state.signupSession;
        App.persist();
        
        // Mark M1 complete and fire celebration
        App.state.user.journey.m1 = true;
        App.persist();
        App.celebrate('M1');
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
      const names = {M1:'Create Account',M2:'Select PCP',M3:'Complete HRA',M4:'Make Appointment',M5:'Complete AWV',default:'View Rewards'};
      const nextKey = !j.m2 ? 'M2' : !j.m3 ? 'M3' : !j.m4 ? 'M4' : !j.m5 ? 'M5' : 'default';
      const nextName = names[nextKey];
      const earn=(j.m1?5:0)+(j.m2?5:0)+(j.m3?5:0)+(j.m4?10:0)+(j.m5?50:0);
      return `
        <section class='card'>
          <div class='h1'>Your Journey</div>
          <div class='progress' aria-valuenow='${pct}'><span style='width:${pct}%'></span></div>
          <div class='kpi'><span>${pct}% complete</span><span class='badge'>$${earn} earned</span></div>
        </section>
        <section class='card'>
          <div class='h2'>Milestones</div>
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
        <div class='h1'>Primary Care Provider</div>
        <p><strong>Current:</strong> ${cur}</p>
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
        if(!alreadyRewarded){
          App.state.user.journey.m2=true;
          App.persist();
          App.celebrate('M2');
        }else{
          location.hash='#dashboard';
        }
      });
      const providers=[{name:'Dr. Lee',specialty:'Family Medicine',city:'Grapevine'},{name:'Dr. Patel',specialty:'Internal Medicine',city:'Dallas'},{name:'Dr. Garcia',specialty:'Family Medicine',city:'Irving'}];
      const render=q=>{ const wrap=$('#list'); wrap.innerHTML=''; providers.filter(p=>!q||`${p.name} ${p.city}`.toLowerCase().includes(q.toLowerCase())).forEach(p=>{ const d=document.createElement('div'); d.className='card'; d.innerHTML=`<strong>${p.name}</strong><br><small>${p.specialty} • ${p.city}</small><br><button class='btn pick'>Select</button>`; d.querySelector('.pick').addEventListener('click',()=>{App.state.pcpName=p.name;App.persist();if(!alreadyRewarded){App.state.user.journey.m2=true;App.persist();App.celebrate('M2');}else{location.hash='#dashboard';}}); wrap.appendChild(d); }); };
      render(''); $('#q').addEventListener('input',e=>render(e.target.value));
    }
  },
  HRA:{
    render(){ 
      const a=App.state.hra||{}; 
      const page = App.state.hraPage || 1;
      const q1to3 = HRA.slice(0,3);
      const q4to5 = HRA.slice(3);
      const currentQuestions = page === 1 ? q1to3 : q4to5;
      const answered = Object.keys(a).length;
      const complete = HRA.every(q=>!q.req||a[q.id]);
      
      let questionsHtml = '';
      currentQuestions.forEach(q=>{
        if(q.type==='number'){
          questionsHtml += `<div class='form-row'><label>${q.q}${q.req?" <span class='badge'>*</span>":''}<input class='input' type='number' data-id='${q.id}' value='${a[q.id]||''}'></label></div>`;
        }else{
          questionsHtml += `<div class='form-row'><label>${q.q}${q.req?" <span class='badge'>*</span>":''}<select class='input' data-id='${q.id}'><option value=''>Select...</option>${(q.opts||[]).map(o=>`<option ${a[q.id]===o?'selected':''}>${o}</option>`).join('')}</select></label></div>`;
        }
      });
      
      return `
      <section class='card'>
        <div class='h1'>Health Risk Assessment</div>
        <p>Page ${page} of 2</p>
        <form id='hf'>${questionsHtml}</form>
        <div class='progress'><span style='width:${Math.round(answered/HRA.length*100)}%'></span></div>
        <div class='grid' style='margin-top:1rem;'>
          ${page === 2 ? `<button id='prevBtn' class='btn ghost'>Previous</button>` : ''}
          ${page === 1 ? `<button id='nextBtn' class='btn'>Next</button>` : `
            <button id='prevBtn' class='btn ghost'>Previous</button>
            <button id='submit' class='btn' ${complete?'':'disabled'}>Submit HRA</button>
          `}
        </div>
      </section>`;},
    bind(){ 
      const form=$('#hf'); 
      const a=App.state.hra||{}; 
      
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
          App.state.hraPage = 2;
          App.persist();
          App.route();
        });
      }
      
      const prevBtn = $('#prevBtn');
      if(prevBtn){
        prevBtn.addEventListener('click',()=>{
          App.state.hraPage = 1;
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
    render(){ const a=App.state.appt||{}; return `
      <section class='card'>
        <div class='h1'>Make Appointment</div>
        <form id='af' class='grid'>
          <label class='form-row'>Date<input class='input' name='date' type='date' value='${a.date||''}' required></label>
          <label class='form-row'>Time<input class='input' name='time' type='time' value='${a.time||''}' required></label>
          <label class='form-row'>Location / Address<input class='input' name='loc' value='${a.loc||''}' required></label>
          <button class='btn' type='submit'>Save Appointment</button>
        </form>
      </section>`;},
    bind(){ $('#af').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);App.state.appt={date:fd.get('date'),time:fd.get('time'),loc:fd.get('loc')};App.state.user.journey.m4=true;App.persist();App.celebrate('M4');});
    }
  },
  AWV:{
    render(){ return `
      <section class='card'>
        <div class='h1'>Confirm AWV Completion</div>
        <p>Option 1: Upload visit summary (mock)</p>
        <input type='file' aria-label='Upload visit summary'>
        <p>Option 2: Mark as Completed</p>
        <button id='done' class='btn'>Mark as Completed</button>
      </section>`;},
    bind(){ $('#done').addEventListener('click',()=>{App.state.user.journey.m5=true;App.persist();App.celebrate('M5');location.hash='#dashboard';}); }
  },
  Rewards:{
    render(){ const j=App.state.user?.journey||{}; const total=(j.m1?5:0)+(j.m2?5:0)+(j.m3?5:0)+(j.m4?10:0)+(j.m5?50:0); return `
      <section class='card'>
        <div class='h1'>Rewards</div>
        <p>Total Earned: <strong>$${total}</strong></p>
        <p>Gift card account: <code>${App.state.amazon||'not linked'}</code></p>
      </section>`; }
  },
  Profile:{
    render(){ return `
      <section class='card'>
        <div class='h1'>Profile</div>
        <form id='pf' class='grid'>
          <label class='form-row'>Language
            <select class='input' name='lang'>
              <option value='en' selected>English</option>
              <option value='es'>Español</option>
            </select>
          </label>
          <label class='form-row'>Amazon account email
            <input class='input' name='amazon' value='${App.state.amazon||''}' placeholder='name@example.com'>
          </label>
          <button class='btn' type='submit'>Save</button>
        </form>
      </section>`;},
    bind(){ $('#pf').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target);App.state.amazon=fd.get('amazon');App.persist();alert('Saved');}); }
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
