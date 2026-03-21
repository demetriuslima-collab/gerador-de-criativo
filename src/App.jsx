import { useRef, useState } from 'react'
import { useTweetStore } from './store/tweetStore'
import { TweetCard } from './components/preview/TweetCard'
import { ControlPanel } from './components/controls/ControlPanel'
import { CopyPanel } from './components/controls/CopyPanel'
import { ExportPanel } from './components/ui/ExportPanel'
import { useExport } from './hooks/useExport'
import { RATIOS } from './lib/defaults'

const THEME_CANVAS_BG = {
  light: '#e8e8e8',
  dim: '#1e2a38',
  dark: '#0a0a0a',
}

const PREVIEW_WIDTH = 380

export default function App() {
  const exportRef = useRef(null)
  const { tweet } = useTweetStore()
  const { exportAs, copyToClipboard, exporting } = useExport(exportRef)
  const [copyOpen, setCopyOpen] = useState(true)

  const ratio = RATIOS[tweet.ratio] || RATIOS['1:1']
  const canvasBg = THEME_CANVAS_BG[tweet.theme] || THEME_CANVAS_BG.dark

  const previewScale = PREVIEW_WIDTH / ratio.width
  const previewHeight = ratio.height * previewScale

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--suno-bg)' }}>
      {/* Left panel */}
      <aside
        className="w-80 flex-shrink-0 flex flex-col"
        style={{
          backgroundColor: 'var(--suno-surface)',
          borderRight: '1px solid var(--suno-border)',
        }}
      >
        <div className="flex-1 overflow-hidden">
          <ControlPanel />
        </div>
        <ExportPanel
          onExport={exportAs}
          onCopy={copyToClipboard}
          exporting={exporting}
        />
      </aside>

      {/* Right panel — canvas */}
      <main
        className="flex-1 flex items-center justify-center overflow-auto relative"
        style={{ backgroundColor: 'var(--suno-bg)' }}
      >
        {/* Botão reabrir Suno Copy (só aparece quando fechado) */}
        {!copyOpen && (
          <button
            onClick={() => setCopyOpen(true)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--suno-border)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: 'var(--suno-muted)',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--suno-border)'; e.currentTarget.style.color = 'var(--suno-muted)' }}
          >
            ✦ Suno Copy
          </button>
        )}
        <div className="flex flex-col items-center gap-5 p-8">
          {/* Live label */}
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--suno-red)' }}
            />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--suno-muted)' }}>
              Preview · {tweet.ratio}
            </span>
          </div>

          {/* Preview frame */}
          <div
            style={{
              width: PREVIEW_WIDTH,
              height: previewHeight,
              overflow: 'hidden',
              borderRadius: '6px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              border: '1px solid #2a2a2a',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
                width: ratio.width,
                height: ratio.height,
              }}
            >
              <div
                ref={exportRef}
                style={{
                  width: ratio.width,
                  height: ratio.height,
                  backgroundColor: canvasBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TweetCard tweet={tweet} />
              </div>
            </div>
          </div>

          {/* Dimension info */}
          <p className="text-xs" style={{ color: 'var(--suno-muted)' }}>
            {ratio.width * 2} × {ratio.height * 2}px · 2x · {ratio.desc}
          </p>

          <p className="text-xs text-center max-w-xs" style={{ color: '#444' }}>
            Use <strong style={{ color: '#666' }}>**texto**</strong> para negrito ·{' '}
            <strong style={{ color: '#666' }}>@menções</strong> e{' '}
            <strong style={{ color: '#666' }}>#hashtags</strong> ficam em azul
          </p>
        </div>
      </main>
      {/* Suno Copy — painel direito */}
      {copyOpen && (
        <aside
          style={{
            width: '300px',
            flexShrink: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--suno-surface)',
            borderLeft: '1px solid var(--suno-border)',
          }}
        >
          {/* Header do painel */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--suno-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <p style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--suno-muted)', margin: 0 }}>
              Suno Copy
            </p>
            <button
              onClick={() => setCopyOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--suno-muted)',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--suno-muted)'}
            >
              ✕
            </button>
          </div>
          {/* Conteúdo scrollável */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <CopyPanel />
          </div>
        </aside>
      )}
    </div>
  )
}
