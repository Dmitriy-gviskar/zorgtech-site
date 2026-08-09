import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function HomePage() {
  return (
    <main className="shell">
      <h1>Zorgtech</h1>
      <p>Новый репозиторий. Контент с zorgtech.com — следующий шаг.</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
