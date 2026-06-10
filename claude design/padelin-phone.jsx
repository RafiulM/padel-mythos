// Phone mockup: the public venue booking page shown inside an iPhone frame.
// Used in the hero of the Padelin landing page.

function PhoneSlot({ label, state }) {
  // state: 'free' | 'taken' | 'selected'
  const base = {
    padding: '9px 0',
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.02em',
    fontVariantNumeric: 'tabular-nums',
  };
  const styles = {
    free: {
      ...base,
      background: 'rgba(163,230,53,0.12)',
      color: 'var(--accent)',
      border: '1px solid rgba(163,230,53,0.35)',
    },
    taken: {
      ...base,
      background: 'rgba(255,255,255,0.04)',
      color: 'rgba(255,255,255,0.25)',
      border: '1px solid rgba(255,255,255,0.06)',
      textDecoration: 'line-through',
    },
    selected: {
      ...base,
      background: 'var(--accent)',
      color: '#0B120D',
      border: '1px solid var(--accent)',
      boxShadow: '0 4px 16px rgba(163,230,53,0.35)',
    },
  };
  return <div style={styles[state]}>{label}</div>;
}

function PhoneDateChip({ day, date, active }) {
  return (
    <div
      style={{
        minWidth: 46,
        padding: '8px 0',
        borderRadius: 12,
        textAlign: 'center',
        background: active ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
        color: active ? '#0B120D' : 'rgba(255,255,255,0.7)',
        border: active ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{day}</div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{date}</div>
    </div>
  );
}

function PadelinPhone() {
  const slots = [
    ['07:00', 'taken'], ['08:00', 'free'], ['09:00', 'free'],
    ['10:00', 'taken'], ['11:00', 'free'], ['12:00', 'taken'],
    ['13:00', 'free'], ['14:00', 'free'], ['15:00', 'selected'],
    ['16:00', 'free'], ['17:00', 'taken'], ['18:00', 'taken'],
  ];
  return (
    <IOSDevice dark title="">
      <div
        style={{
          height: '100%',
          background: '#0E1510',
          color: '#EDF2EC',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Venue header */}
        <div style={{ padding: '14px 18px 0 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            padelin.id/venue/padel-senayan
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: '-0.01em' }}>Padel Senayan</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
            Jl. Asia Afrika No. 8, Jakarta Pusat
          </div>
        </div>

        {/* Date chips */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 18px 0 18px', overflow: 'hidden' }}>
          <PhoneDateChip day="Sen" date="10" active />
          <PhoneDateChip day="Sel" date="11" />
          <PhoneDateChip day="Rab" date="12" />
          <PhoneDateChip day="Kam" date="13" />
          <PhoneDateChip day="Jum" date="14" />
          <PhoneDateChip day="Sab" date="15" />
        </div>

        {/* Court card */}
        <div style={{ padding: '14px 18px 0 18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Court A · Indoor</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Rp 250.000 / jam</div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'rgba(163,230,53,0.1)',
                border: '1px solid rgba(163,230,53,0.3)',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              7 slot kosong
            </div>
          </div>
        </div>

        {/* Slot grid */}
        <div style={{ padding: '14px 18px 0 18px', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Pilih jam main
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {slots.map(([label, state]) => (
              <PhoneSlot key={label} label={label} state={state} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ padding: '12px 18px 16px 18px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span>15:00 — 17:00 · 2 jam</span>
            <span style={{ color: '#EDF2EC', fontWeight: 700 }}>Rp 500.000</span>
          </div>
          <div
            style={{
              background: 'var(--accent)',
              color: '#0B120D',
              textAlign: 'center',
              padding: '13px 0',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(163,230,53,0.3)',
            }}
          >
            Booking Sekarang
          </div>
          <div style={{ textAlign: 'center', fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
            Tanpa akun · cukup nama & nomor WhatsApp
          </div>
        </div>
      </div>
    </IOSDevice>
  );
}

Object.assign(window, { PadelinPhone });
