import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import { paths } from './lib/paths.js';
import './App.css';

const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SolutionsPage = lazy(() => import('./pages/SolutionsPage'));
const SolutionDetailPage = lazy(() => import('./pages/SolutionDetailPage'));
const AreasPage = lazy(() => import('./pages/AreasPage'));
const AreaDetailPage = lazy(() => import('./pages/AreaDetailPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const DealersPage = lazy(() => import('./pages/DealersPage'));
const DealerPortalPage = lazy(() => import('./pages/DealerPortalPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function PageFallback() {
  return <div className="page page-fallback" aria-hidden="true" />;
}

function SlashGate({ children }) {
  const { pathname, search, hash } = useLocation();
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return <Navigate to={`${pathname.replace(/\/+$/, '')}${search}${hash}`} replace />;
  }
  return children;
}

function RedirectSlug({ prefix }) {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`${prefix}/${slug}${search}${hash}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename === '/' ? undefined : routerBasename}>
      <Suspense fallback={<PageFallback />}>
        <SlashGate>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path={paths.catalog} element={<CatalogPage />} />
              <Route path="/catalog/product/:slug" element={<ProductPage />} />
              <Route path="/catalog/:slug" element={<CategoryPage />} />
              <Route path={paths.projects} element={<ProjectsPage />} />
              <Route path="/realizovanye-proekty/:slug" element={<ProjectDetailPage />} />
              <Route path={paths.solutions} element={<SolutionsPage />} />
              <Route path="/gotovye-resheniya/:slug" element={<SolutionDetailPage />} />
              <Route path={paths.areas} element={<AreasPage />} />
              <Route path="/oblasti-primeneniya/:slug" element={<AreaDetailPage />} />
              <Route path={paths.about} element={<StaticPage pageKey="about" />} />
              <Route path={paths.contacts} element={<StaticPage pageKey="contacts" />} />
              <Route path={paths.delivery} element={<StaticPage pageKey="delivery" />} />
              <Route path={paths.support} element={<StaticPage pageKey="support" />} />
              <Route path={paths.rent} element={<StaticPage pageKey="rent" />} />
              <Route path={paths.dealers} element={<DealersPage />} />
              <Route path={paths.dealerPortal} element={<DealerPortalPage />} />
              <Route path={paths.policy} element={<StaticPage pageKey="policy" />} />

              <Route path="/product/:slug" element={<RedirectSlug prefix="/catalog/product" />} />
              <Route path="/projects" element={<Navigate to={paths.projects} replace />} />
              <Route path="/projects/:slug" element={<RedirectSlug prefix={paths.projects} />} />
              <Route path="/solutions" element={<Navigate to={paths.solutions} replace />} />
              <Route path="/solutions/:slug" element={<RedirectSlug prefix={paths.solutions} />} />
              <Route path="/areas" element={<Navigate to={paths.areas} replace />} />
              <Route path="/areas/:slug" element={<RedirectSlug prefix={paths.areas} />} />
              <Route path="/delivery" element={<Navigate to={paths.delivery} replace />} />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </SlashGate>
      </Suspense>
    </BrowserRouter>
  );
}
