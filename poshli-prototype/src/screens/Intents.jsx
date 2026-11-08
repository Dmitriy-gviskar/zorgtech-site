import { useApp, candidatesForIntent } from '../state/AppContext.jsx'
import { getEvent, CATEGORIES } from '../data/events.js'

export default function Intents() {
  const { state, dispatch } = useApp()

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2>Мои интенты</h2>
          <p className="muted">Куда ты хочешь — и кто совпал</p>
        </div>
      </header>

      {state.intents.length === 0 && (
        <div className="empty">
          <span className="empty-emoji">✨</span>
          <p>Пока пусто. Выбери событие в афише и нажми «Хочу сюда».</p>
          <button className="btn-primary" onClick={() => dispatch({ type: 'NAV', screen: 'afisha' })}>
            Открыть афишу
          </button>
        </div>
      )}

      <div className="intent-list">
        {state.intents.map((intent) => {
          const ev = getEvent(intent.eventId)
          const pool = candidatesForIntent(intent, state.swipes)
          const exact = pool.filter((p) => p.kind === 'exact').length
          const soft = pool.length - exact
          return (
            <article
              key={intent.id}
              className="intent-card"
              onClick={() => {
                if (pool.length > 0) dispatch({ type: 'NAV', screen: 'candidates', params: { intentId: intent.id } })
              }}
            >
              <div className="intent-cover" style={{ background: ev.gradient }}>
                {CATEGORIES[ev.category].emoji}
              </div>
              <div className="intent-body">
                <h3>{ev.title}</h3>
                <p className="muted">{ev.dateLabel} · {intent.slot}</p>
                <p className="intent-stats">
                  {pool.length > 0
                    ? `${exact} точных · ${soft} почти совпали`
                    : 'Новых кандидатов пока нет'}
                </p>
              </div>
              <div className="intent-actions">
                <button
                  className="btn-primary small"
                  disabled={pool.length === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch({ type: 'NAV', screen: 'candidates', params: { intentId: intent.id } })
                  }}
                >
                  Смотреть
                </button>
                <button
                  className="btn-ghost small"
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch({ type: 'REMOVE_INTENT', intentId: intent.id })
                  }}
                >
                  Удалить
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
