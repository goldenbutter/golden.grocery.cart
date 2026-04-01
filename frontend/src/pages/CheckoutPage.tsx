import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ordersApi } from '../api';
import { useT } from '../hooks/useT';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useT();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 py-24 text-center">
        <span className="text-5xl">🛒</span>
        <h2 className="font-display text-2xl font-bold text-forest-800 mt-4">{t.checkout_empty_title}</h2>
        <button type="button" onClick={() => navigate('/shop')} className="btn-primary mt-6">{t.checkout_back_to_shop}</button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) { setError('Please enter your delivery address.'); return; }
    setLoading(true);
    setError('');
    try {
      const cartItems = items.map(i => ({ productId: i.product.id, quantity: i.quantity }));
      const result = await ordersApi.place(cartItems, address);
      clearCart();
      navigate(`/orders?success=${result.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-forest-800 mb-8">{t.checkout_title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery form */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-forest-800 mb-5">{t.checkout_delivery_title}</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>
          )}
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">{t.checkout_delivery_label}</label>
              <textarea
                className="input resize-none h-28"
                placeholder={t.checkout_delivery_placeholder}
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? t.checkout_placing : `${t.checkout_place_order} — kr ${total().toFixed(0)}`}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-forest-800 mb-5">{t.checkout_summary_title}</h2>
          <div className="space-y-3 mb-5">
            {items.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forest-800 truncate">{item.product.name}</p>
                  <p className="text-xs text-forest-500">×{item.quantity} @ kr {item.product.price.toFixed(0)}</p>
                </div>
                <p className="text-sm font-semibold text-forest-700">kr {(item.product.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-forest-700">{t.checkout_total}</span>
              <span className="font-display font-bold text-2xl text-forest-800">kr {total().toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
