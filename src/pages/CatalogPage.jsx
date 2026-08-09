import { Link } from 'react-router-dom';
import { assetUrl, categoryList, getPage } from '../lib/data';

export default function CatalogPage() {
  const page = getPage('catalog');
  const cats = categoryList();

  return (
    <div className="page">
      <p className="eyebrow">Продукция</p>
      <h1>{page?.title || 'Каталог оборудования'}</h1>
      <p className="lead">{page?.lead || 'Линейки сенсорных терминалов, столов и киосков Zorgtech.'}</p>
      <div className="grid cats">
        {cats.map((c) => (
          <Link key={c.slug} to={`/catalog/${c.slug}`} className="card">
            {c.image ? <img src={assetUrl(c.image)} alt="" loading="lazy" /> : null}
            <h3>{c.name}</h3>
            <p>{c.description || `${c.productSlugs?.length || 0} моделей`}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
