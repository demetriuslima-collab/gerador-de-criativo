export const DEFAULT_TWEET = {
  // Profile
  displayName: 'Tiago Guitián Reis',
  handle: 'Tiagogreis',
  avatarUrl: '/avatars/tiago.jpg',
  avatarInitials: 'TG',
  _activePreset: 'tiago',

  // Content
  text: 'Enquanto você espera o mercado subir, nosso método identifica as melhores oportunidades antes da maioria. Já são +30.000 investidores que aplicam isso na prática. 🧵',
  attachedImageUrl: null,

  // Metadata
  timestamp: 'now',
  customTimestamp: '10:30 AM · Mar 19, 2026',

  // Badge
  badge: 'blue',

  // Theme
  theme: 'dark',

  // Platform style
  platform: 'x',

  // Engagement
  showEngagement: true,
  replies: '847',
  reposts: '2,341',
  likes: '18,4K',
  views: '1,2M',
  bookmarks: '3,1K',

  // Export
  scale: 2,
  ratio: '1:1', // '1:1' | '4:5' | '9:16'
}

export const PRESETS = [
  {
    id: 'tiago',
    label: 'Tiago Guitián',
    initials: 'TG',
    displayName: 'Tiago Guitián Reis',
    handle: 'Tiagogreis',
    badge: 'blue',
    avatarUrl: '/avatars/tiago.jpg',
  },
  {
    id: 'suno',
    label: 'Suno Research',
    initials: 'SR',
    displayName: 'Suno Research',
    handle: 'sunoresearch',
    badge: 'blue',
    avatarUrl: '/avatars/suno.jpg',
  },
]

// Aspect ratio dimensions based on tweet card width (598px)
export const RATIOS = {
  '1:1':  { label: '1:1',  width: 598, height: 598,  desc: 'Feed quadrado' },
  '4:5':  { label: '4:5',  width: 598, height: 748,  desc: 'Feed retrato' },
  '9:16': { label: '9:16', width: 598, height: 1064, desc: 'Stories / Reels' },
}
