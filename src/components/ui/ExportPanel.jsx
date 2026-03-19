import { useState } from 'react'
import { useTweetStore } from '../../store/tweetStore'
import { RATIOS } from '../../lib/defaults'

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  )
}

function RatioIcon({ ratio, active }) {
  const color = active ? '#fff' : '#666'
  const dims = { '1:1': { w: 18, h: 18 }, '4:5': { w: 16, h: 20 }, '9:16': { w: 12, h: 22 } }
  const d = dims[ratio] || dims['1:1']
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <rect x={(26 - d.w) / 2} y={(26 - d.h) / 2} width={d.w} height={d.h} rx="2"
        fill="none" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

export function ExportPanel({ onExport, onCopy, exporting }) {
  const { tweet, update } = useTweetStore()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const ok = await onCopy(2)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div style={{ borderTop: '1px solid var(--suno-border)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Formato */}
      <div>
        <p style={{ fontSize: '11px', color: 'var(--suno-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Formato
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.keys(RATIOS).map((key) => {
            const r = RATIOS[key]
            const isActive = tweet.ratio === key
            return (
              <button
                key={key}
                onClick={() => update({ ratio: key })}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '4px', padding: '10px 4px', borderRadius: '10px', cursor: 'pointer',
                  border: isActive ? '1px solid var(--suno-red)' : '1px solid var(--suno-border)',
                  backgroundColor: isActive ? 'rgba(204,0,0,0.1)' : 'rgba(255,255,255,0.02)',
                  color: isActive ? '#fff' : '#666',
                  transition: 'all 0.15s',
                }}
              >
                <RatioIcon ratio={key} active={isActive} />
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{r.label}</span>
                <span style={{ fontSize: '10px', color: isActive ? '#aaa' : '#444', textAlign: 'center', lineHeight: 1.3 }}>{r.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Botões de export */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleCopy}
          disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 12px',
            borderRadius: '8px', border: '1px solid var(--suno-border)', backgroundColor: '#111',
            fontSize: '13px', color: 'var(--suno-text)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#555'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--suno-border)'}
        >
          <CopyIcon />
          {copied ? 'Copiado!' : 'Copiar'}
        </button>

        <button
          onClick={() => onExport('jpeg', 2)}
          disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 12px',
            borderRadius: '8px', border: '1px solid var(--suno-border)', backgroundColor: '#111',
            fontSize: '13px', color: 'var(--suno-text)', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#555'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--suno-border)'}
        >
          <DownloadIcon />
          JPEG
        </button>

        <button
          onClick={() => onExport('png', 2)}
          disabled={exporting}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '9px 0', flex: 1,
            borderRadius: '8px', border: 'none', backgroundColor: 'var(--suno-red)',
            fontSize: '13px', fontWeight: '600', color: '#fff', cursor: 'pointer',
            transition: 'background-color 0.15s', opacity: exporting ? 0.6 : 1,
          }}
          onMouseEnter={(e) => { if (!exporting) e.currentTarget.style.backgroundColor = 'var(--suno-red-dark)' }}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--suno-red)'}
        >
          {exporting ? 'Exportando...' : <><DownloadIcon /> PNG</>}
        </button>
      </div>
    </div>
  )
}
