import { useApp, candidatesForIntent, reliability } from '../state/AppContext.jsx'
import { getEvent, CATEGORIES } from '../data/events.js'

export default function Candidates({ intentId }) {
  const { state, dispatch } = useApp()
  const isCompany = state.user.mode === 'company'
  const intent = state.intents.find((i) => i.id === intentId)

  if (!intent) {
    return (
      <div className="page">
        <BackHead dispatch={dispatch} title="Совпадения" />
        <div className="empty"><p>Интент не найден (возможно, уже завершён).</p></div>
      </div>
    )
  }

  const myEvent = getEvent(intent.eventId)
  const pool = candidatesForIntent(intent, state.swipes)
  const current = pool[0]

  return (
    <div className="page">
      <BackHead
        dispatch={dispatch}
        title={myEvent.title}
        subtitle={`${myEvent.dateLabel} · ${intent.slot} · ещё ${pool.length} чел.`}
      />

      {!current && (
        <div className="empty">
          <span className="empty-emoji">🌊</span>
          <p>Кандидаты на этот интент закончились. Загляни позже или создай новый интент.</p>
          <button className="btn-primary" onClick={() => dispatch({ type: 'NAV', screen: 'afisha' })}>
            В афишу
          </button>
        </div>
      )}

      {current && (
        <CandidateCard
          key={current.candidate.id}
          item={current}
          intent={intent}
          dispatch={dispatch}
          isCompany={isCompany}
        />
      )}
    </div>
  )
}

function BackHead({ dispatch, title, subtitle }) {
  return (
    <header className="page-head with-back">
      <button className="btn-back" onClick={() => dispatch({ type: 'NAV', screen: 'intents' })}>←</button>
      <div>
        <h2 className="ellipsis">{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
    </header>
  )
}

function CandidateCard({ item, intent, dispatch, isCompany }) {
  const { candidate, kind, theirIntent } = item
  const theirEvent = getEvent(theirIntent.eventId)
  const rel = reliability(candidate.rep)

  return (
    <div className="cand-card">
      <div
        className="cand-photo"
        style={{ background: `linear-gradient(160deg, hsl(${candidate.hue} 90% 82%), hsl(${(candidate.hue + 50) % 360} 75% 60%))` }}
      >
        <span className="cand-emoji">{candidate.emoji}</span>
        <span className={`match-kind ${kind}`}>
          {kind === 'exact' ? '🎯 Точное совпадение' : '≈ Почти совпали'}
        </span>
      </div>

      <div className="cand-info">
        <div className="cand-name-row">
          <h3>{candidate.name}, {candidate.age}</h3>
          <span className="rep" title="Репутация посещаемости">✅ приходит {rel}%</span>
        </div>
        <p className="cand-bio">{candidate.bio}</p>

        <div className="their-plan">
          {kind === 'exact' ? (
            <p>
              Тоже идёт: <strong>{theirEvent.title}</strong>, слот {theirIntent.slot}
              {theirIntent.slot !== intent.slot && ' (другое время — договоритесь в чате)'}
            </p>
          ) : (
            <p>
              Хочет в ту же категорию ({CATEGORIES[theirEvent.category].emoji} {CATEGORIES[theirEvent.category].label.toLowerCase()}),
              но на <strong>{theirEvent.title}</strong>. Совпадёте — выберете вместе.
            </p>
          )}
        </div>

        <div className="cand-history">
          <span className="muted">Ходит на:</span>{' '}
          {candidate.intents.map((ci) => CATEGORIES[getEvent(ci.eventId).category].emoji).join(' ')}
          <span className="muted"> · {candidate.rep.visited} встреч</span>
        </div>
      </div>

      <div className="swipe-row">
        <button
          className="swipe-btn skip"
          onClick={() => dispatch({ type: 'SWIPE', intentId: intent.id, candidateId: candidate.id, dir: 'skipped' })}
        >
          ✕
        </button>
        <button
          className="swipe-btn like"
          title={isCompany ? 'Позвать в компанию' : 'Лайк'}
          onClick={() => dispatch({ type: 'SWIPE', intentId: intent.id, candidateId: candidate.id, dir: 'liked' })}
        >
          {isCompany ? '＋' : '♥'}
        </button>
      </div>
    </div>
  )
}
