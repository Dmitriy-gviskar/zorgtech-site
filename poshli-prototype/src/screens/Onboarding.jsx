import { useState } from 'react'
import { useApp } from '../state/AppContext.jsx'

export default function Onboarding() {
  const { dispatch } = useApp()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [mode, setMode] = useState('dating')

  const ready = name.trim().length > 0 && Number(age) >= 18

  return (
    <div className="onboarding">
      <div className="onb-hero">
        <div className="logo-mark">🎟️</div>
        <h1>Пошли!</h1>
        <p className="tagline">Не свайпай людей — свайпай планы на вечер</p>
      </div>

      <div className="onb-form">
        <label>
          Имя
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как тебя зовут" />
        </label>
        <label>
          Возраст
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
            placeholder="18+"
            inputMode="numeric"
          />
        </label>

        <div className="mode-picker">
          <button className={`mode-card${mode === 'dating' ? ' selected' : ''}`} onClick={() => setMode('dating')}>
            <span className="mode-emoji">💘</span>
            <strong>Дейтинг</strong>
            <span>Знакомства 1-на-1 через общий план</span>
          </button>
          <button className={`mode-card${mode === 'company' ? ' selected' : ''}`} onClick={() => setMode('company')}>
            <span className="mode-emoji">👥</span>
            <strong>Компания</strong>
            <span>Найти, с кем сходить — без романтики</span>
          </button>
        </div>

        <button
          className="btn-primary"
          disabled={!ready}
          onClick={() => dispatch({ type: 'SETUP_USER', user: { name: name.trim(), age: Number(age), mode } })}
        >
          Поехали
        </button>
        <p className="onb-note">Прототип: город — Москва, афиша недели курируется вручную.</p>
      </div>
    </div>
  )
}
