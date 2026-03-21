import { useRef } from 'react'
import { useTweetStore } from '../../store/tweetStore'
import { PRESETS } from '../../lib/defaults'

function Section({ title, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--suno-border)', paddingBottom: '20px', marginBottom: '20px' }}
      className="last:border-0 last:pb-0 last:mb-0">
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--suno-muted)' }}>
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Label({ children }) {
  return (
    <label className="block text-sm mb-1" style={{ color: '#aaa' }}>{children}</label>
  )
}

function Input({ value, onChange, placeholder, maxLength }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%',
        backgroundColor: '#111',
        border: '1px solid var(--suno-border)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        color: 'var(--suno-text)',
        outline: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={(e) => e.target.style.borderColor = 'var(--suno-red)'}
      onBlur={(e) => e.target.style.borderColor = 'var(--suno-border)'}
    />
  )
}

function Textarea({ value, onChange, placeholder, maxLength = 280 }) {
  const remaining = maxLength - value.length
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
        style={{
          width: '100%',
          backgroundColor: '#111',
          border: '1px solid var(--suno-border)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '14px',
          color: 'var(--suno-text)',
          outline: 'none',
          resize: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--suno-red)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--suno-border)'}
      />
      <div style={{ fontSize: '11px', textAlign: 'right', marginTop: '4px', color: remaining < 20 ? '#cc0000' : '#555' }}>
        {remaining}
      </div>
    </div>
  )
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--suno-border)', borderRadius: '8px', overflow: 'hidden' }}>
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: '6px 4px',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '400',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: isActive ? 'var(--suno-red)' : '#111',
              color: isActive ? '#fff' : 'var(--suno-muted)',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
      onClick={() => onChange(!checked)}>
      <span style={{ fontSize: '14px', color: '#aaa' }}>{label}</span>
      <div style={{
        position: 'relative', width: '40px', height: '20px',
        borderRadius: '10px', backgroundColor: checked ? 'var(--suno-red)' : '#333',
        transition: 'background-color 0.2s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: '2px',
          left: checked ? '22px' : '2px',
          width: '16px', height: '16px',
          borderRadius: '50%', backgroundColor: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }} />
      </div>
    </div>
  )
}

function getInitialsColor(initials) {
  const colors = ['#cc0000', '#b30000', '#990000', '#cc2200', '#cc4400', '#aa0000']
  return colors[(initials?.charCodeAt(0) || 0) % colors.length]
}

export function ControlPanel() {
  const { tweet, update, reset, applyPreset, saveAvatarForPreset, presetAvatars } = useTweetStore()
  const avatarInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const presetUploadRef = useRef(null)
  const presetUploadTarget = useRef(null)

  function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update({ avatarUrl: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update({ attachedImageUrl: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handlePresetAvatarUpload(e) {
    const file = e.target.files[0]
    const presetId = presetUploadTarget.current
    if (!file || !presetId) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      saveAvatarForPreset(presetId, ev.target.result)
      if (tweet._activePreset === presetId) update({ avatarUrl: ev.target.result })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function triggerPresetAvatarUpload(presetId) {
    presetUploadTarget.current = presetId
    presetUploadRef.current?.click()
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header fixo (não scrolla) */}
      <div style={{ padding: '20px 20px 16px', flexShrink: 0, borderBottom: '1px solid var(--suno-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '2px' }}>
              <span style={{ color: 'var(--suno-red)', fontSize: '18px', fontWeight: '300', lineHeight: 1 }}>(</span>
              <span style={{ color: 'var(--suno-text)', fontSize: '15px', fontWeight: '600', letterSpacing: '3px', lineHeight: 1 }}>SUNO</span>
              <span style={{ color: 'var(--suno-red)', fontSize: '18px', fontWeight: '300', lineHeight: 1 }}>)</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--suno-muted)', letterSpacing: '0.5px' }}>Social Hack · Gerador de criativos</p>
          </div>
          <button
            onClick={reset}
            style={{
              fontSize: '11px', color: 'var(--suno-muted)', border: '1px solid var(--suno-border)',
              borderRadius: '6px', padding: '4px 10px', background: 'none', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#fff'; e.target.style.borderColor = '#555' }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--suno-muted)'; e.target.style.borderColor = 'var(--suno-border)' }}
          >
            Resetar
          </button>
        </div>
      </div>

      {/* Conteúdo scrollável */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <>

      {/* Presets */}
      <Section title="Perfil Rápido">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PRESETS.map((preset) => {
            const isActive = tweet._activePreset === preset.id
            const avatarSrc = presetAvatars[preset.id] ?? preset.avatarUrl ?? null
            const initBg = getInitialsColor(preset.initials)

            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px', borderRadius: '12px', cursor: 'pointer',
                  border: isActive ? '1px solid var(--suno-red)' : '1px solid var(--suno-border)',
                  backgroundColor: isActive ? 'rgba(204,0,0,0.08)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.15s',
                }}
              >
                {/* Avatar */}
                <div style={{
                  position: 'relative', width: '40px', height: '40px',
                  borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: avatarSrc ? 'transparent' : initBg,
                }}>
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: '700' }}>{preset.initials}</span>
                  )}
                  <div
                    onClick={(e) => { e.stopPropagation(); triggerPresetAvatarUpload(preset.id) }}
                    style={{
                      position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.15s', borderRadius: '50%', cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >📷</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--suno-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {preset.displayName}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--suno-muted)', margin: 0 }}>@{preset.handle}</p>
                </div>

                {isActive && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--suno-red)', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
          <p style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>
            Passe o mouse no avatar para trocar a foto
          </p>
        </div>
        <input ref={presetUploadRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePresetAvatarUpload} />
      </Section>

      {/* Perfil manual */}
      <Section title="Perfil">
        <div>
          <Label>Avatar</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              onClick={() => avatarInputRef.current?.click()}
              style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: '#111', border: '2px dashed var(--suno-border)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0, transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--suno-red)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--suno-border)'}
            >
              {tweet.avatarUrl ? (
                <img src={tweet.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#555', fontSize: '11px', textAlign: 'center', lineHeight: 1.2 }}>+<br/>foto</span>
              )}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Input
                value={tweet.avatarInitials}
                onChange={(v) => update({ avatarInitials: v })}
                placeholder="Iniciais (ex: TG)"
                maxLength={3}
              />
              {tweet.avatarUrl && (
                <button onClick={() => update({ avatarUrl: null })}
                  style={{ fontSize: '11px', color: 'var(--suno-red)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Remover foto
                </button>
              )}
            </div>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
        </div>

        <div>
          <Label>Nome de exibição</Label>
          <Input value={tweet.displayName} onChange={(v) => update({ displayName: v })} placeholder="Ex: Tiago Guitián Reis" maxLength={50} />
        </div>

        <div>
          <Label>@ Handle</Label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '9px', color: '#555', fontSize: '14px' }}>@</span>
            <input
              type="text"
              value={tweet.handle}
              onChange={(e) => update({ handle: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
              placeholder="Tiagogreis"
              maxLength={15}
              style={{
                width: '100%', backgroundColor: '#111', border: '1px solid var(--suno-border)',
                borderRadius: '8px', paddingLeft: '28px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px',
                fontSize: '14px', color: 'var(--suno-text)', outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--suno-red)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--suno-border)'}
            />
          </div>
        </div>
      </Section>

      {/* Conteúdo */}
      <Section title="Conteúdo">
        <div>
          <Label>Texto do tweet</Label>
          <Textarea
            value={tweet.text}
            onChange={(v) => update({ text: v })}
            placeholder="O que está acontecendo?"
            maxLength={500}
          />
          <p style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>Use **negrito**, @menções, #hashtags</p>
        </div>

        <div>
          <Label>Imagem no tweet (opcional)</Label>
          {tweet.attachedImageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <img src={tweet.attachedImageUrl} alt="preview"
                style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--suno-border)' }} />
              <button onClick={() => update({ attachedImageUrl: null })}
                style={{ fontSize: '11px', color: 'var(--suno-red)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                Remover imagem
              </button>
            </div>
          ) : (
            <button
              onClick={() => imageInputRef.current?.click()}
              style={{
                width: '100%', padding: '12px', border: '2px dashed var(--suno-border)',
                borderRadius: '8px', fontSize: '13px', color: '#555', backgroundColor: 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = 'var(--suno-red)'; e.target.style.color = 'var(--suno-text)' }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--suno-border)'; e.target.style.color = '#555' }}
            >
              + Adicionar imagem
            </button>
          )}
          <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        </div>
      </Section>

      {/* Data e Hora */}
      <Section title="Data e Hora">
        <SegmentedControl
          value={tweet.timestamp}
          onChange={(v) => update({ timestamp: v })}
          options={[{ value: 'now', label: 'Agora' }, { value: 'custom', label: 'Personalizado' }]}
        />
        {tweet.timestamp === 'custom' && (
          <Input value={tweet.customTimestamp} onChange={(v) => update({ customTimestamp: v })} placeholder="10:30 AM · Mar 19, 2026" />
        )}
      </Section>

      {/* Badge */}
      <Section title="Verificação">
        <SegmentedControl
          value={tweet.badge}
          onChange={(v) => update({ badge: v })}
          options={[
            { value: 'none', label: 'Nenhum' },
            { value: 'blue', label: '🔵 Azul' },
            { value: 'gold', label: '🟡 Ouro' },
            { value: 'gray', label: '⚪ Gov' },
          ]}
        />
      </Section>

      {/* Tema */}
      <Section title="Tema">
        <SegmentedControl
          value={tweet.theme}
          onChange={(v) => update({ theme: v })}
          options={[
            { value: 'light', label: 'Claro' },
            { value: 'dim', label: 'Dim' },
            { value: 'dark', label: 'Escuro' },
          ]}
        />
      </Section>

      {/* Plataforma */}
      <Section title="Plataforma">
        <SegmentedControl
          value={tweet.platform}
          onChange={(v) => update({ platform: v })}
          options={[
            { value: 'x', label: 'X (atual)' },
            { value: 'twitter', label: 'Twitter' },
          ]}
        />
      </Section>

      {/* Engajamento */}
      <Section title="Engajamento">
        <Toggle
          checked={tweet.showEngagement}
          onChange={(v) => update({ showEngagement: v })}
          label="Mostrar barra de ações"
        />
        {tweet.showEngagement && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '4px' }}>
            {[
              { key: 'replies', label: 'Replies' },
              { key: 'reposts', label: 'Reposts' },
              { key: 'likes', label: 'Likes' },
              { key: 'views', label: 'Views' },
              { key: 'bookmarks', label: 'Bookmarks' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label>{label}</Label>
                <Input value={tweet[key]} onChange={(v) => update({ [key]: v })} placeholder="0" />
              </div>
            ))}
          </div>
        )}
      </Section>
        </>
      </div>
    </div>
  )
}
