/* ============================================================
   COUNTER MODULE
   Calcula el tiempo transcurrido desde una fecha fija.
   ============================================================ */

/**
 * Inicializa el contador de tiempo.
 * @param {Date} startDate - Fecha de inicio de la relación
 */
export function initCounter(startDate) {
  const daysEl = document.getElementById('counter-days');
  const hoursEl = document.getElementById('counter-hours');
  const minutesEl = document.getElementById('counter-minutes');
  const secondsEl = document.getElementById('counter-seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function setVal(el, val) {
    if (el.textContent !== val) {
      el.textContent = val;
      el.classList.remove('counter-tick');
      void el.offsetWidth;
      el.classList.add('counter-tick');
    }
  }

  function update() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) {
      setVal(daysEl, '0');
      setVal(hoursEl, '00');
      setVal(minutesEl, '00');
      setVal(secondsEl, '00');
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setVal(daysEl, days.toLocaleString());
    setVal(hoursEl, String(hours).padStart(2, '0'));
    setVal(minutesEl, String(minutes).padStart(2, '0'));
    setVal(secondsEl, String(seconds).padStart(2, '0'));
  }

  // Actualización inmediata + cada segundo.
  // Se pausa cuando la pestaña está oculta (ahorra batería) y se
  // pone al día al instante cuando vuelve a ser visible.
  let timer = null;

  function start() {
    if (timer) return;
    update();
    timer = setInterval(update, 1000);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
}
