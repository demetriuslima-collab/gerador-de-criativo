import { toPng, toJpeg } from 'html-to-image'
import { useCallback, useState } from 'react'

export function useExport(ref) {
  const [exporting, setExporting] = useState(false)

  const exportAs = useCallback(
    async (format = 'png', scale = 2) => {
      if (!ref.current) return
      setExporting(true)

      try {
        const options = {
          pixelRatio: scale,
          cacheBust: true,
          skipFonts: false,
          style: {
            borderRadius: '0',
          },
        }

        let dataUrl
        if (format === 'jpeg') {
          dataUrl = await toJpeg(ref.current, { ...options, quality: 0.95, backgroundColor: '#ffffff' })
        } else {
          dataUrl = await toPng(ref.current, options)
        }

        const id = Math.random().toString(36).slice(2, 8)
        const link = document.createElement('a')
        link.download = `social-hack-${id}.${format}`
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Export error:', err)
      } finally {
        setExporting(false)
      }
    },
    [ref]
  )

  const copyToClipboard = useCallback(
    async (scale = 2) => {
      if (!ref.current || !navigator.clipboard) return
      setExporting(true)

      try {
        const dataUrl = await toPng(ref.current, { pixelRatio: scale, cacheBust: true })
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        return true
      } catch (err) {
        console.error('Clipboard error:', err)
        return false
      } finally {
        setExporting(false)
      }
    },
    [ref]
  )

  return { exportAs, copyToClipboard, exporting }
}
