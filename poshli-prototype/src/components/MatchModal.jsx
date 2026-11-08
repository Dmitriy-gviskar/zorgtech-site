import { useApp, matchMembers } from '../state/AppContext.jsx'
import { getCandidate } from '../data/candidates.js'
import { getEvent } from '../data/events.js'
import Avatar from './Avatar.jsx'

export default function MatchModal({ matchId }) {
  const { state, dispatch } = useApp()
  const match = state.matches.find((m) => m.id === matchId)
  if (!match) return null
  const members = matchMembers(match).map(getCandidate)
  const candidate = members[members.length - 1]
  const ev = getEvent(match.chosenEventId || match.myEventId)
  const isGroup = match.kind === 'group'

  return (
    <div className="modal-backdrop">
      <div className="match-modal">
        <div className="match-burst">💥</div>
        <h2>{isGroup ? 'Компания растёт!' : 'Это матч!'}</h2>
        <div className="avatar-stack center">
          {members.slice(-3).map((c) => (
            <Avatar key={c.id} candidate={c} size={members.length > 1 ? 62 : 84} />
          ))}
        </div>
        <p>
          {isGroup ? (
            <>
              <strong>{candidate.name}</strong> в деле! На <strong>{ev.title}</strong> вас уже{' '}
              {members.length + 1}.
            </>
          ) : match.kind === 'exact' ? (
            <>Вы с <strong>{candidate.name}</strong> оба хотите на <strong>{ev.title}</strong></>
          ) : (
            <>Вы с <strong>{candidate.name}</strong> совпали по категории — осталось выбрать, куда именно</>
          )}
        </p>
        <button
          className="btn-primary"
          onClick={() => {
            dispatch({ type: 'DISMISS_CELEBRATION' })
            dispatch({ type: 'NAV', screen: 'chat', params: { matchId: match.id } })
          }}
        >
          Открыть чат
        </button>
        <button className="btn-ghost" onClick={() => dispatch({ type: 'DISMISS_CELEBRATION' })}>
          Позже
        </button>
      </div>
    </div>
  )
}
