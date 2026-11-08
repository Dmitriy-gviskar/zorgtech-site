import { useApp } from './state/AppContext.jsx'
import Onboarding from './screens/Onboarding.jsx'
import Afisha from './screens/Afisha.jsx'
import Intents from './screens/Intents.jsx'
import Candidates from './screens/Candidates.jsx'
import Chats from './screens/Chats.jsx'
import ChatView from './screens/ChatView.jsx'
import Profile from './screens/Profile.jsx'
import TabBar from './components/TabBar.jsx'
import MatchModal from './components/MatchModal.jsx'

export default function App() {
  const { state } = useApp()

  if (!state.user) return <div className="phone"><Onboarding /></div>

  const { screen, params } = state.nav
  const withTabs = ['afisha', 'intents', 'chats', 'profile'].includes(screen)

  return (
    <div className="phone">
      <div className={`screen-area${withTabs ? ' with-tabs' : ''}`}>
        {screen === 'afisha' && <Afisha />}
        {screen === 'intents' && <Intents />}
        {screen === 'candidates' && <Candidates intentId={params.intentId} />}
        {screen === 'chats' && <Chats />}
        {screen === 'chat' && <ChatView matchId={params.matchId} />}
        {screen === 'profile' && <Profile />}
      </div>
      {withTabs && <TabBar />}
      {state.celebration && <MatchModal matchId={state.celebration} />}
      {state.toast && <div className="toast">{state.toast}</div>}
    </div>
  )
}
