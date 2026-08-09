import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page">
      <h1>Страница не найдена</h1>
      <Link className="btn" to="/">На главную</Link>
    </div>
  );
}
