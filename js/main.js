// Vuelve la Luz — script compartido
document.addEventListener('DOMContentLoaded', function () {
  var boton = document.querySelector('.menu-toggle');
  var enlaces = document.querySelector('.nav-enlaces');

  if (boton && enlaces) {
    boton.addEventListener('click', function () {
      enlaces.classList.toggle('abierto');
    });
  }

  // Simulación de envío de formulario de contacto
  var formulario = document.querySelector('.formulario');
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var mensajeExito = formulario.querySelector('.mensaje-exito');
      if (mensajeExito) {
        mensajeExito.style.display = 'block';
      }
      formulario.reset();
    });
  }
});
