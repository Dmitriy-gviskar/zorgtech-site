import { useEffect, useRef, useState } from 'react'
import { useApp, matchMembers } from '../state/AppContext.jsx'
import { getCandidate } from '../data/candidates.js'
import { getEvent } from '../data/events.js'
import Avatar from '../components/Avatar.jsx'

const AUTO_REPLIES = [
  'Ага, отлично!',
  'Договорились 🙂',
  'Да, я тоже об этом подумал(а)!',
  'Супер, значит до встречи!',
]

export default function ChatView({ matchId }) {
  const { state, dispatch } = useApp()
  const [text, setText] = useState('')
  const [showQR, setShowQR] = useState(false)
  const bottomRef = useRef(null)
  const replyTimer = useRef(null)

  const match = state.matches.find((m) => m.id === matchId)
  const members = match ? matchMembers(match).map(getCandidate) : []
  const candidate = members[0]
  const isGroup = match?.kind === 'group'
  const msgCount = match?.messages.length

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgCount])

  useEffect(() => () => clearTimeout(replyTimer.current), [])

  if (!match) return null

  const chosen = match.chosenEventId ? getEvent(match.chosenEventId) : null
  const myEvent = getEvent(match.myEventId)
  const theirEvent = getEvent(match.theirEventId)

  const send = () => {
    const t = text.trim()
    if (!t) return
    dispatch({ type: 'SEND_MESSAGE', matchId, text: t })
    setText('')
    clearTimeout(replyTimer.current)
    const replier = members[Math.floor(Math.random() * members.length)]
    replyTimer.current = setTimeout(() => {
      dispatch({
        type: 'THEM_MESSAGE',
        matchId,
        authorId: replier.id,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
      })
    }, 1200)
  }

  return (
    <div className="chat-view">
      <header className="chat-head">
        <button className="btn-back" onClick={() => dispatch({ type: 'NAV', screen: 'chats' })}>←</button>
        <div className="avatar-stack">
          {members.slice(0, 3).map((c) => (
            <Avatar key={c.id} candidate={c} size={38} />
          ))}
        </div>
        <div className="min-w-0">
          <strong className="ellipsis">
            {isGroup ? `Компания · ${members.length + 1} чел.` : candidate.name}
          </strong>
          <p className="muted small-text ellipsis">
            {isGroup
              ? members.map((c) => c.name).join(', ') + ' и ты'
              : `приходит без сливов · ${candidate.rep.visited} встреч`}
          </p>
        </div>
      </header>

      {/* Закреплённая карточка плана */}
      <div className="plan-card">
        {!chosen ? (
          <>
            <p className="plan-title">≈ Почти совпали — куда идём?</p>
            <div className="plan-options">
              {[myEvent, theirEvent].map((ev) => (
                <button key={ev.id} className="plan-option" onClick={() => dispatch({ type: 'CHOOSE_EVENT', matchId, eventId: ev.id })}>
                  <strong>{ev.title}</strong>
                  <span className="muted">{ev.dateLabel} · {ev.slots[0]} · {ev.price}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="plan-title">🎯 План</p>
            <p><strong>{chosen.title}</strong></p>
            <p className="muted">{chosen.venue} · {chosen.dateLabel} в {match.slot || chosen.slots[0]}</p>
            {chosen.partner && match.status !== 'done' && (
              <p className="promo">Партнёрское место: бонус по промокоду <strong>{chosen.promo}</strong></p>
            )}
            <div className="plan-actions">
              {match.status === 'chat' && (
                <button className="btn-primary small" onClick={() => dispatch({ type: 'CONFIRM', matchId })}>
                  Подтвердить участие
                </button>
              )}
              {match.status === 'confirmed' && (
                <button className="btn-primary small" onClick={() => setShowQR(true)}>
                  Чек-ин на месте (QR)
                </button>
              )}
              {match.status === 'done' && <span className="status-pill done">Встреча состоялась 🎉</span>}
            </div>
          </>
        )}
      </div>

      <div className="messages">
        {match.messages.map((m, i) =>
          m.from === 'system' ? (
            <div key={i} className="msg-system">{m.text}</div>
          ) : (
            <div key={i} className={`msg ${m.from === 'me' ? 'mine' : 'theirs'}`}>
              {isGroup && m.from === 'them' && m.authorId && (
                <span className="msg-author">{getCandidate(m.authorId).name}</span>
              )}
              {m.text}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div className="composer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Сообщение…"
        />
        <button className="btn-primary small" onClick={send}>→</button>
      </div>

      {showQR && (
        <div className="sheet-backdrop" onClick={() => setShowQR(false)}>
          <div className="sheet qr-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>Чек-ин</h3>
            <p className="muted">Покажите QR на входе — заведение отметит визит, а вам зачтётся репутация «пришёл».</p>
            <div className="qr-mock">
              {Array.from({ length: 64 }, (_, i) => (
                <span key={i} className={((i * 7 + 3) % 5) < 2 ? 'q on' : 'q'} />
              ))}
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setShowQR(false)
                dispatch({ type: 'CHECKIN', matchId })
              }}
            >
              Мы на месте — отметить встречу
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
