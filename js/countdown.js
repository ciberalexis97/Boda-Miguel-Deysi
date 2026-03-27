/* ============================================
   WEDDING INVITATION - MIGUEL ÁNGEL & DEISY LIZETH
   COUNTDOWN.JS - Wedding Countdown Timer
   ============================================ */

'use strict';

(function () {
  // ── Wedding date ──
  const WEDDING_DATE = new Date('2027-10-05T11:00:00');

  const els = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  if (!els.days) return; // Not on a countdown page

  let prevValues = {};

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now   = new Date();
    const diff  = WEDDING_DATE - now;

    if (diff <= 0) {
      // Wedding day!
      Object.values(els).forEach(el => {
        if (el) el.textContent = '00';
      });
      const msg = document.getElementById('countdown-msg');
      if (msg) {
        msg.textContent = '¡Hoy es el gran día! 💍';
        msg.style.display = 'block';
      }
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const values = {
      days:    pad(days),
      hours:   pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };

    Object.entries(values).forEach(([key, val]) => {
      const el = els[key];
      if (!el) return;

      if (val !== prevValues[key]) {
        // Flip animation
        el.style.animation = 'none';
        el.offsetHeight; // reflow
        el.style.animation = 'digitFlip 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) both';
        el.textContent = val;
        prevValues[key] = val;
      }
    });
  }

  // Initial call
  updateCountdown();

  // Update every second
  setInterval(updateCountdown, 1000);

  // ── Add glow pulse to boxes ──
  document.querySelectorAll('.countdown-box').forEach((box, i) => {
    box.style.animationDelay = `${i * 0.3}s`;
  });

})();
