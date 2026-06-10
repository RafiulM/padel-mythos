// Padelin Booking — booking form bottom sheet + invoice screen

/* ---------- Booking form (bottom sheet) ---------- */

function PBBookingSheet({ court, dateObj, hour, isFree, onClose, onSubmit }) {
  const [name, setName] = React.useState('');
  const [wa, setWa] = React.useState('');
  const [duration, setDuration] = React.useState(1);
  const [notes, setNotes] = React.useState('');

  // which durations are possible from this start hour
  const maxDur = React.useMemo(() => {
    let d = 0;
    for (let i = 0; i < 3; i++) {
      const h = hour + i;
      if (h + 1 > PB_CLOSE || !isFree(h)) break;
      d++;
    }
    return d;
  }, [hour, isFree]);

  React.useEffect(() => {
    if (duration > maxDur) setDuration(maxDur);
  }, [maxDur]);

  const total = court.price * duration;
  const waValid = /^(\+?62|0)8\d{7,12}$/.test(wa.replace(/[\s-]/g, ''));
  const valid = name.trim().length >= 2 && waValid;

  return (
    <div className="pb-scrim" onClick={onClose}>
      <div className="pb-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="pb-sheet-grab"></div>
        <div className="pb-sheet-head">
          <div>
            <div className="pb-sheet-title">Detail Booking</div>
            <div className="pb-sheet-sub">{court.name} · {dateObj.label} · {pbFmtHour(hour)}</div>
          </div>
          <button className="pb-sheet-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        <label className="pb-field">
          <span className="pb-field-label">Nama</span>
          <input
            className="pb-input"
            placeholder="Nama lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>

        <label className="pb-field">
          <span className="pb-field-label">Nomor WhatsApp</span>
          <input
            className="pb-input"
            placeholder="08xxxxxxxxxx"
            inputMode="tel"
            value={wa}
            onChange={(e) => setWa(e.target.value)}
          />
          {wa.length > 0 && !waValid ? (
            <span className="pb-field-err">Format nomor belum benar — contoh: 081234567890</span>
          ) : null}
        </label>

        <div className="pb-field">
          <span className="pb-field-label">Durasi main</span>
          <div className="pb-seg">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                className={'pb-seg-btn' + (duration === d ? ' is-active' : '')}
                disabled={d > maxDur}
                onClick={() => setDuration(d)}
              >
                {d} jam
              </button>
            ))}
          </div>
          {maxDur < 3 ? (
            <span className="pb-field-hint">Maksimal {maxDur} jam — slot berikutnya sudah terisi</span>
          ) : null}
        </div>

        <label className="pb-field">
          <span className="pb-field-label">Catatan <em>(opsional)</em></span>
          <textarea
            className="pb-input pb-textarea"
            placeholder="Misal: sewa raket 2 buah"
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </label>

        <div className="pb-sheet-total">
          <div>
            <div className="pb-sheet-total-label">Total</div>
            <div className="pb-sheet-total-time">{pbFmtHour(hour)} – {pbFmtHour(hour + duration)} · {duration} jam</div>
          </div>
          <div className="pb-sheet-total-num">{pbFmtRp(total)}</div>
        </div>

        <button
          className="pb-btn-primary"
          disabled={!valid}
          onClick={() => onSubmit({ name: name.trim(), wa, duration, notes, total })}
        >
          Booking Sekarang
        </button>
        <div className="pb-sheet-foot">Tanpa akun · konfirmasi pembayaran oleh admin venue</div>
      </div>
    </div>
  );
}

/* ---------- Invoice / summary screen ---------- */

function PBInvoice({ booking, onBack }) {
  const [payTab, setPayTab] = React.useState('qris');
  const [copied, setCopied] = React.useState(false);

  const copyAccount = () => {
    try { navigator.clipboard.writeText(PB_VENUE.bank.number); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="pb-screen" data-screen-label="Invoice">
      <div className="pb-invoice-head">
        <button className="pb-back" onClick={onBack} aria-label="Kembali">←</button>
        <div className="pb-invoice-head-text">
          <div className="pb-invoice-code">{booking.code}</div>
          <div className="pb-invoice-venue">{PB_VENUE.name}</div>
        </div>
        <div className="pb-status pb-status-pending">Menunggu Pembayaran</div>
      </div>

      <div className="pb-card">
        <PBRow label="Lapangan" value={`${booking.court.name} · ${booking.court.type}`} />
        <PBRow label="Tanggal" value={booking.dateObj.label} />
        <PBRow label="Jam" value={`${pbFmtHour(booking.hour)} – ${pbFmtHour(booking.hour + booking.duration)}`} />
        <PBRow label="Durasi" value={`${booking.duration} jam`} />
        <PBRow label="Nama" value={booking.name} />
        <PBRow label="WhatsApp" value={booking.wa} />
        {booking.notes ? <PBRow label="Catatan" value={booking.notes} /> : null}
        <div className="pb-card-divider"></div>
        <PBRow label="Total" value={pbFmtRp(booking.total)} strong />
      </div>

      <div className="pb-pay-title">Cara Pembayaran</div>
      <div className="pb-seg pb-seg-pay">
        <button className={'pb-seg-btn' + (payTab === 'qris' ? ' is-active' : '')} onClick={() => setPayTab('qris')}>QRIS</button>
        <button className={'pb-seg-btn' + (payTab === 'bank' ? ' is-active' : '')} onClick={() => setPayTab('bank')}>Transfer Bank</button>
      </div>

      {payTab === 'qris' ? (
        <div className="pb-card pb-pay-card">
          <div className="pb-qris-ph">
            <span>gambar QRIS venue</span>
          </div>
          <div className="pb-pay-note">Scan dengan aplikasi bank atau e-wallet apa pun, lalu bayar {pbFmtRp(booking.total)}.</div>
        </div>
      ) : (
        <div className="pb-card pb-pay-card">
          <div className="pb-bank">
            <div>
              <div className="pb-bank-name">{PB_VENUE.bank.name}</div>
              <div className="pb-bank-number">{PB_VENUE.bank.number.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')}</div>
              <div className="pb-bank-holder">a.n. {PB_VENUE.bank.holder}</div>
            </div>
            <button className="pb-copy" onClick={copyAccount}>{copied ? 'Tersalin ✓' : 'Salin'}</button>
          </div>
          <div className="pb-pay-note">Transfer tepat {pbFmtRp(booking.total)} agar mudah diverifikasi admin.</div>
        </div>
      )}

      <div className="pb-pay-steps">
        Setelah membayar, admin akan memverifikasi dana masuk dan status booking berubah menjadi
        <span className="pb-status-inline"> Dikonfirmasi</span>. Jadwal Anda otomatis terkunci.
      </div>

      <a className="pb-btn-primary pb-btn-wa" href="#" onClick={(e) => e.preventDefault()}>
        Konfirmasi via WhatsApp
      </a>
      <button className="pb-btn-ghost" onClick={onBack}>Kembali ke Jadwal</button>
    </div>
  );
}

Object.assign(window, { PBBookingSheet, PBInvoice });
