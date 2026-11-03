/* Analytics solo se carga después de aceptar la medición. */
(function () {
  'use strict';
  var measurementId = 'G-C7VNMRWLS2';
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;
  var storageKey = 'vll-analytics-consent-v1';
  var exclusionKey = 'vll-analytics-excluded-v1';
  function excluded() {
    try { return localStorage.getItem(exclusionKey) === '1'; } catch (_) { return false; }
  }
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
    if (excluded()) { stop(); return; }
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
    if (choice === 'accepted' && !excluded()) gtag('event', name, params);
  }
  function init() {
    var banner = document.createElement('section');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Analytics preferences');
    banner.innerHTML = '<p><strong>Help us understand how this space is used</strong> With your permission, we use Google Analytics to measure visits and use of the practices. You can accept or decline and change your choice at any time. <a href="/en/cookies.html">Cookie information</a>.</p><div class="analytics-actions"><button type="button" data-choice="accepted">Accept analytics</button><button type="button" data-choice="rejected">Decline analytics</button></div>';
    if (excluded()) {
      banner.querySelector('p').innerHTML = 'This browser is excluded from analytics. You can continue listening to your meditations. <a href="/mis-visitas.html">Manage exclusion</a>.';
    }
    banner.hidden = excluded() || choice !== null;
    document.body.appendChild(banner);
    var settings = document.createElement('button');
    settings.type = 'button';
    settings.className = 'analytics-settings';
    settings.textContent = 'Cookie settings';
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
    window.addEventListener('storage', function (e) { if (e.key === storageKey || e.key === exclusionKey) location.reload(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
