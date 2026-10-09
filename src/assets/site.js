(function () {
  'use strict';

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Copy-email buttons: copy the address and confirm for two seconds.
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      if (ok) { resolve(); } else { reject(new Error('copy failed')); }
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.copy-email'), function (btn) {
    var label = btn.querySelector('.copy-email__label');
    var timer;
    btn.addEventListener('click', function () {
      copyText(btn.getAttribute('data-copy')).then(function () {
        label.textContent = 'Copied';
        btn.classList.add('is-copied');
        btn.setAttribute('aria-label', 'Email address copied');
      }, function () {
        label.textContent = 'Copy failed';
      });
      clearTimeout(timer);
      timer = setTimeout(function () {
        label.textContent = 'Copy';
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', 'Copy email address');
      }, 2000);
    });
  });

  // Explainer player: click to play; each scene shows for SCENE_MS, then the next.
  var player = document.querySelector('[data-player]');
  if (player) {
    var SCENE_MS = 7000;
    var scenes = player.querySelectorAll('.scene');
    var dots = player.querySelectorAll('.player__dot');
    var playBtn = player.querySelector('.player__play');
    var playLabel = player.querySelector('.player__play-label');
    var live = player.querySelector('[data-player-live]');
    var idx = 0, timer = null;
    player.style.setProperty('--scene-ms', SCENE_MS + 'ms');

    var showScene = function (i) {
      idx = i;
      Array.prototype.forEach.call(scenes, function (s, n) { s.classList.toggle('is-active', n === i); });
      Array.prototype.forEach.call(dots, function (d, n) {
        d.classList.toggle('is-active', n === i);
        d.classList.toggle('is-done', n < i);
        if (n === i) { d.setAttribute('aria-current', 'true'); } else { d.removeAttribute('aria-current'); }
      });
      live.textContent = scenes[i].querySelector('.scene__caption').textContent;
    };
    var setPlaying = function (on, label) {
      player.classList.toggle('is-playing', on);
      playBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      playLabel.textContent = label;
    };
    var tick = function () {
      if (idx < scenes.length - 1) {
        showScene(idx + 1);
        timer = setTimeout(tick, SCENE_MS);
      } else {
        clearTimeout(timer);
        setPlaying(false, 'Replay');
      }
    };
    var pause = function (label) { clearTimeout(timer); timer = null; setPlaying(false, label || 'Play'); };
    playBtn.addEventListener('click', function () {
      if (player.classList.contains('is-playing')) { pause('Play'); return; }
      if (playLabel.textContent === 'Replay') { showScene(0); }
      else { showScene(idx); }
      setPlaying(true, 'Pause');
      timer = setTimeout(tick, SCENE_MS);
    });
    Array.prototype.forEach.call(dots, function (d) {
      d.addEventListener('click', function () { pause('Play'); showScene(parseInt(d.getAttribute('data-go'), 10)); });
    });
  }

  // Contact form (FormSubmit). The AJAX endpoint is set at build time from src/config.mjs.
  // Without JS the form still posts to the action URL and FormSubmit redirects back.
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var fields = form.querySelector('.form__fields');
  var again = form.querySelector('.form__again');
  var button = form.querySelector('button[type="submit"]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Messages appear at the top of the form box and take focus, so they are seen
  // (and announced) wherever the visitor is on the page.
  function show(kind, title, message) {
    status.hidden = false;
    status.className = 'form__status form__status--' + kind;
    status.innerHTML = '';
    var strong = document.createElement('strong');
    strong.textContent = title;
    if (kind === 'ok') {
      var check = document.createElement('div');
      check.className = 'form__check';
      check.setAttribute('aria-hidden', 'true');
      check.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2B5BFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
      status.appendChild(check);
    }
    status.appendChild(strong);
    var text = document.createElement('span');
    text.textContent = message;
    status.appendChild(text);
    status.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    status.focus({ preventScroll: true });
  }

  again.addEventListener('click', function () {
    status.hidden = true;
    fields.hidden = false;
    again.hidden = true;
    form.classList.remove('form--sent');
    form.querySelector('input[name="name"]').focus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var endpoint = form.getAttribute('data-endpoint') || '';
    button.disabled = true;
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok || String(data.success) !== 'true') throw new Error('Request failed');
      });
    }).then(function () {
      form.reset();
      fields.hidden = true;
      again.hidden = false;
      form.classList.add('form--sent');
      show('ok', 'Message sent', 'Thank you. We reply within one business day.');
    }).catch(function () {
      show('error', 'Your message could not be sent', 'Please try again, or email hello@eonai.ai.');
    }).then(function () {
      button.disabled = false;
    });
  });
})();
