import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import { useTweetStore } from '../../store/tweetStore'

const THEMES = [
  {
    value: 'patrimonio_risco',
    label: 'Patrimônio em risco',
    desc: 'Segurança e proteção do patrimônio acumulado',
  },
  {
    value: 'sem_estrategia',
    label: 'Investindo sem estratégia',
    desc: 'Reagir ao mercado vs. ter um plano consistente',
  },
  {
    value: 'assessor_banco',
    label: 'Assessor de banco',
    desc: 'Conflito de interesse vs. consultoria independente',
  },
  {
    value: 'dolarizacao',
    label: 'Dolarização',
    desc: 'Exposição ao risco Brasil e diversificação internacional',
  },
  {
    value: 'pressao_mental',
    label: 'Pressão mental',
    desc: 'O peso emocional de gerir um patrimônio elevado',
  },
  {
    value: 'risco_sozinho',
    label: 'Risco de investir sozinho',
    desc: 'O risco silencioso sem acompanhamento profissional',
  },
]

const TONES = [
  { value: 'provocativo', label: 'Provocativo' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'direto', label: 'Direto' },
]

const CTAS = [
  { value: 'saiba_mais', label: 'Saiba mais', text: 'Saiba mais.' },
  { value: 'conheca_suno', label: 'Conheça a Suno', text: 'Conheça a Suno Consultoria.' },
  { value: 'revise_carteira', label: 'Revise sua carteira', text: 'Revise sua carteira com um especialista Suno.' },
]

const SUNO_CONTEXT = `
A Suno Consultoria é uma empresa do Grupo Suno focada em consultoria financeira personalizada para pessoas físicas.

Serviços: planejamento financeiro, gestão de investimentos, construção e revisão de portfólio, proteção patrimonial e estratégias de alocação de ativos.

Público-alvo (ICP):
- Patrimônio investível acima de R$300 mil ou aportes mensais acima de R$10 mil
- Investidores maduros, geralmente acima de 35–40 anos
- Profissionais com carreira consolidada, empresários ou executivos
- Pessoas que já investem mas querem mais organização, estratégia e acompanhamento profissional
- Valorizam segurança, planejamento patrimonial e visão de longo prazo

Dores comuns:
- Falta de tempo para gerir a carteira
- Dificuldade em estruturar uma estratégia patrimonial consistente
- Insegurança sobre decisões financeiras com alto valor em jogo
- Assessor de banco trabalhando para a instituição, não para o cliente
- Exposição excessiva ao risco Brasil

Proposta de valor da Suno Consultoria:
- Consultoria independente, sem conflitos de interesse
- Plano de investimentos personalizado
- Acompanhamento profissional contínuo
- Estratégia baseada em análise independente
`

const THEME_PROMPTS = {
  patrimonio_risco: 'Tema: Patrimônio em risco. Aborde a vulnerabilidade de quem tem muito patrimônio mas não tem proteção adequada. A copy deve criar a consciência de que o leitor precisa de orientação profissional para proteger o que construiu.',
  sem_estrategia: 'Tema: Investir sem estratégia. Aborde a diferença entre quem reage a notícias e quem tem um plano estruturado. A copy deve fazer o leitor perceber que precisa de um especialista para construir uma estratégia real.',
  assessor_banco: 'Tema: Assessor de banco vs. consultoria independente. Aborde o conflito de interesse. A copy deve fazer o leitor questionar se quem o orienta realmente trabalha para ele — e perceber que precisa de alguém independente.',
  dolarizacao: 'Tema: Dolarização e risco Brasil. Aborde o risco de ter todo o patrimônio exposto ao real e à economia brasileira. A copy deve despertar a necessidade de diversificação internacional com orientação especializada.',
  pressao_mental: 'Tema: Pressão mental do patrimônio elevado. Aborde o peso psicológico de gerir sozinho um patrimônio alto. A copy deve mostrar que ter acompanhamento profissional alivia essa pressão e melhora as decisões.',
  risco_sozinho: 'Tema: Risco silencioso de investir sozinho. Aborde os erros invisíveis que comprometem anos de construção patrimonial. A copy deve fazer o leitor perceber que precisa de um especialista ao seu lado.',
}

const TONE_INSTRUCTIONS = {
  provocativo: 'Tom PROVOCATIVO: Desconforte o leitor, questione algo que ele achava que estava fazendo certo. Seja direto, sem rodeios, com uma pitada de ironia inteligente.',
  educativo: 'Tom EDUCATIVO: Ensine algo que o leitor não sabia ou não havia pensado. Use dados ou comparações concretas se fizer sentido.',
  direto: 'Tom DIRETO: Vá direto ao ponto. Fale claramente sobre a situação e o que está em jogo. Sem metáforas, sem rodeios.',
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
              fontSize: '12px',
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

export function CopyPanel() {
  const { update } = useTweetStore()
  const [theme, setTheme] = useState('patrimonio_risco')
  const [tone, setTone] = useState('provocativo')
  const [cta, setCta] = useState('saiba_mais')
  const [copy, setCopy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [applied, setApplied] = useState(false)

  async function generate() {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      setError('Adicione VITE_ANTHROPIC_API_KEY no arquivo .env')
      return
    }

    setLoading(true)
    setError('')
    setCopy('')
    setApplied(false)

    const ctaText = CTAS.find((c) => c.value === cta)?.text || ''

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

      const stream = client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 600,
        system: `Você é um copywriter humano especialista em mídia paga para investimentos e patrimônio. Você cria posts no X/Twitter para a Suno Consultoria, direcionados a investidores brasileiros com patrimônio elevado.

${SUNO_CONTEXT}

REGRAS DE FORMATO — SIGA À RISCA:
- Total de 3 a 4 parágrafos curtos (incluindo a ponte para a Suno e o CTA)
- Alvo de 400 caracteres no total. Nunca ultrapasse 430
- Cada parágrafo separado por linha em branco
- NUNCA use travessão (—). Substitua por vírgula ou reestruture a frase
- NUNCA use bullet points, listas ou emojis
- O post deve parecer escrito por um humano, não por IA
- O penúltimo parágrafo deve conectar naturalmente o tema abordado à Suno Consultoria. Varie o ângulo: pode ser credibilidade, independência, resultado, acompanhamento, etc. Nunca repita a mesma frase
- O CTA deve ser o último parágrafo, sozinho
- NÃO use hashtags nem @menções
- Escreva APENAS o texto do post, sem aspas, sem prefixos, sem explicações`,
        messages: [
          {
            role: 'user',
            content: `${THEME_PROMPTS[theme]}\n\n${TONE_INSTRUCTIONS[tone]}\n\nCTA final obrigatório (último parágrafo, sozinho): "${ctaText}"\n\nGere o post agora.`,
          },
        ],
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          setCopy((prev) => prev + event.delta.text)
        }
      }
    } catch (e) {
      setError('Erro ao gerar. Verifique a API key no .env')
    } finally {
      setLoading(false)
    }
  }

  function useCopy() {
    update({ text: copy })
    setApplied(true)
    setTimeout(() => setApplied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Tema */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--suno-muted)', marginBottom: '10px' }}>
          Tema
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {THEMES.map((t) => {
            const isActive = theme === t.value
            return (
              <button
                key={t.value}
                onClick={() => { setTheme(t.value); setCopy(''); setApplied(false) }}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--suno-red)' : '1px solid var(--suno-border)',
                  backgroundColor: isActive ? 'rgba(204,0,0,0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: '600', color: isActive ? 'var(--suno-text)' : '#aaa', margin: 0 }}>
                  {t.label}
                </p>
                <p style={{ fontSize: '11px', color: isActive ? '#888' : '#555', margin: '2px 0 0', lineHeight: 1.4 }}>
                  {t.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tom */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--suno-muted)', marginBottom: '10px' }}>
          Tom
        </label>
        <SegmentedControl value={tone} onChange={setTone} options={TONES} />
      </div>

      {/* CTA */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--suno-muted)', marginBottom: '10px' }}>
          CTA
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CTAS.map((c) => {
            const isActive = cta === c.value
            return (
              <button
                key={c.value}
                onClick={() => { setCta(c.value); setCopy(''); setApplied(false) }}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--suno-red)' : '1px solid var(--suno-border)',
                  backgroundColor: isActive ? 'rgba(204,0,0,0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <p style={{ fontSize: '12px', fontWeight: isActive ? '600' : '400', color: isActive ? 'var(--suno-text)' : '#888', margin: 0 }}>
                  {c.text}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Botão gerar */}
      <button
        onClick={generate}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: loading ? '#333' : 'var(--suno-red)',
          color: loading ? 'var(--suno-muted)' : '#fff',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          letterSpacing: '0.03em',
        }}
        onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = 'var(--suno-red-dark)' }}
        onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = 'var(--suno-red)' }}
      >
        {loading ? 'Gerando...' : 'Gerar Copy'}
      </button>

      {error && (
        <p style={{ fontSize: '12px', color: '#cc4444', margin: 0 }}>{error}</p>
      )}

      {/* Resultado */}
      {(copy || loading) && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--suno-muted)' }}>
              Resultado
            </label>
            {copy && (
              <span style={{ fontSize: '11px', color: copy.length > 260 ? '#cc0000' : '#555' }}>
                {copy.length} / 280
              </span>
            )}
          </div>
          <textarea
            readOnly
            value={copy}
            rows={6}
            style={{
              width: '100%',
              backgroundColor: '#0d0d0d',
              border: '1px solid var(--suno-border)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              color: 'var(--suno-text)',
              resize: 'none',
              outline: 'none',
              lineHeight: '1.6',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={generate}
              disabled={loading}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--suno-border)',
                backgroundColor: 'transparent',
                color: loading ? '#555' : 'var(--suno-muted)',
                fontSize: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { if (!loading) { e.target.style.borderColor = '#555'; e.target.style.color = '#fff' } }}
              onMouseLeave={(e) => { e.target.style.borderColor = 'var(--suno-border)'; e.target.style.color = 'var(--suno-muted)' }}
            >
              ↺ Gerar outro
            </button>
            <button
              onClick={useCopy}
              disabled={!copy || loading}
              style={{
                flex: 2,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: applied ? '#1a4a1a' : (copy && !loading ? 'var(--suno-red)' : '#222'),
                color: applied ? '#4caf50' : (copy && !loading ? '#fff' : '#555'),
                fontSize: '12px',
                fontWeight: '600',
                cursor: copy && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {applied ? '✓ Aplicado' : '→ Usar no criativo'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
