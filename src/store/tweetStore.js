import { create } from 'zustand'
import { DEFAULT_TWEET, PRESETS } from '../lib/defaults'

// Test if a static avatar file exists (returns promise)
async function checkAvatarExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

export const useTweetStore = create((set, get) => ({
  tweet: { ...DEFAULT_TWEET },

  // Avatar URLs uploaded manually by the user, keyed by preset id
  presetAvatars: {},

  update: (fields) =>
    set((state) => ({ tweet: { ...state.tweet, ...fields } })),

  applyPreset: async (presetId) => {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const { presetAvatars, tweet } = get()

    // Priority: 1) manually uploaded, 2) static file, 3) null (use initials)
    let avatarUrl = presetAvatars[presetId] ?? null

    if (!avatarUrl && preset.avatarUrl) {
      const exists = await checkAvatarExists(preset.avatarUrl)
      if (exists) avatarUrl = preset.avatarUrl
    }

    set({
      tweet: {
        ...tweet,
        displayName: preset.displayName,
        handle: preset.handle,
        badge: preset.badge,
        avatarInitials: preset.initials,
        avatarUrl,
        _activePreset: presetId,
      },
    })
  },

  saveAvatarForPreset: (presetId, dataUrl) =>
    set((state) => ({
      presetAvatars: { ...state.presetAvatars, [presetId]: dataUrl },
      tweet: { ...state.tweet, avatarUrl: dataUrl },
    })),

  reset: () => set({ tweet: { ...DEFAULT_TWEET } }),
}))
