// Vuelve la Luz — script compartido
document.addEventListener('DOMContentLoaded', function () {
  var boton = document.querySelector('.menu-toggle');
  var enlaces = document.querySelector('.nav-enlaces');

  if (boton && enlaces) {
    boton.addEventListener('click', function () {
      enlaces.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', enlaces.classList.contains('abierto') ? 'true' : 'false');
    });
  }

});

// Brevo: enhance only newsletter forms; the native HTML submission remains a fallback.
document.addEventListener('DOMContentLoaded', function () {
  if (!window.fetch || !window.FormData || !window.AbortController) return;

  document.querySelectorAll('.newsletter-form').forEach(function (form, index) {
    var email = form.querySelector('input[name="EMAIL"]');
    var button = form.querySelector('button[type="submit"]');
    if (!email || !button) return;
    var busy = false;
    var originalLabel = button.textContent;
    var status = document.createElement('p');
    status.id = 'newsletter-status-' + index;
    status.className = 'newsletter-texto newsletter-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.hidden = true;
    form.appendChild(status);
    email.setAttribute('aria-describedby', ((email.getAttribute('aria-describedby') || '') + ' ' + status.id).trim());

    function message(text, error) {
      status.textContent = text;
      status.hidden = false;
      status.setAttribute('data-state', error ? 'error' : 'success');
    }

    email.addEventListener('input', function () {
      email.setCustomValidity('');
      email.removeAttribute('aria-invalid');
      status.hidden = true;
    });
    email.addEventListener('invalid', function () {
      email.setAttribute('aria-invalid', 'true');
      message('Escribe una dirección de correo válida, por ejemplo nombre@dominio.com.', true);
    });

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (busy) return;
      email.value = email.value.trim();
      if (!form.reportValidity()) return;
      var payload = new FormData(form);
      // This flag is only for Brevo's non-JavaScript HTML response.
      payload.delete('html_type');
      var endpoint = new URL(form.action);
      endpoint.searchParams.set('isAjax', '1');
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, 20000);
      busy = true;
      button.disabled = true;
      button.textContent = 'Enviando…';
      form.setAttribute('aria-busy', 'true');
      message('Estamos enviando tu solicitud…', false);
      try {
        var response = await fetch(endpoint.href, {
          method: 'POST', body: payload, credentials: 'omit', signal: controller.signal
        });
        var data = await response.json();
        if (response.ok && data && data.success === true) {
          // Double opt-in: acceptance is not proof of a confirmed subscription.
          message('Solicitud recibida. Si aún no has confirmado tu suscripción, revisa tu correo (también spam) y pulsa el enlace de confirmación. Si ya estabas suscrita, no necesitas hacer nada más.', false);
          form.reset();
          email.removeAttribute('aria-invalid');
        } else {
          var fieldError = data && data.errors && data.errors.EMAIL;
          if (typeof fieldError === 'string') {
            email.setAttribute('aria-invalid', 'true');
            email.setCustomValidity(fieldError);
          }
          var detail = fieldError || (data && data.message);
          message(typeof detail === 'string' && detail.trim() ? detail.slice(0,500) : 'No se ha podido aceptar la solicitud. Revisa el correo e inténtalo de nuevo más tarde.', true);
        }
      } catch (error) {
        // A network failure may happen after Brevo accepts the email: never claim success.
        message('No hemos podido comprobar el resultado del envío. Revisa si te ha llegado el correo de confirmación antes de volver a intentarlo.', true);
      } finally {
        clearTimeout(timer);
        busy = false;
        button.disabled = false;
        button.textContent = originalLabel;
        form.removeAttribute('aria-busy');
      }
    });
  });
});
