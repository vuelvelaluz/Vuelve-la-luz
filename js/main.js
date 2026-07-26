// Vuelve la Luz — script compartido
document.addEventListener('DOMContentLoaded', function () {
  var boton = document.querySelector('.menu-toggle');
  var enlaces = document.querySelector('.nav-enlaces');

  if (boton && enlaces) {
    boton.addEventListener('click', function () {
      enlaces.classList.toggle('abierto');
    });
  }

  // Envío del formulario de contacto a asalamamonsalve@gmail.com
  // Envío nativo del navegador (sin fetch/AJAX) para evitar bloqueadores
  // de anuncios/rastreadores que interceptan llamadas JS a dominios externos.
  var formulario = document.querySelector('.formulario');
  if (formulario) {
    formulario.addEventListener('submit', function () {
      var mensajeExito = formulario.querySelector('.mensaje-exito');
      if (mensajeExito) {
        mensajeExito.style.display = 'block';
      }
      window.setTimeout(function () {
        formulario.reset();
      }, 50);
    });
  }
});
