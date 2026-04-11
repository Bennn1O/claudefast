'use client'

interface Sponsor {
  id: string
  name: string
  description: string
  url: string
  cta: string
}

const SPONSORS: Sponsor[] = [
  {
    id: 'hypergrowth',
    name: 'HyperGrowth',
    description: 'Operating Partner dédié + équipe d\'experts pour scaler sans chaos. 150+ dirigeants accompagnés.',
    url: 'https://hypergrowth.fr',
    cta: 'Voir l\'offre',
  },
  {
    id: 'fastscribe',
    name: 'FastScribe',
    description: 'Le meilleur AI note taker — transcription + flashcards IA. Se connecte à tous vos outils.',
    url: 'https://fastscribe.io',
    cta: 'Essayer',
  },
]

function logoUrl(url: string) {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=64`
}

function utmUrl(url: string) {
  const u = new URL(url)
  u.searchParams.set('utm_source', 'claudefast')
  u.searchParams.set('utm_medium', 'sponsorship')
  return u.toString()
}

export function SponsorBlock() {
  const sponsor = SPONSORS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % SPONSORS.length]

  return (
    <div>
      <p style={{ fontFamily: 'Arial,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6a6058', marginBottom: 8 }}>
        Sponsorisé
      </p>
      <a
        href={utmUrl(sponsor.url)}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block border border-[#403a32] rounded-xl p-4 hover:border-[#D97B4F] transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl(sponsor.url)}
            alt=""
            width={16}
            height={16}
            style={{ borderRadius: 3, objectFit: 'contain', flexShrink: 0 }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          <span className="text-xs font-bold text-[#f0ead8]">{sponsor.name}</span>
        </div>
        <p className="text-xs text-[#8a8070] leading-relaxed mb-3">{sponsor.description}</p>
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#f0ead8] text-[#141210] px-3 py-1 rounded-sm">
          {sponsor.cta} →
        </span>
      </a>
    </div>
  )
}

export function SponsorEmpty() {
  return (
    <div>
      <p style={{ fontFamily: 'Arial,sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6a6058', marginBottom: 8 }}>
        Sponsorisé
      </p>
      <a
        href="https://wa.me/33648890222?text=Bonjour%2C%20je%20souhaite%20sponsoriser%20ClaudeFast."
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-dashed border-[#403a32] rounded-xl p-4 hover:border-[#D97B4F] transition-colors"
      >
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 13, fontWeight: 700, color: '#f0ead8', lineHeight: 1.3, marginBottom: 6 }}>
          Votre marque ici
        </p>
        <p className="text-xs text-[#8a8070] leading-relaxed mb-3">
          Touchez des builders et devs qui configurent Claude Code.
        </p>
        <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#f0ead8] text-[#141210] px-3 py-1 rounded-sm">
          Sponsoriser →
        </span>
      </a>
    </div>
  )
}
