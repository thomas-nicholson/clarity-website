/* iPhone launch notifications only. No analytics, browser storage or auto-retry. */
(() => {
  'use strict';
  const form = document.querySelector('#waitlist');
  if (!form) return;
  const email = form.elements.email;
  const consent = form.elements.consent;
  const submit = form.querySelector('button[type=submit]');
  const status = document.querySelector('#form-status');
  const availability = document.querySelector('#availability-note');
  const emailHelp = document.querySelector('#email-help');
  const consentHelp = document.querySelector('#consent-help');
  let pending = false;
  let complete = false;
  const touched = new Set();
  const timeoutMs = 12000;

  function endpoint() {
    const base = window.CLARITY_CONFIG?.waitlistApiBase;
    if (typeof base !== 'string' || !base.trim()) return null;
    try {
      const url = new URL(base.trim());
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
      if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) return null;
      if (url.username || url.password || url.search || url.hash) return null;
      return url.href.replace(/\/+$/, '') + '/v1/waitlist';
    } catch { return null; }
  }
  if (!endpoint()) {
    availability.textContent = 'The waitlist is not open yet. This form cannot save your email right now. Please check back later.';
  } else {
    availability.textContent = 'Your email is used only for Clarity’s iPhone launch notifications. It is not published on this website.';
  }

  function show(kind, heading, message) {
    status.dataset.kind = kind;
    status.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = heading;
    status.append(title, document.createTextNode(message));
    status.hidden = false;
  }
  function validateEmail() {
    const value = email.value.trim();
    const valid = value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && email.validity.valid;
    email.setAttribute('aria-invalid', String(!valid));
    emailHelp.classList.toggle('error', !valid);
    emailHelp.textContent = valid ? 'Only iPhone launch notifications. No general newsletter.' : 'Enter a valid email address, such as you@example.com.';
    return valid;
  }
  function validateConsent() {
    const valid = consent.checked;
    consent.setAttribute('aria-invalid', String(!valid));
    consentHelp.classList.toggle('error', !valid);
    consentHelp.textContent = valid ? 'You can ask us to remove your email at any time.' : 'Tick the box to agree to iPhone launch notifications, or leave without joining.';
    return valid;
  }
  for (const [field, validate] of [[email, validateEmail], [consent, validateConsent]]) {
    field.addEventListener('blur', () => { if (pending || complete) return; touched.add(field); validate(); });
    field.addEventListener('input', () => {
      if (pending || complete) return;
      if (touched.has(field)) validate();
      if (!pending && !complete) status.hidden = true;
    });
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || complete) return;
    touched.add(email); touched.add(consent);
    const validEmail = validateEmail();
    const validConsent = validateConsent();
    if (!validEmail || !validConsent) {
      show('error', 'Check the form', 'Correct the highlighted field before joining.');
      (validEmail ? consent : email).focus();
      return;
    }
    const target = endpoint();
    if (!target) {
      show('error', 'Waitlist not open yet', 'Your email has not been sent or saved. Please check back later.');
      return;
    }
    const payload = { email: email.value.trim(), source: 'iphone', consent: true, website: form.elements.website.value };
    pending = true;
    submit.disabled = true;
    email.readOnly = true;
    consent.disabled = true;
    submit.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    show('pending', 'Sending your request', 'Please wait for confirmation.');
    const controller = new AbortController();
    let timer;
    try {
      const request = (async () => {
        const response = await fetch(target, {
          method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error',
          referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), signal: controller.signal
        });
        if (response.status === 429) throw new Error('rate-limit');
        if (response.status !== 200) throw new Error('not-accepted');
        const body = await response.json();
        if (!body || body.accepted !== true) throw new Error('not-accepted');
      })();
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, timeoutMs);
      });
      await Promise.race([request, timeout]);
      complete = true;
      // Never echo or persist an address. Same acknowledgement for new and existing entries.
      email.value = '';
      form.elements.website.value = '';
      email.readOnly = true;
      email.disabled = true;
      consent.disabled = true;
      submit.textContent = 'Request accepted';
      show('success', 'You’re on the list', 'Your request was accepted. We’ll email only about Clarity’s iPhone launch. If you had already joined, you’re still on the same list.');
    } catch (error) {
      if (error.message === 'rate-limit') {
        show('error', 'Please wait before trying again', 'The service is receiving too many requests. Your signup is not confirmed. Try again later.');
      } else {
        show('error', 'We couldn’t confirm your signup', 'Your request may or may not have arrived. Please try again when your connection is working; joining again will not create a second entry.');
      }
    } finally {
      clearTimeout(timer);
      pending = false;
      form.removeAttribute('aria-busy');
      if (!complete) {
        email.readOnly = false; consent.disabled = false;
        submit.disabled = false; submit.textContent = 'Try again';
      }
    }
  });
  // Native submission stays disabled if this script cannot initialize.
  submit.disabled = false;
})();
