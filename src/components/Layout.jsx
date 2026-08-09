import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const NAV = [
  { to: '/catalog', label: 'Продукция' },
  { to: '/solutions', label: 'Решения' },
  { to: '/projects', label: 'Проекты' },
  { to: '/areas', label: 'Области' },
  { to: '/about', label: 'О компании' },
  { to: '/contacts', label: 'Контакты' },
];

const MORE = [
  { to: '/delivery', label: 'Доставка' },
  { to: '/support', label: 'Поддержка' },
  { to: '/rent', label: 'Аренда' },
];

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return undefined;
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    if (mobileNavRef.current) mobileNavRef.current.open = false;
  }, [pathname]);

  return (
    <div className={`site${isHome ? ' site--home' : ''}${scrolled ? ' site--scrolled' : ''}`}>
      <header className="top">
        <div className="top-inner">
          <Link to="/" className="logo">
            ZORGTECH
          </Link>
          <nav className="nav" aria-label="Основное меню">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {item.label}
              </NavLink>
            ))}
            <details className="nav-more">
              <summary>Ещё</summary>
              <div className="nav-more-panel">
                {MORE.map((item) => (
                  <NavLink key={item.to} to={item.to}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </details>
          </nav>
          <details className="mobile-nav" ref={mobileNavRef}>
            <summary>Меню</summary>
            <div className="mobile-nav-panel">
              {[...NAV, ...MORE].map((item) => (
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
          <Link className="btn primary top-cta" to="/contacts">Связаться</Link>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="foot">
        <div className="foot-inner">
          <div>
            <strong className="logo foot-logo">ZORGTECH</strong>
            <p>Российский производитель интерактивного оборудования. Полный цикл — от идеи до установки.</p>
          </div>
          <div className="foot-links">
            <Link to="/catalog">Каталог</Link>
            <Link to="/projects">Проекты</Link>
            <Link to="/solutions">Решения</Link>
            <Link to="/about">О компании</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/policy">Политика</Link>
          </div>
          <p className="muted">© {new Date().getFullYear()} Zorgtech · демо-копия контента с zorgtech.com</p>
        </div>
      </footer>
    </div>
  );
}
