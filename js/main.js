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
  var formulario = document.querySelector('.formulario');
  if (formulario) {
    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      var mensajeExito = formulario.querySelector('.mensaje-exito');
      var boton = formulario.querySelector('button[type="submit"]');
      var datos = new FormData(formulario);
      var objeto = {};
      datos.forEach(function (valor, clave) { objeto[clave] = valor; });

      if (boton) { boton.disabled = true; }

      fetch('https://formsubmit.co/ajax/asalamamonsalve@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objeto)
      })
        .then(function () {
          if (mensajeExito) {
            mensajeExito.style.display = 'block';
          }
          formulario.reset();
        })
        .catch(function () {
          alert('Hubo un problema al enviar el mensaje. Prueba de nuevo o escríbeme directamente a asalamamonsalve@gmail.com.');
        })
        .finally(function () {
          if (boton) { boton.disabled = false; }
        });
    });
  }
});
