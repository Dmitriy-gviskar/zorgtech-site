/** Live zorgtech.com paths. Keep in sync with Bitrix CHPU. */

export const paths = {
  home: '/',
  catalog: '/catalog',
  category: (slug) => `/catalog/${slug}`,
  product: (slug) => `/catalog/product/${slug}`,
  projects: '/realizovanye-proekty',
  project: (slug) => `/realizovanye-proekty/${slug}`,
  solutions: '/gotovye-resheniya',
  solution: (slug) => `/gotovye-resheniya/${slug}`,
  areas: '/oblasti-primeneniya',
  area: (slug) => `/oblasti-primeneniya/${slug}`,
  about: '/about',
  contacts: '/contacts',
  delivery: '/dostavka-i-servis',
  support: '/support',
  rent: '/rent',
  policy: '/policy',
  dealers: '/dealers',
  dealerPortal: '/dealers/portal',
};

const PAGE_KEYS = {
  about: paths.about,
  contacts: paths.contacts,
  delivery: paths.delivery,
  support: paths.support,
  rent: paths.rent,
  policy: paths.policy,
};

export function pagePath(pageKey) {
  return PAGE_KEYS[pageKey] || `/${pageKey}`;
}
