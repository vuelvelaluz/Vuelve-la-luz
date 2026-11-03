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
      message('Enter a valid email address, for example name@example.com.', true);
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
      button.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      message('We are sending your request…', false);
      try {
        var response = await fetch(endpoint.href, {
          method: 'POST', body: payload, credentials: 'omit', signal: controller.signal
        });
        var data = await response.json();
        if (response.ok && data && data.success === true) {
          // Double opt-in: acceptance is not proof of a confirmed subscription.
          message('Request received. If you have not confirmed your subscription yet, check your inbox (including spam) and follow the confirmation link. If you are already subscribed, there is nothing else to do.', false);
          form.reset();
          email.removeAttribute('aria-invalid');
        } else {
          var fieldError = data && data.errors && data.errors.EMAIL;
          if (typeof fieldError === 'string') {
            email.setAttribute('aria-invalid', 'true');
            email.setCustomValidity('Check your email address and try again.');
          }
          var detail = null; // Provider errors may be Spanish; use the translated fallback.
          message(typeof detail === 'string' && detail.trim() ? detail.slice(0,500) : 'Your request could not be accepted. Check the email address and try again later.', true);
        }
      } catch (error) {
        // A network failure may happen after Brevo accepts the email: never claim success.
        message('We could not confirm whether your request went through. Check for the confirmation email before trying again.', true);
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
