import { useApp } from '../state/AppContext.jsx'

const TABS = [
  { id: 'afisha', label: 'Афиша', icon: '🗓️' },
  { id: 'intents', label: 'Интенты', icon: '✨' },
  { id: 'chats', label: 'Чаты', icon: '💬' },
  { id: 'profile', label: 'Профиль', icon: '🙂' },
]

export default function TabBar() {
  const { state, dispatch } = useApp()
  const active = state.nav.screen
  const chatCount = state.matches.filter((m) => m.status !== 'done').length

  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'NAV', screen: t.id })}
        >
          <span className="tab-icon">
            {t.icon}
            {t.id === 'chats' && chatCount > 0 && <span className="badge">{chatCount}</span>}
          </span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
