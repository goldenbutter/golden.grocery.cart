import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, openCart } = useCartStore();

  const handleAdd = () => {
    addItem(product);
    openCart();
  };

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
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge bg-red-100 text-red-600 text-sm">Out of Stock</span>
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

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-display font-bold text-lg text-forest-700">
              kr {product.price.toFixed(0)}
            </span>
            <span className="text-forest-400 text-xs ml-1">/ {product.unit}</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="bg-forest-600 hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-medium px-4 py-2 rounded-xl transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
