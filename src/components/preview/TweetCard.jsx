import { VerifiedBadge } from './VerifiedBadge'
import { TweetActions } from './TweetActions'

const THEMES = {
  light: {
    bg: '#ffffff',
    border: '#eff3f4',
    name: '#0f1419',
    handle: '#536471',
    text: '#0f1419',
    timestamp: '#536471',
    dot: '#536471',
    divider: '#eff3f4',
    moreIcon: '#536471',
    xIcon: '#000000',
    logoText: '#0f1419',
  },
  dim: {
    bg: '#15202b',
    border: '#38444d',
    name: '#f7f9f9',
    handle: '#8b98a5',
    text: '#f7f9f9',
    timestamp: '#8b98a5',
    dot: '#8b98a5',
    divider: '#38444d',
    moreIcon: '#8b98a5',
    xIcon: '#ffffff',
    logoText: '#f7f9f9',
  },
  dark: {
    bg: '#000000',
    border: '#2f3336',
    name: '#e7e9ea',
    handle: '#71767b',
    text: '#e7e9ea',
    timestamp: '#71767b',
    dot: '#71767b',
    divider: '#2f3336',
    moreIcon: '#71767b',
    xIcon: '#ffffff',
    logoText: '#e7e9ea',
  },
}

function XLogo({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 1200 1227" fill={color}>
      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z" />
    </svg>
  )
}

function TwitterLogo({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
      <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
    </svg>
  )
}

function MoreIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
      <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
  )
}

function getInitialsColor(initials) {
  const colors = [
    '#1d9bf0', '#17bf63', '#ff7043', '#ab47bc',
    '#fdd835', '#00acc1', '#e91e63', '#43a047',
  ]
  const idx = (initials.charCodeAt(0) || 0) % colors.length
  return colors[idx]
}

function parseText(text) {
  // Detect @mentions, #hashtags, links, and **bold** for visual emphasis
  const parts = []
  const regex = /(\*\*[^*]+\*\*|@\w+|#\w+|https?:\/\/\S+)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    const val = match[0]
    if (val.startsWith('**')) {
      parts.push({ type: 'bold', content: val.slice(2, -2) })
    } else if (val.startsWith('@')) {
      parts.push({ type: 'mention', content: val })
    } else if (val.startsWith('#')) {
      parts.push({ type: 'hashtag', content: val })
    } else {
      parts.push({ type: 'link', content: val })
    }
    lastIndex = match.index + val.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts
}

export function TweetCard({ tweet }) {
  const t = THEMES[tweet.theme] || THEMES.dark

  const {
    displayName,
    handle,
    avatarUrl,
    avatarInitials,
    text,
    attachedImageUrl,
    badge,
    timestamp,
    customTimestamp,
    showEngagement,
    platform,
  } = tweet

  const displayTime =
    timestamp === 'now'
      ? new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : customTimestamp

  const textParts = parseText(text)
  const initBg = getInitialsColor(avatarInitials || 'A')

  return (
    <div
      style={{
        backgroundColor: t.bg,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        width: '598px',
        padding: '12px 16px 12px 16px',
      }}
    >
      {/* Header row: avatar + name/handle + logo */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Avatar */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: initBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span
              style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: '700',
                letterSpacing: '-0.5px',
              }}
            >
              {(avatarInitials || 'A').slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name + handle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            <span
              style={{
                color: t.name,
                fontSize: '15px',
                fontWeight: '700',
                lineHeight: '20px',
              }}
            >
              {displayName}
            </span>
            {badge !== 'none' && <VerifiedBadge type={badge} size={18} />}
          </div>
          <div style={{ color: t.handle, fontSize: '15px', lineHeight: '20px' }}>
            @{handle}
          </div>
        </div>

        {/* Platform logo */}
        <div style={{ flexShrink: 0, paddingTop: '2px' }}>
          {platform === 'x' ? (
            <XLogo color={t.xIcon} />
          ) : (
            <TwitterLogo color={t.xIcon} />
          )}
        </div>
      </div>

      {/* Tweet text */}
      <div
        style={{
          color: t.text,
          fontSize: '23px',
          lineHeight: '28px',
          marginTop: '12px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {textParts.map((part, i) => {
          if (part.type === 'mention' || part.type === 'hashtag' || part.type === 'link') {
            return (
              <span key={i} style={{ color: '#1d9bf0' }}>
                {part.content}
              </span>
            )
          }
          if (part.type === 'bold') {
            return (
              <strong key={i} style={{ fontWeight: '700' }}>
                {part.content}
              </strong>
            )
          }
          return <span key={i}>{part.content}</span>
        })}
      </div>

      {/* Attached image */}
      {attachedImageUrl && (
        <div
          style={{
            marginTop: '12px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${t.border}`,
          }}
        >
          <img
            src={attachedImageUrl}
            alt="attached"
            style={{ width: '100%', display: 'block', maxHeight: '320px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Timestamp */}
      <div
        style={{
          color: t.timestamp,
          fontSize: '15px',
          marginTop: '12px',
          lineHeight: '20px',
        }}
      >
        {displayTime}
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${t.divider}`, marginTop: '12px' }} />

      {/* Engagement bar */}
      {showEngagement && (
        <div style={{ marginTop: '4px' }}>
          <TweetActions tweet={{ ...tweet, theme: tweet.theme }} themeColors={t} />
        </div>
      )}
    </div>
  )
}
