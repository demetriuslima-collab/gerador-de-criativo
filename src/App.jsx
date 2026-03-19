import { useRef } from 'react'
import { useTweetStore } from './store/tweetStore'
import { TweetCard } from './components/preview/TweetCard'
import { ControlPanel } from './components/controls/ControlPanel'
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
        className="flex-1 flex items-center justify-center overflow-auto"
        style={{ backgroundColor: 'var(--suno-bg)' }}
      >
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
    </div>
  )
}
