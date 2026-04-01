import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { count, openCart } = useCartStore();
  const navigate = useNavigate();

  // Clear auth state and redirect to home on logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    // Sticky top navbar — z-40 keeps it below the CartSidebar overlay (z-50)
    <header className="bg-white border-b border-cream-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🛒</span>
            <span className="font-display font-bold text-xl text-forest-700 group-hover:text-forest-600 transition-colors">
              GoldenFreshCart
            </span>
          </Link>

          {/* Nav links — hidden on mobile (md:flex) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/shop" className="btn-ghost text-sm">Shop</Link>

            {/* Admin link only shown to users with Admin role */}
            {user?.role === 'Admin' && (
              <Link to="/admin" className="btn-ghost text-sm">Admin</Link>
            )}

            {/* Orders link only shown when logged in */}
            {user && (
              <Link to="/orders" className="btn-ghost text-sm">My Orders</Link>
            )}
          </nav>

          {/* Right side: cart button + auth actions */}
          <div className="flex items-center gap-3">
            {/* Cart icon with item count badge */}
            {/* id used by ProductCard to find this element's position for the fly-to-cart animation */}
            <button
              id="cart-icon-btn"
              type="button"
              onClick={openCart}
              className="relative p-2 rounded-xl hover:bg-cream-100 transition-colors"
            >
              <svg className="w-6 h-6 text-forest-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Badge only shown when cart has items */}
              {count() > 0 && (
                <span className="absolute -top-1 -right-1 bg-earth-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {count()}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {/* User name hidden on small screens */}
                <span className="hidden sm:block text-sm text-forest-600 font-medium">{user.name}</span>
                <button type="button" onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
