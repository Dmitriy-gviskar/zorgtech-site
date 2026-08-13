import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const NAV = [
  { to: '/catalog', label: 'Продукция' },
  { to: '/solutions', label: 'Софт' },
  { to: '/projects', label: 'Проекты' },
  { to: '/areas', label: 'Области применения' },
  { to: '/about', label: 'О компании' },
  { to: '/contacts', label: 'Контакты' },
];

const MORE = [
  { to: '/delivery', label: 'Доставка' },
  { to: '/support', label: 'Поддержка' },
  { to: '/rent', label: 'Аренда' },
];

const HOTLINE = { href: 'tel:88005502645', label: '8 800 550 26 45' };

function closeDetails(el) {
  if (el) el.open = false;
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const mobileNavRef = useRef(null);
  const moreNavRef = useRef(null);

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
    closeDetails(mobileNavRef.current);
    closeDetails(moreNavRef.current);
    if (hash) {
      const id = decodeURIComponent(hash.replace(/^#/, ''));
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const onPointerDown = (event) => {
      const more = moreNavRef.current;
      const mobile = mobileNavRef.current;
      if (more?.open && !more.contains(event.target)) closeDetails(more);
      if (mobile?.open && !mobile.contains(event.target)) closeDetails(mobile);
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      closeDetails(moreNavRef.current);
      closeDetails(mobileNavRef.current);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

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
            <details className="nav-more" ref={moreNavRef}>
              <summary>Ещё</summary>
              <div className="nav-more-panel">
                {MORE.map((item) => (
                  <NavLink key={item.to} to={item.to} onClick={() => closeDetails(moreNavRef.current)}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </details>
          </nav>
          <details className="mobile-nav" ref={mobileNavRef}>
            <summary>Меню</summary>
            <div className="mobile-nav-panel">
              <a className="mobile-nav-phone" href={HOTLINE.href} onClick={() => closeDetails(mobileNavRef.current)}>
                {HOTLINE.label}
              </a>
              {[...NAV, ...MORE].map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => closeDetails(mobileNavRef.current)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
          <a className="top-phone" href={HOTLINE.href}>
            {HOTLINE.label}
          </a>
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
            <Link to="/solutions">Софт</Link>
            <Link to="/projects">Проекты</Link>
            <Link to="/areas">Области применения</Link>
            <Link to="/about">О компании</Link>
            <Link to="/delivery">Доставка</Link>
            <Link to="/support">Поддержка</Link>
            <Link to="/rent">Аренда</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/policy">Политика</Link>
          </div>
          <p className="muted">© {new Date().getFullYear()} Zorgtech · демо-копия контента с zorgtech.com</p>
        </div>
      </footer>
    </div>
  );
}
