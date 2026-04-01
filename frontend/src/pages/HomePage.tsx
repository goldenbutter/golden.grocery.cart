import { Link } from 'react-router-dom';
import { useT } from '../hooks/useT';

export default function HomePage() {
  const { t } = useT();

  // Feature cards — titles and descriptions come from translation keys
  const features = [
    { icon: '🥬', title: t.home_feature_fresh_title, desc: t.home_feature_fresh_desc },
    { icon: '🚚', title: t.home_feature_delivery_title, desc: t.home_feature_delivery_desc },
    { icon: '💚', title: t.home_feature_organic_title, desc: t.home_feature_organic_desc },
    { icon: '💳', title: t.home_feature_checkout_title, desc: t.home_feature_checkout_desc },
  ];

  // Highlight cards — labels translated, prices stay in kr (same in both languages)
  const highlights = [
    { emoji: '🍓', label: t.home_highlight_berries, price: 'Fra kr 29' },
    { emoji: '🥑', label: t.home_highlight_avocado, price: 'Fra kr 15' },
    { emoji: '🧀', label: t.home_highlight_cheese, price: 'Fra kr 69' },
    { emoji: '🍞', label: t.home_highlight_bread, price: 'Fra kr 69' },
  ];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-800 via-forest-700 to-forest-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="inline-block badge bg-earth-400/20 text-earth-300 border border-earth-400/30 text-sm px-3 py-1">
              {t.home_badge}
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
              {t.home_h1_line1}<br />
              <span className="text-earth-400">{t.home_h1_line2}</span><br />
              {t.home_h1_line3}
            </h1>
            <p className="text-forest-200 text-lg max-w-md leading-relaxed">
              {t.home_sub}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/shop" className="bg-earth-500 hover:bg-earth-600 text-white font-medium px-8 py-3 rounded-xl transition-all active:scale-95 shadow-lg">
                {t.home_cta_shop}
              </Link>
              <Link to="/register" className="border border-white/30 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-xl transition-all">
                {t.home_cta_register}
              </Link>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 max-w-sm">
            {highlights.map(h => (
              <div key={h.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-2">{h.emoji}</div>
                <p className="font-medium text-sm">{h.label}</p>
                <p className="text-earth-300 text-xs">{h.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl font-bold text-forest-800 text-center mb-10">
          {t.home_features_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-display font-semibold text-forest-800 mb-1">{f.title}</h3>
              <p className="text-forest-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-200 py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl font-bold text-forest-800 mb-4">{t.home_cta_title}</h2>
          <p className="text-forest-600 mb-8">{t.home_cta_sub}</p>
          <Link to="/shop" className="btn-primary text-base px-10 py-3">
            {t.home_cta_btn}
          </Link>
        </div>
      </section>
    </div>
  );
}
