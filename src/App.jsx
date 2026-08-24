import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
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

export default function App() {
  return (
    <BrowserRouter basename={routerBasename === '/' ? undefined : routerBasename}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:slug" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/solutions/:slug" element={<SolutionDetailPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/areas/:slug" element={<AreaDetailPage />} />
            <Route path="/about" element={<StaticPage pageKey="about" />} />
            <Route path="/contacts" element={<StaticPage pageKey="contacts" />} />
            <Route path="/delivery" element={<StaticPage pageKey="delivery" />} />
            <Route path="/support" element={<StaticPage pageKey="support" />} />
            <Route path="/rent" element={<StaticPage pageKey="rent" />} />
            <Route path="/dealers" element={<DealersPage />} />
            <Route path="/dealers/portal" element={<DealerPortalPage />} />
            <Route path="/policy" element={<StaticPage pageKey="policy" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
