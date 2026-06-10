// Padelin Booking — venue screen, app shell, tweaks

const PB_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#A3E635",
  "theme": "gelap"
}/*EDITMODE-END*/;

/* ---------- Venue (main) screen ---------- */

function PBVenueScreen({ bookings, onPick }) {
  const dates = React.useMemo(pbDates, []);
  const [dateIdx, setDateIdx] = React.useState(0);
  const [courtIdx, setCourtIdx] = React.useState(0);

  const dateObj = dates[dateIdx];
  const court = PB_COURTS[courtIdx];

  const isFree = (cIdx, hour) =>
    !pbTaken(cIdx, dates[dateIdx].key, hour) &&
    !bookings[`${PB_COURTS[cIdx].id}|${dates[dateIdx].key}|${hour}`];

  const freeCount = (cIdx) => PB_HOURS.filter((h) => isFree(cIdx, h)).length;

  return (
    <div className="pb-screen" data-screen-label="Halaman Venue">
      {/* header */}
      <div className="pb-head">
        <div className="pb-url">padelin.id/venue/{PB_VENUE.slug}</div>
        <h1 className="pb-venue-name">{PB_VENUE.name}</h1>
        <div className="pb-venue-meta">
          <span>{PB_VENUE.address}</span>
          <span className="pb-venue-hours">Buka {PB_VENUE.hours}</span>
        </div>
      </div>

      {/* date strip */}
      <div className="pb-label">Pilih tanggal</div>
      <div className="pb-dates">
        {dates.map((d, i) => (
          <PBDateChip key={d.key} d={d} active={i === dateIdx} onClick={() => setDateIdx(i)} />
        ))}
      </div>

      {/* courts */}
      <div className="pb-label">Pilih lapangan</div>
      <div className="pb-courts">
        {PB_COURTS.map((c, i) => (
          <PBCourtCard
            key={c.id}
            court={c}
            active={i === courtIdx}
            freeCount={freeCount(i)}
            onClick={() => setCourtIdx(i)}
          />
        ))}
      </div>

      {/* slots */}
      <div className="pb-label pb-label-slots">
        <span>Pilih jam main</span>
        <span className="pb-legend">
          <span className="pb-legend-dot pb-legend-free"></span> kosong
          <span className="pb-legend-dot pb-legend-taken"></span> terisi
        </span>
      </div>
      <div className="pb-slots">
        {PB_HOURS.map((h) => (
          <PBSlot
            key={h}
            hour={h}
            taken={!isFree(courtIdx, h)}
            onClick={() => onPick({ court, courtIdx, dateObj, hour: h })}
          />
        ))}
      </div>

      <div className="pb-foot-hint">
        Pilih jam kosong untuk booking — tanpa akun, cukup nama &amp; nomor WhatsApp.
      </div>
    </div>
  );
}

/* ---------- App shell ---------- */

function PBApp() {
  const [t, setTweak] = useTweaks(PB_TWEAK_DEFAULTS);
  const [picked, setPicked] = React.useState(null);     // { court, courtIdx, dateObj, hour }
  const [booking, setBooking] = React.useState(null);   // confirmed booking → invoice
  const [bookings, setBookings] = React.useState({});   // locally-made bookings: key → true
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 48) / 874, (window.innerWidth - 24) / 402);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const isFreeAt = (hour) =>
    picked &&
    !pbTaken(picked.courtIdx, picked.dateObj.key, hour) &&
    !bookings[`${picked.court.id}|${picked.dateObj.key}|${hour}`];

  const submit = (form) => {
    const code = 'PDL-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const b = { ...picked, ...form, code };
    const next = { ...bookings };
    for (let i = 0; i < form.duration; i++) {
      next[`${picked.court.id}|${picked.dateObj.key}|${picked.hour + i}`] = true;
    }
    setBookings(next);
    setPicked(null);
    setBooking(b);
  };

  return (
    <div className="pb-stage" style={{ '--accent': t.accent }} data-theme={t.theme}>
      <div className="pb-phone-fit" style={{ transform: `scale(${scale})` }}>
        <IOSDevice dark={t.theme === 'gelap'} title="">
          <div className="pb-app">
            {booking ? (
              <PBInvoice booking={booking} onBack={() => setBooking(null)} />
            ) : (
              <PBVenueScreen bookings={bookings} onPick={setPicked} />
            )}
            {picked ? (
              <PBBookingSheet
                court={picked.court}
                dateObj={picked.dateObj}
                hour={picked.hour}
                isFree={isFreeAt}
                onClose={() => setPicked(null)}
                onSubmit={submit}
              />
            ) : null}
          </div>
        </IOSDevice>
      </div>

      <TweaksPanel>
        <TweakSection label="Warna" />
        <TweakColor
          label="Aksen"
          value={t.accent}
          options={['#A3E635', '#5EEAD4', '#E8C268', '#F0ABFC']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Tema" />
        <TweakRadio
          label="Tampilan"
          value={t.theme}
          options={['gelap', 'terang']}
          onChange={(v) => setTweak('theme', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PBApp />);
