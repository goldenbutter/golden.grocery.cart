import { useEffect, useState } from 'react';
import { categoriesApi, productsApi } from '../api';
import type { Category, Product } from '../types';
import ProductCard from '../components/product/ProductCard';
import { useT } from '../hooks/useT';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useT();

  // Fetch categories once on mount — they don't change based on search/filter
  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  // Re-fetch products whenever the selected category or search term changes
  // Both filters are sent to the backend — the API handles the actual filtering
  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ categoryId: selectedCategory, search: search || undefined })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-forest-800 mb-1">{t.shop_title}</h1>
        <p className="text-forest-500">{t.shop_sub}</p>
      </div>

      {/* Search input — filters products by name and description via the backend */}
      <div className="relative mb-6 max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="input pl-10"
          placeholder={t.shop_search_placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter pills — clicking the same category again deselects it (toggles) */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          type="button"
          onClick={() => setSelectedCategory(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedCategory
              ? 'bg-forest-600 text-white shadow-sm'
              : 'bg-white text-forest-600 border border-cream-300 hover:border-forest-400'
          }`}
        >
          {t.shop_all}
        </button>
        {categories.map(cat => (
          <button
            type="button"
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? undefined : cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-forest-600 text-white shadow-sm'
                : 'bg-white text-forest-600 border border-cream-300 hover:border-forest-400'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Products grid — shows skeleton cards while loading, empty state if no results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-cream-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-forest-500 font-medium">{t.shop_no_products}</p>
          {/* Clear filters resets both search and category selection */}
          <button type="button" onClick={() => { setSearch(''); setSelectedCategory(undefined); }} className="btn-ghost mt-2">
            {t.shop_clear_filters}
          </button>
        </div>
      ) : (
        <>
          <p className="text-forest-500 text-sm mb-4">{products.length} {t.shop_product_count}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
