import { useApp, matchMembers } from '../state/AppContext.jsx'
import { getCandidate } from '../data/candidates.js'
import { getEvent } from '../data/events.js'
import Avatar from '../components/Avatar.jsx'

const STATUS_LABEL = {
  chat: 'договариваемся',
  confirmed: 'план подтверждён ✅',
  done: 'встреча состоялась 🎉',
}

export default function Chats() {
  const { state, dispatch } = useApp()

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2>Чаты</h2>
          <p className="muted">Каждый чат — это конкретный план, а не переписка в пустоту</p>
        </div>
      </header>

      {state.matches.length === 0 && (
        <div className="empty">
          <span className="empty-emoji">💬</span>
          <p>Матчей пока нет. Создай интент в афише и полайкай совпавших.</p>
          <button className="btn-primary" onClick={() => dispatch({ type: 'NAV', screen: 'afisha' })}>
            В афишу
          </button>
        </div>
      )}

      <div className="chat-list">
        {state.matches.map((m) => {
          const members = matchMembers(m).map(getCandidate)
          const ev = m.chosenEventId ? getEvent(m.chosenEventId) : null
          const last = m.messages[m.messages.length - 1]
          const title =
            m.kind === 'group'
              ? `Компания: ${members.map((c) => c.name).join(', ')}`
              : members[0].name
          return (
            <button
              key={m.id}
              className="chat-item"
              onClick={() => dispatch({ type: 'NAV', screen: 'chat', params: { matchId: m.id } })}
            >
              <div className="avatar-stack">
                {members.slice(0, 3).map((c) => (
                  <Avatar key={c.id} candidate={c} size={members.length > 1 ? 40 : 52} />
                ))}
              </div>
              <div className="chat-item-body">
                <div className="chat-item-top">
                  <strong className="ellipsis">{title}</strong>
                  <span className={`status-pill ${m.status}`}>{STATUS_LABEL[m.status]}</span>
                </div>
                <p className="muted ellipsis">
                  {ev ? `${ev.title} · ${ev.dateLabel}` : 'Выбираете, куда пойти'}
                </p>
                <p className="last-msg ellipsis">{last?.text}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
