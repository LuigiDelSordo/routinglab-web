/* ============================================================
   RoutingLab · comportamiento común de la web
   ============================================================ */

// ---------- Tema claro / oscuro ----------
(function tema() {
  const guardado = localStorage.getItem('rl-tema');
  if (guardado) document.documentElement.setAttribute('data-tema', guardado);

  window.alternarTema = function () {
    const actual = document.documentElement.getAttribute('data-tema')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
    const nuevo = actual === 'oscuro' ? 'claro' : 'oscuro';
    document.documentElement.setAttribute('data-tema', nuevo);
    localStorage.setItem('rl-tema', nuevo);
    pintarIconoTema();
  };

  function pintarIconoTema() {
    const btn = document.querySelector('.boton-tema');
    if (!btn) return;
    const oscuro = (document.documentElement.getAttribute('data-tema')
      || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro')) === 'oscuro';
    btn.textContent = oscuro ? '☀️' : '🌙';
    btn.setAttribute('aria-label', oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }
  document.addEventListener('DOMContentLoaded', pintarIconoTema);
})();

// ---------- Navegación ----------
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (nav) {
    const alScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    alScroll();
    addEventListener('scroll', alScroll, { passive: true });
  }

  const botonMenu = document.querySelector('.menu-movil');
  const enlaces = document.querySelector('.nav-links');
  if (botonMenu && enlaces) {
    botonMenu.addEventListener('click', () => enlaces.classList.toggle('abierto'));
    enlaces.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => enlaces.classList.remove('abierto')));
  }

  // ---------- Revelar al hacer scroll ----------
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observador.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.revelar').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    observador.observe(el);
  });

  // ---------- Contadores animados ----------
  const contadores = document.querySelectorAll('[data-contador]');
  if (contadores.length) {
    const obsNum = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const fin = parseFloat(el.dataset.contador);
        const sufijo = el.dataset.sufijo || '';
        const inicio = performance.now(), dur = 1100;
        const paso = (t) => {
          const p = Math.min((t - inicio) / dur, 1);
          const suave = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(fin * suave).toLocaleString('es-ES') + sufijo;
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
        obsNum.unobserve(el);
      });
    }, { threshold: .5 });
    contadores.forEach(c => obsNum.observe(c));
  }

  // ---------- Acordeón (FAQ) ----------
  document.querySelectorAll('[data-acordeon]').forEach(item => {
    const cabecera = item.querySelector('.faq-pregunta');
    cabecera?.addEventListener('click', () => {
      const abierto = item.classList.toggle('abierto');
      cabecera.setAttribute('aria-expanded', abierto);
      const cuerpo = item.querySelector('.faq-respuesta');
      if (cuerpo) cuerpo.style.maxHeight = abierto ? cuerpo.scrollHeight + 'px' : '0';
    });
  });

  // ---------- Año en el pie ----------
  document.querySelectorAll('[data-anio]').forEach(el => el.textContent = new Date().getFullYear());

  dibujarRed();
});

// ---------- Fondo animado: la red de marca ----------
function dibujarRed() {
  const lienzo = document.getElementById('redCanvas');
  if (!lienzo || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = lienzo.getContext('2d');
  let ancho, alto, nodos = [], animacion;

  function medir() {
    const r = lienzo.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    ancho = r.width; alto = r.height;
    lienzo.width = ancho * dpr; lienzo.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cantidad = Math.max(14, Math.min(34, Math.round(ancho / 46)));
    nodos = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho, y: Math.random() * alto,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: Math.random() * 2 + 1.6
    }));
  }

  function pintar() {
    ctx.clearRect(0, 0, ancho, alto);
    for (let i = 0; i < nodos.length; i++) {
      const n = nodos[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > ancho) n.vx *= -1;
      if (n.y < 0 || n.y > alto) n.vy *= -1;
      for (let j = i + 1; j < nodos.length; j++) {
        const m = nodos[j];
        const d = Math.hypot(n.x - m.x, n.y - m.y);
        if (d < 135) {
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 135) * .22})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    animacion = requestAnimationFrame(pintar);
  }

  medir(); pintar();
  addEventListener('resize', () => { cancelAnimationFrame(animacion); medir(); pintar(); });
}
