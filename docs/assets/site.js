(function () {
  'use strict';
  document.documentElement.classList.add('js');

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

  // Contact form. The endpoint comes from the form's action attribute, set at build time (src/config.mjs).
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var button = form.querySelector('button[type="submit"]');

  function show(kind, message) {
    status.hidden = false;
    status.className = 'form__status form__status--' + kind;
    status.textContent = message;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var endpoint = form.getAttribute('action') || '';
    if (!/^https:\/\//.test(endpoint)) {
      show('error', 'The form is not connected yet. Please email hello@eonai.ai instead.');
      return;
    }
    button.disabled = true;
    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      show('ok', 'Thank you. Your message has been sent. We reply within one business day.');
    }).catch(function () {
      show('error', 'Your message could not be sent. Please try again, or email hello@eonai.ai.');
    }).then(function () {
      button.disabled = false;
    });
  });
})();
