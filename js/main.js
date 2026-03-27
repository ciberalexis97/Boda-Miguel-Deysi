/* ============================================
   MAIN.JS  —  Wedding Invitation
   Music: intro splash ensures real user gesture
           → audio.play() never blocked.
   ============================================ */
'use strict';

/* ════════════════════════════════════════════
   INTRO SPLASH  (shown once per session)
   The click IS the user gesture → audio plays.
════════════════════════════════════════════ */
(function splashModule() {

  const SEEN_KEY = 'wedding_splash_done';
  const PLAY_KEY = 'wedding_music_on';

  // Build splash only if audio exists on this page
  const audio = document.getElementById('bg-audio');
  if (!audio) return;

  // If already dismissed this session AND user had music on → just play
  if (sessionStorage.getItem(SEEN_KEY) === '1') {
    if (localStorage.getItem(PLAY_KEY) !== 'false') {
      audio.volume = 0.32;
      audio.loop   = true;
      audio.play().catch(() => {});   // usually succeeds after first-page interaction
    }
    return;
  }

  /* ── Build splash overlay ── */
  const splash = document.createElement('div');
  splash.id = 'intro-splash';
  splash.innerHTML = `
    <div class="splash-inner">
      <div class="splash-rings">💍 💍</div>
      <h1 class="splash-title">Miguel Ángel<br><span class="splash-amp">&amp;</span><br>Deisy Lizeth</h1>
      <p class="splash-date">✦ &nbsp;05 · Octubre · 2027&nbsp; ✦</p>
      <div class="splash-line"></div>
      <p class="splash-msg">Estás invitado/a a nuestra boda</p>
      <button id="splash-btn">
        <span class="splash-btn-icon">🎵</span>
        <span>Entrar a la Invitación</span>
      </button>
      <p class="splash-note">Con música · Toca para comenzar</p>
    </div>`;

  /* ── Styles injected inline so they don't depend on external CSS load order ── */
  const style = document.createElement('style');
  style.textContent = `
    #intro-splash {
      position: fixed; inset: 0; z-index: 9999;
      background: radial-gradient(ellipse at center,
        #4A0E1A 0%, #130609 70%);
      display: flex; align-items: center; justify-content: center;
      flex-direction: column;
      opacity: 1;
      transition: opacity 0.9s ease;
    }
    #intro-splash.hide {
      opacity: 0; pointer-events: none;
    }
    .splash-inner {
      text-align: center;
      padding: 2rem 2.5rem;
      animation: fadeInUp 1s ease 0.2s both;
    }
    .splash-rings {
      font-size: 2.2rem;
      margin-bottom: 1.2rem;
      animation: heartBeat 2s ease-in-out infinite;
      filter: drop-shadow(0 0 16px rgba(201,168,76,0.7));
    }
    .splash-title {
      font-family: 'Great Vibes', cursive;
      font-size: clamp(2.8rem, 8vw, 5rem);
      color: #C9A84C;
      line-height: 1.05;
      text-shadow: 0 0 30px rgba(201,168,76,0.5),
                   0 0 60px rgba(201,168,76,0.2);
      margin: 0 0 0.8rem;
    }
    .splash-amp {
      font-size: 0.6em;
      color: rgba(255,255,255,0.6);
    }
    .splash-date {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      letter-spacing: 4px;
      color: #E8C96A;
      opacity: 0.85;
      margin-bottom: 1.5rem;
    }
    .splash-line {
      width: 120px; height: 1px;
      background: linear-gradient(90deg, transparent, #C9A84C, transparent);
      box-shadow: 0 0 12px rgba(201,168,76,0.5);
      margin: 0 auto 1.5rem;
    }
    .splash-msg {
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      font-size: 1.1rem;
      color: #FAF6F0;
      opacity: 0.75;
      margin-bottom: 2rem;
    }
    #splash-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.9rem 2.5rem;
      background: linear-gradient(135deg, #C9A84C, #E8C96A, #C9A84C);
      border: none;
      border-radius: 50px;
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 2.5px;
      color: #130609;
      cursor: pointer;
      box-shadow: 0 0 30px rgba(201,168,76,0.55),
                  0 0 70px rgba(201,168,76,0.2);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: goldPulse 2.5s ease-in-out infinite;
    }
    #splash-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 0 45px rgba(201,168,76,0.75),
                  0 0 90px rgba(201,168,76,0.3);
    }
    .splash-btn-icon { font-size: 1.1rem; }
    .splash-note {
      font-family: 'Cinzel', serif;
      font-size: 0.6rem;
      letter-spacing: 2px;
      color: rgba(201,168,76,0.45);
      margin-top: 1.2rem;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(splash);

  /* ── Handle button click ── */
  document.getElementById('splash-btn').addEventListener('click', function () {
    // THIS click is the user gesture — play audio immediately
    audio.volume = 0.32;
    audio.loop   = true;
    audio.play().then(() => {
      setPlayerUI(true);
      localStorage.setItem(PLAY_KEY, 'true');
    }).catch(() => {
      localStorage.setItem(PLAY_KEY, 'true');
    });

    sessionStorage.setItem(SEEN_KEY, '1');

    // Fade out splash
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 950);
  });

})();


/* ════════════════════════════════════════════
   MUSIC PLAYER UI  (floating bottom-right)
════════════════════════════════════════════ */
const PLAY_KEY = 'wedding_music_on';

function setPlayerUI(playing) {
  const btn  = document.getElementById('music-toggle');
  const bars = document.querySelector('.music-bars');
  if (btn)  btn.innerHTML = playing ? '⏸' : '▶';
  if (bars) bars.classList.toggle('playing', playing);
}

(function playerModule() {
  const audio = document.getElementById('bg-audio');
  const btn   = document.getElementById('music-toggle');
  if (!audio || !btn) return;

  audio.volume = 0.32;
  audio.loop   = true;

  // Sync icon from audio events
  audio.addEventListener('playing', () => setPlayerUI(true));
  audio.addEventListener('pause',   () => setPlayerUI(false));

  // Toggle button
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        localStorage.setItem(PLAY_KEY, 'true');
      }).catch(() => {});
    } else {
      audio.pause();
      localStorage.setItem(PLAY_KEY, 'false');
    }
  });

  // Set initial icon (splash hasn't played yet = paused)
  setPlayerUI(!audio.paused);

})();


/* ════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════ */
(function navModule() {

  const nav  = document.querySelector('nav.navbar');
  const ham  = document.getElementById('hamburger');
  const menu = document.querySelector('.nav-links');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mark active link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if ((a.getAttribute('href') || '') === page) a.classList.add('active');
  });

  if (!ham || !menu) return;

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('active', open);
    const s = ham.querySelectorAll('span');
    if (open) {
      s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      s[1].style.opacity   = '0';
      s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      s[0].style.transform = s[2].style.transform = '';
      s[1].style.opacity   = '';
    }
  });

  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('active');
    })
  );

})();


/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));
})();


/* ════════════════════════════════════════════
   HERO PARALLAX + SPARKLES
════════════════════════════════════════════ */
(function () {
  const bg = document.querySelector('.hero-bg');
  if (bg) {
    window.addEventListener('scroll', () => {
      bg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.22}px)`;
    }, { passive: true });
  }

  const pc = document.querySelector('.hero-particles');
  if (pc) {
    const colors = ['#C9A84C','#E8C96A','#F5E6B8','#7B1C2E','#FFFFFF'];
    for (let i = 0; i < 26; i++) {
      const d = document.createElement('div');
      const sz = Math.random() * 4 + 1;
      const c  = colors[Math.floor(Math.random() * colors.length)];
      const dr = (Math.random() * 6 + 5).toFixed(1);
      const dl = (Math.random() * 8).toFixed(1);
      d.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;
        background:${c};border-radius:50%;
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        opacity:${(Math.random()*.55+.2).toFixed(2)};
        box-shadow:0 0 ${sz*3}px ${c};
        animation:floatSlow ${dr}s ease-in-out ${dl}s infinite,
                  sparkle ${(+dr*1.2).toFixed(1)}s ease-in-out ${dl}s infinite;
        pointer-events:none;`;
      pc.appendChild(d);
    }
  }

  // Scroll arrow
  const arr = document.querySelector('.hero-scroll');
  if (arr) {
    arr.style.cursor = 'pointer';
    arr.addEventListener('click', () => {
      (document.querySelector('#section-heart') ||
       document.querySelector('#countdown-section') ||
       document.querySelector('section:nth-of-type(2)')
      )?.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();


/* ════════════════════════════════════════════
   PHOTO ERROR → PLACEHOLDER
════════════════════════════════════════════ */
(function () {
  document.querySelectorAll('img[data-placeholder]').forEach(img => {
    img.addEventListener('error', function () {
      const label = this.getAttribute('data-placeholder') || 'Foto';
      const ph = document.createElement('div');
      const w  = this.getAttribute('width')  || '100%';
      const h  = this.getAttribute('height') || '200';
      ph.style.cssText = `
        width:${isNaN(w)?w:w+'px'};height:${isNaN(h)?h:h+'px'};
        border-radius:inherit;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:8px;
        font-family:'Cinzel',serif;font-size:.6rem;letter-spacing:2px;
        color:#C9A84C;text-align:center;padding:1rem;
        background:linear-gradient(135deg,#4A0E1A 0%,rgba(123,28,46,.4) 100%);
        border:1px dashed rgba(201,168,76,.3);`;
      ph.innerHTML = `<span style="font-size:2rem">📷</span><span>${label}</span>`;
      this.parentElement.replaceChild(ph, this);
    });
  });
})();


/* ════════════════════════════════════════════
   QR CODE
════════════════════════════════════════════ */
function generateQR(id, url) {
  const el = document.getElementById(id);
  if (!el || typeof QRCode === 'undefined') return;
  new QRCode(el, {
    text: url, width: 180, height: 180,
    colorDark: '#7B1C2E', colorLight: '#FFFFFF',
    correctLevel: QRCode.CorrectLevel.H,
  });
}


/* ════════════════════════════════════════════
   WEATHER WIDGET
════════════════════════════════════════════ */
async function loadWeather() {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;
  const ICONS = {
    0:['☀️','Despejado'], 1:['🌤️','Mayormente despejado'],
    2:['⛅','Parcialmente nublado'], 3:['☁️','Nublado'],
    45:['🌫️','Niebla'], 61:['🌧️','Lluvia ligera'],
    63:['🌧️','Lluvia moderada'], 80:['🌦️','Chubascos'], 95:['⛈️','Tormenta'],
  };
  try {
    const d = await fetch(
      'https://archive-api.open-meteo.com/v1/archive' +
      '?latitude=18.006&longitude=-94.517' +
      '&start_date=2024-10-05&end_date=2024-10-05' +
      '&daily=temperature_2m_max,temperature_2m_min,weathercode' +
      '&timezone=America%2FMexico_City'
    ).then(r => r.json());
    const maxT = Math.round(d.daily.temperature_2m_max[0]);
    const minT = Math.round(d.daily.temperature_2m_min[0]);
    const [icon, desc] = ICONS[d.daily.weathercode[0]] || ['🌡️','Variable'];
    widget.innerHTML = `
      <div class="weather-icon animate-float">${icon}</div>
      <div class="weather-info">
        <div class="weather-city">✦ Clima estimado · 5 Oct</div>
        <div class="weather-temp glow-text">${maxT}°<span style="font-size:1.4rem;color:var(--gold-pale);opacity:.6">/${minT}°C</span></div>
        <div class="weather-desc">${desc}</div>
        <div style="font-family:var(--font-accent);font-size:.58rem;color:var(--gold-pale);opacity:.45;margin-top:4px;letter-spacing:1px;">Promedio histórico · Veracruz</div>
      </div>`;
  } catch {
    widget.innerHTML = `
      <div class="weather-icon animate-float">🌤️</div>
      <div class="weather-info">
        <div class="weather-city">✦ Clima · 5 Oct 2027</div>
        <div class="weather-temp glow-text">28°<span style="font-size:1.4rem;color:var(--gold-pale);opacity:.6">/21°C</span></div>
        <div class="weather-desc">Cálido y parcialmente nublado</div>
        <div style="font-family:var(--font-accent);font-size:.58rem;color:var(--gold-pale);opacity:.45;margin-top:4px;letter-spacing:1px;">Promedio histórico · Veracruz</div>
      </div>`;
  }
}


/* ════════════════════════════════════════════
   DOM READY
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  generateQR('qr-whatsapp',
    'https://wa.me/9221224111?text=Hola!+Confirmo+mi+asistencia+a+la+boda+de+Miguel+%C3%81ngel+y+Deisy+Lizeth+el+5+de+Octubre+2027+%F0%9F%92%8D');
  loadWeather();
});
