/* BIZONTOP common scripts */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Header scroll shadow ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var closeMobileNav = function () {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileNav);
    });
    var backdrop = mobileNav.querySelector('.mobile-nav-backdrop');
    var closeBtn = mobileNav.querySelector('.mnav-close');
    if (backdrop) backdrop.addEventListener('click', closeMobileNav);
    if (closeBtn) closeBtn.addEventListener('click', closeMobileNav);
  }

  /* ---- Mobile nav accordions (dropdown groups) ---- */
  document.querySelectorAll('.mnav-group-title').forEach(function (t) {
    t.addEventListener('click', function () {
      t.parentElement.classList.toggle('open');
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        a.style.maxHeight = null;
      } else {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---- Floating "scroll to top" button ---- */
  var topBtn = document.querySelector('.fab.top');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    }, { passive: true });
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Contact form (client-side only, no backend wired yet) ---- */
  var form = document.getElementById('consult-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (f) {
        if (!f.value || (f.type === 'checkbox' && !f.checked)) {
          valid = false;
          f.style.borderColor = '#ff7a1a';
        } else {
          f.style.borderColor = '';
        }
      });
      if (!valid) {
        var firstInvalid = form.querySelector('[required][style*="rgb(255, 122, 26)"]') || form.querySelector('[required]:invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      form.style.display = 'none';
      var success = document.getElementById('form-success');
      if (success) success.classList.add('show');
    });
  }

});
