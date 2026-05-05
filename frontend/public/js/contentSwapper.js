(function () {
  function titleCaseTerm(term) {
    return term
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  document.addEventListener('DOMContentLoaded', () => {
    const utm = window.UTM ? window.UTM.get() : {};
    const term = utm.term || utm.utm_term;
    if (!term) return;

    document.querySelectorAll('[data-client-template]').forEach((node) => {
      node.textContent = node.dataset.clientTemplate.replace(/\{\{term\}\}/g, titleCaseTerm(term));
    });
  });
})();
