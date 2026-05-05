(function () {
  function digitsOnly(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function setError(form, fieldName, message) {
    const errorNode = form.querySelector(`[data-error-for="${fieldName}"]`);
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (errorNode) errorNode.textContent = message || '';
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate(form) {
    let valid = true;
    const messages = form.dataset;

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      if (field.type === 'hidden') return;
      setError(form, field.name, '');

      if (field.type === 'checkbox' && field.required && !field.checked) {
        setError(form, field.name, messages.errorConsent || messages.errorRequired);
        valid = false;
        return;
      }

      if (field.required && !field.value.trim()) {
        setError(form, field.name, messages.errorRequired);
        valid = false;
        return;
      }

      if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        setError(form, field.name, messages.errorEmail);
        valid = false;
      }

      if (field.type === 'tel' && field.value && digitsOnly(field.value).length < 10) {
        setError(form, field.name, messages.errorPhone);
        valid = false;
      }
    });

    return valid;
  }

  function fillHiddenFields(form) {
    const utm = window.UTM ? window.UTM.get() : {};
    form.querySelectorAll('[data-utm-field]').forEach((field) => {
      const key = field.name.replace('utm_', '');
      field.value = utm[key] || utm[field.name] || field.value || '';
    });

    const pageUrl = form.querySelector('[name="page_url"]');
    if (pageUrl) pageUrl.value = window.location.href;

    const notes = form.querySelector('[name="agent_notes"]');
    if (notes) {
      const seconds = Math.round((performance.now ? performance.now() : 0) / 1000);
      notes.value = `High intent lead submitted after ${seconds}s on page.`;
    }
  }

  function emit(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params || {}));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.tsrg-lead-form');
    if (!form) return;

    let formStarted = false;
    form.addEventListener('focusin', () => {
      if (formStarted) return;
      formStarted = true;
      emit('form_start', { campaign_id: document.body.dataset.campaignId });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      fillHiddenFields(form);

      if (!validate(form)) return;

      const submit = form.querySelector('[type="submit"]');
      const status = form.querySelector('.tsrg-form-status');
      const originalText = submit.dataset.submitText;

      submit.disabled = true;
      submit.textContent = submit.dataset.loadingText;
      if (status) status.textContent = '';

      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });

        const data = await response.json();
        if (response.status === 429) throw new Error(data.error || 'Too many requests. Please wait a moment.');
        if (!response.ok || !data.success) throw new Error(data.error || form.dataset.errorSubmit);

        emit('form_submit', {
          campaign_id: document.body.dataset.campaignId,
          user_intent_segment: document.body.dataset.intentSegment
        });

        let nextSteps = [];
        try { nextSteps = JSON.parse(form.dataset.nextSteps || '[]'); } catch (_) {}

        const stepsHtml = nextSteps.length
          ? `<ol class="tsrg-next-steps">${nextSteps.map((s) => `<li><span class="material-symbols-outlined" aria-hidden="true">${s.icon}</span><span>${s.text}</span></li>`).join('')}</ol>`
          : '';

        form.innerHTML = `
          <div class="tsrg-form-success">
            <span class="material-symbols-outlined tsrg-form-success__icon" aria-hidden="true">check_circle</span>
            <h3>You're all set!</h3>
            <p>${form.dataset.successMessage}</p>
            ${stepsHtml}
          </div>`;
      } catch (error) {
        console.error(error);
        if (status) status.textContent = form.dataset.errorSubmit;
        submit.disabled = false;
        submit.textContent = originalText;
      }
    });
  });
})();
