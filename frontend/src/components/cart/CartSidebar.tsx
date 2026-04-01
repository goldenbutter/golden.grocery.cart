import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useT } from '../../hooks/useT';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { t } = useT();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-overlay fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="cart-panel fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 className="font-display text-xl font-bold text-forest-800">{t.cart_title}</h2>
          <button type="button" aria-label="Close cart" onClick={closeCart} className="p-2 rounded-lg hover:bg-cream-100 transition-colors">
            <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-forest-500 font-medium">{t.cart_empty}</p>
              <p className="text-forest-400 text-sm mt-1">{t.cart_empty_sub}</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-3 items-center">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-forest-800 text-sm truncate">{item.product.name}</p>
                  <p className="text-earth-500 text-sm font-semibold">kr {item.product.price.toFixed(0)} / {item.product.unit}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-cream-200 hover:bg-cream-300 text-forest-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >−</button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-forest-100 hover:bg-forest-200 text-forest-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >+</button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-forest-800 text-sm">kr {(item.product.price * item.quantity).toFixed(0)}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                  >{t.cart_remove}</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 px-6 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-forest-600">{t.cart_subtotal}</span>
              <span className="font-display font-bold text-xl text-forest-800">kr {total().toFixed(0)}</span>
            </div>
            <button type="button" onClick={handleCheckout} className="btn-primary w-full text-center py-3">
              {t.cart_checkout}
            </button>
            <button type="button" onClick={clearCart} className="btn-ghost w-full text-sm text-center text-red-400 hover:text-red-600">
              {t.cart_clear}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
