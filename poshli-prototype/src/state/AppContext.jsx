import { createContext, useContext, useEffect, useReducer } from 'react'
import { getEvent } from '../data/events.js'
import { CANDIDATES, getCandidate } from '../data/candidates.js'

const AppContext = createContext(null)
const STORAGE_KEY = 'poshli-proto-v1'

const initialState = {
  user: null, // { name, age, mode: 'dating' | 'company' }
  intents: [], // { id, eventId, slot }
  swipes: {}, // `${intentId}:${candidateId}` -> 'liked' | 'skipped'
  matches: [], // см. createMatch
  visits: [], // { eventId, candidateId, dateLabel }
  nav: { screen: 'afisha', params: {} },
  toast: null,
  celebration: null, // matchId — показать модалку «Это матч!»
}

let uid = () => Math.random().toString(36).slice(2, 9)

function createMatch(intent, candidate, kind, theirIntent) {
  return {
    id: uid(),
    intentId: intent.id,
    candidateId: candidate.id,
    kind, // 'exact' | 'soft'
    myEventId: intent.eventId,
    theirEventId: theirIntent.eventId,
    chosenEventId: kind === 'exact' ? intent.eventId : null,
    slot: kind === 'exact' ? intent.slot : null,
    status: 'chat', // chat -> confirmed -> done
    theyConfirmed: false,
    messages: [
      { from: 'them', text: candidate.greeting, t: Date.now() },
    ],
  }
}

const GROUP_LIMIT = 5 // + сам пользователь = до 6 человек, как в плане

function createGroupMatch(intent, candidate) {
  return {
    id: uid(),
    intentId: intent.id,
    kind: 'group',
    candidateIds: [candidate.id],
    myEventId: intent.eventId,
    theirEventId: intent.eventId,
    chosenEventId: intent.eventId,
    slot: intent.slot,
    status: 'chat',
    theyConfirmed: false,
    messages: [{ from: 'them', authorId: candidate.id, text: candidate.greeting, t: Date.now() }],
  }
}

// Участники матча: для группы — массив, для 1-на-1 — один кандидат
export const matchMembers = (m) => m.candidateIds || [m.candidateId]

function reducer(state, action) {
  switch (action.type) {
    case 'SETUP_USER':
      return { ...state, user: action.user, nav: { screen: 'afisha', params: {} } }

    case 'SET_MODE':
      return { ...state, user: { ...state.user, mode: action.mode } }

    case 'NAV':
      return { ...state, nav: { screen: action.screen, params: action.params || {} } }

    case 'ADD_INTENT': {
      const exists = state.intents.some((i) => i.eventId === action.eventId)
      if (exists) return { ...state, toast: 'Интент на это событие уже есть' }
      const intent = { id: uid(), eventId: action.eventId, slot: action.slot }
      return {
        ...state,
        intents: [intent, ...state.intents],
        toast: 'Интент создан — смотрим, кто совпал',
        nav: { screen: 'candidates', params: { intentId: intent.id } },
      }
    }

    case 'REMOVE_INTENT':
      return {
        ...state,
        intents: state.intents.filter((i) => i.id !== action.intentId),
        matches: state.matches.filter((m) => m.intentId !== action.intentId || m.status !== 'chat'),
      }

    case 'SWIPE': {
      const { intentId, candidateId, dir } = action
      const swipes = { ...state.swipes, [`${intentId}:${candidateId}`]: dir }
      if (dir !== 'liked') return { ...state, swipes }

      const intent = state.intents.find((i) => i.id === intentId)
      const candidate = getCandidate(candidateId)
      if (!candidate.likedYou) {
        return { ...state, swipes, toast: `Лайк отправлен. Если ${candidate.name} ответит взаимно — будет матч` }
      }

      // Режим «Компания»: собираем группу на один интент вместо пар
      if (state.user.mode === 'company') {
        const existing = state.matches.find(
          (m) => m.kind === 'group' && m.intentId === intentId && m.status !== 'done'
        )
        if (existing) {
          if (matchMembers(existing).length >= GROUP_LIMIT) {
            return { ...state, swipes, toast: 'Компания уже собрана (максимум 6 человек)' }
          }
          const matches = state.matches.map((m) =>
            m.id === existing.id
              ? {
                  ...m,
                  candidateIds: [...m.candidateIds, candidateId],
                  status: 'chat',
                  theyConfirmed: false,
                  messages: [
                    ...m.messages,
                    { from: 'system', text: `${candidate.name} присоединяется к компании`, t: Date.now() },
                    { from: 'them', authorId: candidateId, text: candidate.greeting, t: Date.now() + 1 },
                  ],
                }
              : m
          )
          return { ...state, swipes, matches, celebration: existing.id }
        }
        const group = createGroupMatch(intent, candidate)
        return { ...state, swipes, matches: [group, ...state.matches], celebration: group.id }
      }

      const myEvent = getEvent(intent.eventId)
      const theirIntent =
        candidate.intents.find((ci) => ci.eventId === intent.eventId) ||
        candidate.intents.find((ci) => getEvent(ci.eventId).category === myEvent.category)
      const kind = theirIntent.eventId === intent.eventId ? 'exact' : 'soft'
      const match = createMatch(intent, candidate, kind, theirIntent)
      return {
        ...state,
        swipes,
        matches: [match, ...state.matches],
        celebration: match.id,
      }
    }

    case 'DISMISS_CELEBRATION':
      return { ...state, celebration: null }

    case 'CHOOSE_EVENT': {
      // soft-матч: договорились, куда идём
      const matches = state.matches.map((m) => {
        if (m.id !== action.matchId) return m
        const ev = getEvent(action.eventId)
        return {
          ...m,
          chosenEventId: action.eventId,
          slot: ev.slots[0],
          messages: [
            ...m.messages,
            { from: 'me', text: `Предлагаю: ${ev.title}, ${ev.dateLabel} в ${ev.slots[0]}`, t: Date.now() },
            { from: 'them', text: 'Договорились, мне подходит! 👌', t: Date.now() + 1 },
          ],
        }
      })
      return { ...state, matches }
    }

    case 'SEND_MESSAGE': {
      const matches = state.matches.map((m) =>
        m.id === action.matchId
          ? { ...m, messages: [...m.messages, { from: 'me', text: action.text, t: Date.now() }] }
          : m
      )
      return { ...state, matches }
    }

    case 'THEM_MESSAGE': {
      const matches = state.matches.map((m) =>
        m.id === action.matchId
          ? { ...m, messages: [...m.messages, { from: 'them', authorId: action.authorId, text: action.text, t: Date.now() }] }
          : m
      )
      return { ...state, matches }
    }

    case 'CONFIRM': {
      const matches = state.matches.map((m) => {
        if (m.id !== action.matchId) return m
        const names = matchMembers(m).map((id) => getCandidate(id).name).join(', ')
        return {
          ...m,
          status: 'confirmed',
          theyConfirmed: true,
          messages: [
            ...m.messages,
            { from: 'system', text: 'Вы подтвердили участие', t: Date.now() },
            { from: 'system', text: `${names} подтвердил(и) участие ✅`, t: Date.now() + 1 },
          ],
        }
      })
      return { ...state, matches, toast: 'План подтверждён всеми участниками' }
    }

    case 'CHECKIN': {
      const match = state.matches.find((m) => m.id === action.matchId)
      const ev = getEvent(match.chosenEventId)
      const matches = state.matches.map((m) =>
        m.id === action.matchId
          ? {
              ...m,
              status: 'done',
              messages: [
                ...m.messages,
                { from: 'system', text: `Чек-ин в «${ev.title}» — встреча состоялась 🎉`, t: Date.now() },
              ],
            }
          : m
      )
      return {
        ...state,
        matches,
        visits: [
          { eventId: match.chosenEventId, candidateIds: matchMembers(match), dateLabel: ev.dateLabel },
          ...state.visits,
        ],
        intents: state.intents.filter((i) => i.id !== match.intentId),
        toast: 'Встреча засчитана: +1 к репутации «пришёл»',
      }
    }

    case 'TOAST':
      return { ...state, toast: action.text }
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw)
    return { ...initialState, ...saved, toast: null, celebration: null }
  } catch {
    return initialState
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    const { toast: _toast, celebration: _celebration, ...persisted } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }, [state])

  useEffect(() => {
    if (!state.toast) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600)
    return () => clearTimeout(t)
  }, [state.toast])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)

// ---- селекторы матчинга ----

// Кандидаты по интенту: точные (то же событие) и soft (та же категория, другое событие)
export function candidatesForIntent(intent, swipes) {
  const myEvent = getEvent(intent.eventId)
  const results = []
  for (const c of CANDIDATES) {
    if (swipes[`${intent.id}:${c.id}`]) continue
    const exact = c.intents.find((ci) => ci.eventId === intent.eventId)
    if (exact) {
      results.push({ candidate: c, kind: 'exact', theirIntent: exact })
      continue
    }
    const soft = c.intents.find(
      (ci) => ci.eventId !== intent.eventId && getEvent(ci.eventId).category === myEvent.category
    )
    if (soft) results.push({ candidate: c, kind: 'soft', theirIntent: soft })
  }
  // точные совпадения — первыми
  return results.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'exact' ? -1 : 1))
}

export function reliability(rep) {
  const total = rep.visited + rep.flaked
  return total === 0 ? 100 : Math.round((rep.visited / total) * 100)
}
