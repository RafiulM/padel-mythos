// Main app: nav + hero + assembled sections + Tweaks panel

const PADELIN_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#A3E635",
  "displayFont": "serif",
  "grain": true
}/*EDITMODE-END*/;

function Nav() {
  return (
    <header className="pl-nav">
      <div className="pl-container pl-nav-inner">
        <div className="pl-logo">Padelin</div>
        <nav className="pl-nav-links">
          <a href="#pemilik">Untuk Venue</a>
          <a href="#pemain">Untuk Pemain</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#harga">Harga</a>
        </nav>
        <div className="pl-nav-actions">
          <a className="pl-nav-login" href="#daftar">Masuk</a>
          <a className="pl-btn pl-btn-primary pl-btn-sm" href="#daftar">Daftar Gratis</a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pl-hero" data-screen-label="Hero">
      <div className="pl-container pl-hero-inner">
        <div className="pl-hero-copy">
          <SectionTag>Platform booking lapangan padel · Indonesia</SectionTag>
          <h1 className="pl-h1">
            Jadwal penuh,<br />tanpa drama <em>WhatsApp.</em>
          </h1>
          <p className="pl-body pl-hero-sub">
            Pelanggan melihat slot kosong dan booking sendiri — tanpa akun, kurang dari
            satu menit. Anda tinggal konfirmasi pembayaran dari satu dashboard.
          </p>
          <div className="pl-hero-actions">
            <a className="pl-btn pl-btn-primary" href="#daftar">Daftar Gratis</a>
            <a className="pl-btn pl-btn-ghost" href="#cara-kerja">Lihat Cara Kerja</a>
          </div>
          <div className="pl-hero-stats">
            <div className="pl-stat">
              <div className="pl-stat-num">&lt; 1 mnt</div>
              <div className="pl-stat-label">checkout pelanggan</div>
            </div>
            <div className="pl-stat-divider"></div>
            <div className="pl-stat">
              <div className="pl-stat-num">0</div>
              <div className="pl-stat-label">double booking</div>
            </div>
            <div className="pl-stat-divider"></div>
            <div className="pl-stat">
              <div className="pl-stat-num">1 link</div>
              <div className="pl-stat-label">per venue, siap dibagikan</div>
            </div>
          </div>
        </div>
        <div className="pl-hero-phone">
          <div className="pl-phone-glow"></div>
          <div className="pl-phone-scale">
            <PadelinPhone />
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [t, setTweak] = useTweaks(PADELIN_TWEAK_DEFAULTS);

  const rootStyle = {
    '--accent': t.accent,
    '--font-display': t.displayFont === 'serif'
      ? "'Instrument Serif', Georgia, serif"
      : "var(--font-body)",
  };

  return (
    <div className="pl-root" style={rootStyle} data-grain={t.grain ? 'on' : 'off'}>
      {t.grain ? <div className="pl-grain"></div> : null}
      <Nav />
      <Hero />
      <OwnerSection />
      <PlayerSection />
      <HowItWorks />
      <PricingSection />
      <FinalCTA />
      <Footer />
      <TweaksPanel>
        <TweakSection label="Warna" />
        <TweakColor
          label="Aksen"
          value={t.accent}
          options={['#A3E635', '#5EEAD4', '#E8C268', '#F0ABFC']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Tipografi" />
        <TweakRadio
          label="Judul"
          value={t.displayFont}
          options={['serif', 'sans']}
          onChange={(v) => setTweak('displayFont', v)}
        />
        <TweakSection label="Tekstur" />
        <TweakToggle label="Grain halus" value={t.grain} onChange={(v) => setTweak('grain', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
