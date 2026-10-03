/* Analytics solo se carga después de aceptar la medición. */
(function () {
  'use strict';
  var measurementId = 'G-C7VNMRWLS2';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
  var storageKey = 'vll-analytics-consent-v1';
  var choice = null;
  var loaded = false;
  var expires = 180 * 24 * 60 * 60 * 1000;
  try {
    var saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && Date.now() - saved.time < expires) choice = saved.value;
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  function cleanURL(value) {
    try { var u = new URL(value); return u.origin + u.pathname; } catch (_) { return ''; }
  }
  function start() {
    window['ga-disable-' + measurementId] = false;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) return;
    loaded = true;
    gtag('js', new Date());
    gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 15552000,
      cookie_update: false,
      page_location: cleanURL(location.href),
      page_referrer: cleanURL(document.referrer)
    });
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }
  function stop() {
    window['ga-disable-' + measurementId] = true;
    gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', location.hostname, '.' + location.hostname].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  }
  function event(name, params) {
    if (choice === 'accepted') gtag('event', name, params);
  }
  function init() {
    var banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Preferencias de estadísticas');
    banner.innerHTML = '<p><strong>¿Nos ayudas a conocer este espacio?</strong> Con tu permiso, usamos Google Analytics para medir visitas y uso de las prácticas. Puedes aceptar o rechazar y cambiar tu decisión en cualquier momento. <a href="/cookies.html">Información sobre cookies</a>.</p><div class="analytics-actions"><button type="button" data-choice="accepted">Aceptar estadísticas</button><button type="button" data-choice="rejected">Rechazar estadísticas</button></div>';
    banner.hidden = choice !== null;
    document.body.appendChild(banner);
    var settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'analytics-settings';
    settings.textContent = 'Configurar cookies';
    (document.querySelector('.pie .container') || document.body).appendChild(settings);
    settings.addEventListener('click', function () {
      banner.hidden = false;
      banner.querySelector('button').focus();
    });
    banner.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        choice = button.dataset.choice;
        try { localStorage.setItem(storageKey, JSON.stringify({value: choice, time: Date.now()})); } catch (_) {}
        if (choice === 'accepted') start(); else stop();
        banner.hidden = true;
        settings.focus({preventScroll: true});
      });
    });
    if (choice === 'accepted') start(); else stop();
    document.querySelectorAll('audio').forEach(function (audio) {
      var started = false;
      function params() {
        var source = audio.querySelector('source');
        return { audio_name: (source ? source.getAttribute('src') : 'audio').split('/').pop() };
      }
      audio.addEventListener('play', function () {
        if (choice === 'accepted' && !started) { event('audio_start', params()); started = true; }
      });
      audio.addEventListener('ended', function () { event('audio_complete', params()); });
    });
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href.indexOf('https://vuelve-la-luz-beta.vercel.app/') === 0) event('app_visit', {destination: 'aplicacion_21_dias'});
      if (/^(mailto:|https:\/\/(wa.me|api.whatsapp.com))/.test(href)) event('contact_click', {method: href.indexOf('mailto:') === 0 ? 'email' : 'whatsapp'});
    });
    document.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', function () {
        if (form.classList.contains('newsletter-form')) event('newsletter_form_submit', {form_name: 'newsletter'});
        else if (form.classList.contains('formulario')) event('contact_form_submit', {form_name: 'contacto'});
      });
    });
    window.addEventListener('storage', function (e) { if (e.key === storageKey) location.reload(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
