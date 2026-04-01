import { useRef, useState } from 'react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useT } from '../../hooks/useT';

interface Props {
  product: Product;
}

// Launches a small dot that flies from the Add button to the cart icon in the navbar.
// Uses native DOM + CSS transitions — no animation library needed.
function flyToCart(fromEl: HTMLElement) {
  const cartBtn = document.getElementById('cart-icon-btn');
  if (!cartBtn) return;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = cartBtn.getBoundingClientRect();

  // Starting position: center of the Add button
  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;

  // Ending position: center of the cart icon button
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;

  // Create a small green circle fixed at the start position
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #3d6b45;
    left: ${startX - 6}px;
    top: ${startY - 6}px;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.55s ease;
    opacity: 1;
  `;
  document.body.appendChild(dot);

  // Trigger the transition on next frame so the browser registers the start state first
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.4)`;
    dot.style.opacity = '0';
  });

  // Remove the dot from the DOM after the animation completes
  dot.addEventListener('transitionend', () => dot.remove(), { once: true });
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();
  const { t } = useT();

  // Local quantity state — resets to 1 after each add
  const [qty, setQty] = useState(1);

  // Ref on the Add button so we can read its screen position for the animation
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const handleAdd = () => {
    // Add product with the chosen quantity — sidebar does NOT open automatically
    addItem(product, qty);

    // Trigger the fly-to-cart dot animation
    if (addBtnRef.current) flyToCart(addBtnRef.current);

    // Reset quantity back to 1 after adding
    setQty(1);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="card group flex flex-col overflow-hidden">
      <div className="relative overflow-hidden h-44">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 badge bg-amber-100 text-amber-700">
            {t.card_only_left} {product.stock} {t.card_left}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-red-100 text-red-600 text-sm">{t.card_out_of_stock}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-forest-400 font-medium uppercase tracking-wide mb-1">
          {product.categoryName}
        </p>
        <h3 className="font-display font-semibold text-forest-800 leading-tight mb-1 flex-1">
          {product.name}
        </h3>
        <p className="text-forest-500 text-xs mb-3 line-clamp-2">{product.description}</p>

        {/* Price row */}
        <div className="mb-3">
          <span className="font-display font-bold text-lg text-forest-700">
            kr {product.price.toFixed(0)}
          </span>
          <span className="text-forest-400 text-xs ml-1">/ {product.unit}</span>
        </div>

        {/* Quantity stepper + Add button row — hidden when out of stock */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between gap-2 mt-auto">
            {/* Quantity stepper: − qty + */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label={t.card_decrease_qty}
                className="w-7 h-7 rounded-lg border border-forest-200 text-forest-600 font-bold
                           flex items-center justify-center hover:bg-cream-100 transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-medium text-forest-700">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                aria-label={t.card_increase_qty}
                className="w-7 h-7 rounded-lg border border-forest-200 text-forest-600 font-bold
                           flex items-center justify-center hover:bg-cream-100 transition-colors
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {/* Add button — triggers fly animation, does NOT open cart sidebar */}
            <button
              ref={addBtnRef}
              type="button"
              onClick={handleAdd}
              className="bg-forest-600 hover:bg-forest-700 text-white text-sm font-medium
                         px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              {t.card_add}
            </button>
          </div>
        )}

        {/* Disabled Add button when out of stock */}
        {isOutOfStock && (
          <button
            type="button"
            disabled
            className="mt-auto bg-forest-600 opacity-40 cursor-not-allowed
                       text-white text-sm font-medium px-4 py-2 rounded-xl"
          >
            {t.card_add}
          </button>
        )}
      </div>
    </div>
  );
}
