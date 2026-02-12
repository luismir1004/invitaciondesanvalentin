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

  function update() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = days.toLocaleString();
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  // Actualización inmediata + cada segundo
  update();
  setInterval(update, 1000);
}
