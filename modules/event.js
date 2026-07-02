/* ============================================================
   EVENT MODULE — Detalles del evento (mapa + agregar al calendario)
   ============================================================ */

/* ── CONFIGURACIÓN EDITABLE ──────────────────────────────────
   Luis: cambia estos valores por los reales de la celebración.
   Las fechas usan formato: año, mes (1-12), día, hora (0-23), minuto.
   ─────────────────────────────────────────────────────────── */
export const EVENT = {
    title: 'Nuestro Aniversario — Un Año Contigo',
    start: { year: 2026, month: 7, day: 20, hour: 19, minute: 0 }, // 20 jul 2026, 7:00 PM
    end: { year: 2026, month: 7, day: 20, hour: 23, minute: 0 },   // 20 jul 2026, 11:00 PM
    venue: 'MOOKAH',
    address: 'Torre Torca, Las Mercedes, Caracas',
    description: 'Celebremos juntos nuestro primer año. Con amor, Luis y Alejandra.'
};

function pad(n) {
    return String(n).padStart(2, '0');
}

// Formato de fecha para .ics / Google (local, sin zona): YYYYMMDDTHHMMSS
function toStamp(d) {
    return `${d.year}${pad(d.month)}${pad(d.day)}T${pad(d.hour)}${pad(d.minute)}00`;
}

function buildMapUrl() {
    const query = encodeURIComponent(`${EVENT.venue}, ${EVENT.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function buildICS() {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Un Anio Contigo//Invitacion//ES',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VTIMEZONE',
        'TZID:America/Caracas',
        'BEGIN:STANDARD',
        'DTSTART:19700101T000000',
        'TZOFFSETFROM:-0400',
        'TZOFFSETTO:-0400',
        'TZNAME:VET',
        'END:STANDARD',
        'END:VTIMEZONE',
        'BEGIN:VEVENT',
        'UID:aniversario-2026-07-20@un-ano-contigo',
        `DTSTART;TZID=America/Caracas:${toStamp(EVENT.start)}`,
        `DTEND;TZID=America/Caracas:${toStamp(EVENT.end)}`,
        `SUMMARY:${EVENT.title}`,
        `LOCATION:${EVENT.venue}\\, ${EVENT.address}`,
        `DESCRIPTION:${EVENT.description}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];
    return lines.join('\r\n');
}

function downloadICS() {
    const blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aniversario.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function initEvent() {
    const mapBtn = document.getElementById('event-map');
    const calBtn = document.getElementById('event-calendar');

    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            window.open(buildMapUrl(), '_blank', 'noopener');
        });
    }

    if (calBtn) {
        calBtn.addEventListener('click', downloadICS);
    }
}
