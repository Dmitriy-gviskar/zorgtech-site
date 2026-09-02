import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { Suspense, useEffect, useRef, useState } from 'react';
import LeadApplyButton from './LeadApplyButton';
import { paths } from '../lib/paths.js';

function PageFallback() {
  return <div className="page page-fallback" aria-hidden="true" />;
}

const NAV = [
  { to: paths.catalog, label: 'Продукция' },
  { to: paths.solutions, label: 'Софт' },
  { to: paths.projects, label: 'Проекты' },
  { to: paths.areas, label: 'Области применения' },
  { to: paths.about, label: 'О компании' },
  { to: paths.dealers, label: 'Дилерам' },
  { to: paths.support, label: 'Сервисный центр' },
  { to: paths.contacts, label: 'Контакты' },
];

const MORE = [
  { to: paths.delivery, label: 'Доставка' },
  { to: paths.support, label: 'Поддержка' },
  { to: paths.rent, label: 'Аренда' },
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
          <LeadApplyButton className="btn primary top-cta" source="шапка сайта">Связаться</LeadApplyButton>
        </div>
      </header>
      <main className="main">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="foot">
        <div className="foot-inner">
          <div>
            <strong className="logo foot-logo">ZORGTECH</strong>
            <p>Российский производитель интерактивного оборудования. Полный цикл — от идеи до установки.</p>
          </div>
          <div className="foot-links">
            <Link to={paths.catalog}>Каталог</Link>
            <Link to={paths.solutions}>Софт</Link>
            <Link to={paths.projects}>Проекты</Link>
            <Link to={paths.areas}>Области применения</Link>
            <Link to={paths.about}>О компании</Link>
            <Link to={paths.dealers}>Дилерам</Link>
            <Link to={paths.delivery}>Доставка</Link>
            <Link to={paths.support}>Поддержка</Link>
            <Link to={paths.rent}>Аренда</Link>
            <Link to={paths.contacts}>Контакты</Link>
            <Link to={paths.policy}>Политика</Link>
          </div>
          <p className="muted">© {new Date().getFullYear()} Zorgtech · демо-копия контента с zorgtech.com</p>
        </div>
      </footer>
    </div>
  );
}
