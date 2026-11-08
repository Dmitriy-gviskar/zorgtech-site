import { useApp } from '../state/AppContext.jsx'
import { getEvent, CATEGORIES } from '../data/events.js'
import { getCandidate } from '../data/candidates.js'

export default function Profile() {
  const { state, dispatch } = useApp()
  const { user, visits, intents } = state
  const confirmed = state.matches.filter((m) => m.status !== 'chat').length

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2>Профиль</h2>
          <p className="muted">Твой профиль наполняется сам — от того, куда ты ходишь</p>
        </div>
      </header>

      <div className="profile-card">
        <div className="avatar me">{user.mode === 'dating' ? '💘' : '👥'}</div>
        <div>
          <h3>{user.name}, {user.age}</h3>
          <p className="muted">Москва · режим: {user.mode === 'dating' ? 'дейтинг' : 'компания'}</p>
        </div>
      </div>

      <div className="mode-switch">
        <button
          className={`chip${user.mode === 'dating' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'dating' })}
        >
          💘 Дейтинг
        </button>
        <button
          className={`chip${user.mode === 'company' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_MODE', mode: 'company' })}
        >
          👥 Компания
        </button>
      </div>

      <div className="stats-row">
        <div className="stat">
          <strong>{visits.length}</strong>
          <span>встреч состоялось</span>
        </div>
        <div className="stat">
          <strong>{visits.length}/{Math.max(confirmed, visits.length)}</strong>
          <span>пришёл / планов</span>
        </div>
        <div className="stat">
          <strong>{intents.length}</strong>
          <span>активных интентов</span>
        </div>
      </div>

      <h3 className="section-title">История посещений</h3>
      {visits.length === 0 ? (
        <p className="muted">Пока пусто. Первая встреча появится здесь после чек-ина.</p>
      ) : (
        <div className="visit-list">
          {visits.map((v, i) => {
            const ev = getEvent(v.eventId)
            const names = (v.candidateIds || [v.candidateId]).map((id) => getCandidate(id).name).join(', ')
            return (
              <div key={i} className="visit-item">
                <span className="visit-emoji">{CATEGORIES[ev.category].emoji}</span>
                <div>
                  <strong>{ev.title}</strong>
                  <p className="muted">{ev.dateLabel} · вместе с {names}</p>
                </div>
                <span className="rep">✅</span>
              </div>
            )
          })}
        </div>
      )}

      <button className="btn-ghost reset" onClick={() => dispatch({ type: 'RESET' })}>
        Сбросить прототип
      </button>
    </div>
  )
}
