import { useState } from 'react'
import { EVENTS, CATEGORIES } from '../data/events.js'
import { useApp } from '../state/AppContext.jsx'

export default function Afisha() {
  const { state, dispatch } = useApp()
  const [filter, setFilter] = useState(null)
  const [picking, setPicking] = useState(null) // событие, для которого выбираем слот

  const events = filter ? EVENTS.filter((e) => e.category === filter) : EVENTS
  const intentEventIds = new Set(state.intents.map((i) => i.eventId))

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2>Афиша недели</h2>
          <p className="muted">Москва · 10–16 августа · курируем вручную</p>
        </div>
      </header>

      <div className="chips">
        <button className={`chip${!filter ? ' active' : ''}`} onClick={() => setFilter(null)}>Всё</button>
        {Object.entries(CATEGORIES).map(([id, c]) => (
          <button key={id} className={`chip${filter === id ? ' active' : ''}`} onClick={() => setFilter(id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="event-list">
        {events.map((ev) => (
          <article
            key={ev.id}
            className="event-card"
            onClick={() => {
              if (intentEventIds.has(ev.id)) {
                const intent = state.intents.find((i) => i.eventId === ev.id)
                dispatch({ type: 'NAV', screen: 'candidates', params: { intentId: intent.id } })
              } else {
                setPicking(ev)
              }
            }}
          >
            <div className="event-cover" style={{ background: ev.gradient }}>
              <span className="event-emoji">{CATEGORIES[ev.category].emoji}</span>
              {ev.partner && <span className="partner-tag">партнёр · бонус</span>}
            </div>
            <div className="event-body">
              <div className="event-top">
                <h3>{ev.title}</h3>
                <span className="event-price">{ev.price}</span>
              </div>
              <p className="muted">{ev.venue} · {ev.dateLabel}</p>
              <p className="event-blurb">{ev.blurb}</p>
              {intentEventIds.has(ev.id) ? (
                <button
                  className="btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    const intent = state.intents.find((i) => i.eventId === ev.id)
                    dispatch({ type: 'NAV', screen: 'candidates', params: { intentId: intent.id } })
                  }}
                >
                  Интент создан → смотреть совпадения
                </button>
              ) : (
                <button className="btn-primary" onClick={(e) => { e.stopPropagation(); setPicking(ev) }}>
                  Хочу сюда
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {picking && (
        <div className="sheet-backdrop" onClick={() => setPicking(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h3>{picking.title}</h3>
            <p className="muted">{picking.venue} · {picking.dateLabel}</p>
            <p className="sheet-label">Когда тебе удобно?</p>
            <div className="slot-row">
              {picking.slots.map((slot) => (
                <button
                  key={slot}
                  className="btn-primary"
                  onClick={() => {
                    dispatch({ type: 'ADD_INTENT', eventId: picking.id, slot })
                    setPicking(null)
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="onb-note">Интент живёт до даты события — потом сгорает, лента остаётся живой.</p>
          </div>
        </div>
      )}
    </div>
  )
}
