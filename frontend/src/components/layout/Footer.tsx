export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-display font-bold text-xl text-cream-100">GoldenFreshCart</span>
          </div>
          <p className="text-cream-300 text-sm">Fresh groceries delivered to your door.</p>
          <p className="text-cream-300 text-sm">
            © {new Date().getFullYear()} <span className="text-earth-400 font-medium">Bithun</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
