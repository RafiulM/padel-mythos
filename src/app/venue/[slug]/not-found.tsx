export default function VenueNotFound() {
  return (
    <div className="pb-page">
      <div className="pb-app">
        <div className="pb-screen" style={{ justifyContent: 'center', textAlign: 'center', gap: 12 }}>
          <div className="pb-venue-name">Venue tidak ditemukan</div>
          <div className="pb-pay-note" style={{ margin: '0 auto' }}>
            Periksa kembali link yang Anda terima dari venue.
          </div>
        </div>
      </div>
    </div>
  )
}
