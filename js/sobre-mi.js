(() => {
  const gallery = document.querySelector('.sobre-galeria');
  if (!gallery) return;
  const photos = [...gallery.querySelectorAll('.sobre-foto')];
  const controls = gallery.querySelector('.sobre-controles');
  const pause = gallery.querySelector('[data-pausa]');
  const counter = gallery.querySelector('[data-contador]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = reduced.matches, timer;
  function show(index) {
    current = (index + photos.length) % photos.length;
    photos.forEach((photo, i) => {
      photo.classList.toggle('visible', i === current);
      photo.setAttribute('aria-hidden', String(i !== current));
    });
    counter.textContent = `${current + 1} / ${photos.length}`;
  }
  function schedule() {
    clearInterval(timer);
    pause.textContent = paused ? 'Reanudar' : 'Pausar';
    if (!paused && !document.hidden && !gallery.matches(':hover') && !gallery.contains(document.activeElement)) {
      timer = setInterval(() => show(current + 1), 6000);
    }
  }
  controls.hidden = false;
  gallery.querySelector('[data-anterior]').addEventListener('click', () => { show(current - 1); schedule(); });
  gallery.querySelector('[data-siguiente]').addEventListener('click', () => { show(current + 1); schedule(); });
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  gallery.addEventListener('mouseenter', schedule);
  gallery.addEventListener('mouseleave', schedule);
  gallery.addEventListener('focusin', schedule);
  gallery.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { paused = reduced.matches; schedule(); });
  schedule();
})();
