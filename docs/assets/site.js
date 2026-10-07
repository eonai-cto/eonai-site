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

  // Contact form (FormSubmit). The AJAX endpoint is set at build time from src/config.mjs.
  // Without JS the form still posts to the action URL and FormSubmit redirects back.
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
      show('ok', 'Thank you. Your message has been sent. We reply within one business day.');
    }).catch(function () {
      show('error', 'Your message could not be sent. Please try again, or email hello@eonai.ai.');
    }).then(function () {
      button.disabled = false;
    });
  });
})();
