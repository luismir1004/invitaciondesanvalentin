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

// Formato de fecha para .ics (local, sin zona): YYYYMMDDTHHMMSS
function toStamp(d) {
    return `${d.year}${pad(d.month)}${pad(d.day)}T${pad(d.hour)}${pad(d.minute)}00`;
}

// Marca de generación en UTC (DTSTAMP es obligatorio en RFC 5545).
function dtStampUTC() {
    const d = new Date();
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
        `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

// Escapa caracteres reservados del formato ICS (RFC 5545 §3.3.11).
function escapeText(value) {
    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r?\n/g, '\\n');
}

// Plegado de líneas: máx. 75 octetos, continuación con espacio (RFC 5545 §3.1).
function foldLine(line) {
    const enc = new TextEncoder();
    if (enc.encode(line).length <= 75) return line;

    const chunks = [];
    let current = '';
    let bytes = 0;
    for (const ch of line) {
        const chBytes = enc.encode(ch).length;
        const limit = chunks.length === 0 ? 75 : 74; // -1 por el espacio de continuación
        if (bytes + chBytes > limit) {
            chunks.push(current);
            current = ch;
            bytes = chBytes;
        } else {
            current += ch;
            bytes += chBytes;
        }
    }
    chunks.push(current);
    return chunks.join('\r\n ');
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
        `DTSTAMP:${dtStampUTC()}`,
        `DTSTART;TZID=America/Caracas:${toStamp(EVENT.start)}`,
        `DTEND;TZID=America/Caracas:${toStamp(EVENT.end)}`,
        `SUMMARY:${escapeText(EVENT.title)}`,
        `LOCATION:${escapeText(`${EVENT.venue}, ${EVENT.address}`)}`,
        `DESCRIPTION:${escapeText(EVENT.description)}`,
        // Recordatorios: 1 día antes y 3 horas antes.
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(EVENT.title)}`,
        'TRIGGER:-P1D',
        'END:VALARM',
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(EVENT.title)}`,
        'TRIGGER:-PT3H',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ];
    return lines.map(foldLine).join('\r\n');
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
