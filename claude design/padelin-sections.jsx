// Landing page sections for Padelin (excluding hero, which lives in padelin-app.jsx)

/* ---------- shared bits ---------- */

function SectionTag({ children }) {
  return (
    <div className="pl-tag">
      <span className="pl-tag-dot"></span>
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
      <circle cx="8" cy="8" r="7.25" stroke="var(--accent)" strokeOpacity="0.4" strokeWidth="1.5"></circle>
      <path d="M5 8.2l2 2 4-4.2" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}

/* ---------- Untuk Pemilik Venue ---------- */

function BookingRow({ name, court, time, price, status }) {
  const statusStyle = {
    PENDING: { color: '#E8C268', background: 'rgba(232,194,104,0.1)', border: '1px solid rgba(232,194,104,0.3)' },
    PAID: { color: 'var(--accent)', background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.3)' },
  }[status];
  const label = status === 'PENDING' ? 'Pending' : 'Paid';
  return (
    <div className="pl-booking-row">
      <div className="pl-booking-avatar">{name[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="pl-booking-name">{name}</div>
        <div className="pl-booking-meta">{court} · {time}</div>
      </div>
      <div className="pl-booking-price">{price}</div>
      <div className="pl-booking-status" style={statusStyle}>{label}</div>
    </div>
  );
}

function OwnerSection() {
  return (
    <section className="pl-section" id="pemilik" data-screen-label="Untuk Pemilik Venue">
      <div className="pl-container pl-split">
        <div className="pl-split-copy">
          <SectionTag>Untuk pemilik venue</SectionTag>
          <h2 className="pl-h2">
            Dashboard yang rapi, <em>bukan</em> ratusan chat WhatsApp.
          </h2>
          <p className="pl-body">
            Semua pesanan masuk ke satu kalender. Cek mutasi, klik konfirmasi,
            dan jadwal di halaman publik langsung terblokir — tanpa risiko double booking.
          </p>
          <ul className="pl-checklist">
            <li><CheckIcon /><span><strong>Kalender semua lapangan</strong> dalam satu layar, per venue dan per cabang.</span></li>
            <li><CheckIcon /><span><strong>Konfirmasi pembayaran manual</strong> — transfer bank atau QRIS, sesuai cara Anda bekerja.</span></li>
            <li><CheckIcon /><span><strong>Link unik per venue</strong> yang siap dibagikan ke Instagram dan WhatsApp.</span></li>
            <li><CheckIcon /><span><strong>Multi-venue, multi-lapangan</strong> — kelola harga dan jam operasional tiap lapangan.</span></li>
          </ul>
        </div>
        <div className="pl-split-visual">
          <div className="pl-dash-card">
            <div className="pl-dash-head">
              <div>
                <div className="pl-dash-title">Booking Masuk</div>
                <div className="pl-dash-sub">Padel Senayan · Senin, 10 Juni</div>
              </div>
              <div className="pl-dash-badge">3 baru</div>
            </div>
            <BookingRow name="Rizky Maulana" court="Court A" time="15:00 · 2 jam" price="Rp 500rb" status="PENDING" />
            <BookingRow name="Sarah Putri" court="Court B" time="18:00 · 1 jam" price="Rp 250rb" status="PAID" />
            <BookingRow name="Andi Wijaya" court="Court A" time="19:00 · 2 jam" price="Rp 500rb" status="PAID" />
            <div className="pl-dash-confirm">
              <span>Dana masuk dari Rizky?</span>
              <span className="pl-dash-confirm-btn">Konfirmasi Pembayaran</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Untuk Pemain ---------- */

function PlayerSection() {
  const cards = [
    {
      num: '01',
      title: 'Tanpa akun, tanpa aplikasi',
      body: 'Buka link venue, isi nama dan nomor WhatsApp. Selesai. Tidak ada registrasi, tidak ada download.',
    },
    {
      num: '02',
      title: 'Slot kosong terlihat real-time',
      body: 'Jam yang tersedia tampil hijau, yang penuh tercoret. Tidak perlu tanya-tanya admin lagi.',
    },
    {
      num: '03',
      title: 'Bayar seperti biasa',
      body: 'Transfer bank atau scan QRIS milik venue langsung dari halaman invoice. Checkout kurang dari satu menit.',
    },
  ];
  return (
    <section className="pl-section pl-section-alt" id="pemain" data-screen-label="Untuk Pemain">
      <div className="pl-container">
        <div className="pl-center-head">
          <SectionTag>Untuk pemain</SectionTag>
          <h2 className="pl-h2">Booking lapangan secepat <em>chat</em> — tapi tanpa menunggu balasan.</h2>
        </div>
        <div className="pl-cards3">
          {cards.map((c) => (
            <div className="pl-card" key={c.num}>
              <div className="pl-card-num">{c.num}</div>
              <div className="pl-card-title">{c.title}</div>
              <p className="pl-card-body">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cara Kerja (3 langkah pemilik) ---------- */

function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Daftar & atur venue',
      body: 'Tambahkan lokasi, lapangan, harga per jam, dan unggah QRIS atau nomor rekening Anda.',
    },
    {
      num: '2',
      title: 'Bagikan link venue',
      body: 'Setiap venue punya URL sendiri. Taruh di bio Instagram atau balas chat dengan satu link.',
      code: 'padelin.id/venue/padel-senayan',
    },
    {
      num: '3',
      title: 'Terima & konfirmasi booking',
      body: 'Pesanan masuk berstatus Pending. Cek dana, klik konfirmasi, jadwal otomatis terkunci.',
    },
  ];
  return (
    <section className="pl-section" id="cara-kerja" data-screen-label="Cara Kerja">
      <div className="pl-container">
        <div className="pl-center-head">
          <SectionTag>Cara kerja</SectionTag>
          <h2 className="pl-h2">Tiga langkah, <em>lapangan penuh.</em></h2>
        </div>
        <div className="pl-steps">
          {steps.map((s, i) => (
            <div className="pl-step" key={s.num}>
              <div className="pl-step-num">{s.num}</div>
              <div className="pl-step-title">{s.title}</div>
              <p className="pl-card-body">{s.body}</p>
              {s.code ? <div className="pl-step-code">{s.code}</div> : null}
              {i < steps.length - 1 ? <div className="pl-step-line"></div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Harga ---------- */

function PricingSection() {
  return (
    <section className="pl-section pl-section-alt" id="harga" data-screen-label="Harga">
      <div className="pl-container pl-pricing-wrap">
        <div className="pl-pricing-copy">
          <SectionTag>Harga</SectionTag>
          <h2 className="pl-h2">Satu langganan, <em>semua fitur.</em></h2>
          <p className="pl-body">
            Tanpa komisi per booking. Tanpa biaya tersembunyi.
            Berhenti kapan saja.
          </p>
        </div>
        <div className="pl-price-card">
          <div className="pl-price-plan">Padelin Pro</div>
          <div className="pl-price-amount">
            <span className="pl-price-currency">Rp</span>
            <span className="pl-price-num">249rb</span>
            <span className="pl-price-period">/ bulan per venue</span>
          </div>
          <ul className="pl-checklist pl-checklist-tight">
            <li><CheckIcon /><span>Lapangan & booking tanpa batas</span></li>
            <li><CheckIcon /><span>Halaman publik dengan link unik</span></li>
            <li><CheckIcon /><span>Dashboard kalender & konfirmasi pembayaran</span></li>
            <li><CheckIcon /><span>Pembayaran via transfer bank / QRIS Anda sendiri</span></li>
          </ul>
          <a className="pl-btn pl-btn-primary pl-btn-block" href="#daftar">Coba Gratis 14 Hari</a>
          <div className="pl-price-note">Tanpa kartu kredit untuk memulai</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA + Footer ---------- */

function FinalCTA() {
  return (
    <section className="pl-section pl-final" id="daftar" data-screen-label="CTA Akhir">
      <div className="pl-container pl-final-inner">
        <h2 className="pl-h2 pl-h2-big">Tutup WhatsApp,<br /><em>buka jadwal.</em></h2>
        <p className="pl-body" style={{ margin: '0 auto' }}>
          Daftarkan venue Anda hari ini. Dalam 15 menit, pelanggan sudah bisa booking sendiri.
        </p>
        <div className="pl-hero-actions" style={{ justifyContent: 'center' }}>
          <a className="pl-btn pl-btn-primary" href="#daftar">Daftar Gratis</a>
          <a className="pl-btn pl-btn-ghost" href="#cara-kerja">Lihat Cara Kerja</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pl-footer">
      <div className="pl-container pl-footer-inner">
        <div className="pl-logo">Padelin</div>
        <div className="pl-footer-links">
          <a href="#pemilik">Untuk Venue</a>
          <a href="#pemain">Untuk Pemain</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#harga">Harga</a>
        </div>
        <div className="pl-footer-copy">© 2026 Padelin</div>
      </div>
    </footer>
  );
}

Object.assign(window, { SectionTag, OwnerSection, PlayerSection, HowItWorks, PricingSection, FinalCTA, Footer });
