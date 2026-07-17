/* ============================================================
   CONFIG — Única fuente de verdad de la invitación
   Luis: para cambiar cualquier dato (fecha, lugar, hora, número),
   edita SOLO este archivo.
   ============================================================ */

export const INVITACION = {
    pareja: {
        el: 'Luis',
        ella: 'Alejandra',
        apodo: 'Ale',
        monograma: 'L & A'
    },

    // Inicio de la relación (para el contador "llevamos X días")
    inicioRelacion: '2025-07-20T00:00:00',

    // La celebración
    evento: {
        titulo: 'Nuestro Aniversario — Un Año Contigo',
        // Las fechas usan: año, mes (1-12), día, hora (0-23), minuto
        inicio: { year: 2026, month: 7, day: 20, hour: 19, minute: 0 },
        fin: { year: 2026, month: 7, day: 20, hour: 23, minute: 0 },
        lugar: 'Bonsai Sushi',
        direccion: 'C.C. Sambil, Chacao, Caracas',
        coords: { lat: 10.489442, lng: -66.855118 }, // Centro Sambil Caracas
        vestimenta: 'Elegante casual',
        descripcion: 'Celebremos juntos nuestro primer año. Con amor, Luis y Alejandra.'
    },

    // RSVP
    whatsapp: '584121955216',
    mensajeAceptacion:
        '💛 *¡Sí, acepto!* 💛\n\n' +
        'Mi amor, acepto tu invitación para celebrar nuestro primer año juntos. 🥂\n\n' +
        'Nos vemos el *20 de julio* en Bonsai Sushi. ✨\n\n' +
        'Te amo, Luis. Un año contigo y apenas comienza. 💕'
};
