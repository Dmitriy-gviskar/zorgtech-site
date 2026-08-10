import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFoundPage() {
  return (
    <div className="page">
      <Seo title="Страница не найдена — Zorgtech" description="Запрошенная страница не найдена." path="/404" />
      <header className="category-head category-head--simple">
        <p className="chapter-kicker">404</p>
        <h1>Страница не найдена</h1>
        <p className="lead">Такого адреса нет — вернитесь в каталог или на главную.</p>
        <div className="actions" style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link className="btn primary" to="/">
            На главную
          </Link>
          <Link className="btn secondary" to="/catalog">
            В каталог
          </Link>
        </div>
      </header>
    </div>
  );
}
