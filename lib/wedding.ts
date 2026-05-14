export const WEDDING = {
  // Initials only (per couple's preference)
  bride: 'S',
  brideFull: 'S.M.D.',
  groom: 'C',
  groomFull: 'C.A.C.',
  hashtag: '#SMDetCAC',
  // Saturday 6 juin 2026 — 16h Sénégal (UTC)
  date: new Date('2026-06-06T16:00:00Z'),
  dateLabel: 'Samedi 6 Juin 2026',
  dateRoman: '06 · VI · MMXXVI',
  dateRow: { day: '06', month: 'JUIN', year: '2026' },
  timeLabel: '19 h 00',
  receptionLabel: '19 h 00',
  venue: 'Sacré Cœur 3',
  venueAddressLines: [
    'Sacré Cœur 3',
    'Dakar',
    'Sénégal',
  ],
  venueCity: 'Dakar, Sénégal',
  rsvpDeadline: '1er mai 2026',
  venueCoords: { lat: 14.720742, lng: -17.466423 },
  mapsLink:
    'https://www.google.com/maps/dir/?api=1&destination=14.720742,-17.466423',
  mapsEmbed:
    'https://www.google.com/maps?q=14.720742,-17.466423&z=17&output=embed',
};

export const SCHEDULE = [
  {
    time: '16:00',
    title: 'Cérémonie',
    place: 'Sacré Cœur 3, Dakar',
    description: 'L’échange des vœux et la signature des registres.',
    icon: 'rings',
  },
  {
    time: '17:30',
    title: "Vin d'honneur",
    place: 'Jardins de la villa',
    description: 'Champagne, mignardises et félicitations sous les manguiers.',
    icon: 'glass',
  },
  {
    time: '18:30',
    title: 'Réception',
    place: 'Grande salle',
    description: 'Un dîner servi aux chandelles, entre rires et discours.',
    icon: 'cutlery',
  },
  {
    time: '22:00',
    title: 'Soirée dansante',
    place: 'Sur la piste',
    description: 'Ouverture du bal, musique et danse jusqu’au bout de la nuit.',
    icon: 'music',
  },
];

