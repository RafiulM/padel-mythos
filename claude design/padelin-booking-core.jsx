// Padelin Booking — data, helpers, and small UI atoms

const PB_VENUE = {
  name: 'Padel Senayan',
  slug: 'padel-senayan',
  address: 'Jl. Asia Afrika No. 8, Jakarta Pusat',
  hours: '07:00 – 22:00',
  wa: '6281234567890',
  bank: { name: 'BCA', number: '8830112345', holder: 'PT Padel Senayan Jaya' },
};

const PB_COURTS = [
  { id: 'a', name: 'Court A', type: 'Indoor', price: 250000 },
  { id: 'b', name: 'Court B', type: 'Indoor', price: 250000 },
  { id: 'c', name: 'Court C', type: 'Outdoor', price: 200000 },
];

const PB_HOURS = Array.from({ length: 15 }, (_, i) => 7 + i); // 07:00 .. 21:00 (last start)
const PB_CLOSE = 22;

const PB_DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const PB_MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function pbDates() {
  const out = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      day: PB_DAYS_ID[d.getDay()],
      date: d.getDate(),
      label: `${PB_DAYS_ID[d.getDay()]}, ${d.getDate()} ${PB_MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return out;
}

// deterministic pseudo-availability: true = already taken
function pbTaken(courtIdx, dateKey, hour) {
  const dom = parseInt(dateKey.slice(8, 10), 10);
  const h = (courtIdx * 31 + dom * 7 + hour * 13) % 10;
  return h < 4;
}

function pbFmtRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function pbFmtHour(h) {
  return String(h).padStart(2, '0') + ':00';
}

/* ---------- atoms ---------- */

function PBDateChip({ d, active, onClick }) {
  return (
    <button className={'pb-date' + (active ? ' is-active' : '')} onClick={onClick}>
      <span className="pb-date-day">{d.day}</span>
      <span className="pb-date-num">{d.date}</span>
    </button>
  );
}

function PBCourtCard({ court, active, freeCount, onClick }) {
  return (
    <button className={'pb-court' + (active ? ' is-active' : '')} onClick={onClick}>
      <span className="pb-court-name">{court.name}</span>
      <span className="pb-court-type">{court.type}</span>
      <span className="pb-court-price">{pbFmtRp(court.price)}<small>/jam</small></span>
      <span className="pb-court-free">{freeCount} slot kosong</span>
    </button>
  );
}

function PBSlot({ hour, taken, onClick }) {
  return (
    <button className={'pb-slot' + (taken ? ' is-taken' : '')} disabled={taken} onClick={onClick}>
      {pbFmtHour(hour)}
    </button>
  );
}

function PBRow({ label, value, strong }) {
  return (
    <div className="pb-row">
      <span className="pb-row-label">{label}</span>
      <span className={'pb-row-value' + (strong ? ' is-strong' : '')}>{value}</span>
    </div>
  );
}

Object.assign(window, {
  PB_VENUE, PB_COURTS, PB_HOURS, PB_CLOSE,
  pbDates, pbTaken, pbFmtRp, pbFmtHour,
  PBDateChip, PBCourtCard, PBSlot, PBRow,
});
