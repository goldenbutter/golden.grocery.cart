import { useEffect, useState } from 'react';
import { ordersApi, productsApi, categoriesApi, authApi } from '../api';
import type { AdminOrder, DashboardStats, Product, Category, CustomerUser } from '../types';

const statusOptions = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

type Tab = 'dashboard' | 'products' | 'orders' | 'customers';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [customersError, setCustomersError] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', unit: '', stock: '', imageUrl: '', categoryId: '', isAvailable: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    ordersApi.stats().then(setStats).catch(console.error);
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (tab === 'orders') ordersApi.adminAll().then(setOrders).catch(console.error);
    if (tab === 'products') productsApi.getAdminAll().then(setProducts).catch(console.error);
    if (tab === 'customers') authApi.getCustomers().then(setCustomers).catch(err => setCustomersError(err.message));
  }, [tab]);

  const openNew = () => {
    setEditProduct(null);
    setForm({ name: '', description: '', price: '', unit: '', stock: '', imageUrl: '', categoryId: '', isAvailable: true });
    setShowProductForm(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), unit: p.unit, stock: String(p.stock), imageUrl: p.imageUrl, categoryId: String(p.categoryId), isAvailable: p.isAvailable });
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), categoryId: parseInt(form.categoryId) };
      if (editProduct) await productsApi.update(editProduct.id, payload);
      else await productsApi.create(payload);
      setShowProductForm(false);
      setMsg(editProduct ? 'Product updated.' : 'Product created.');
      productsApi.getAdminAll().then(setProducts);
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await productsApi.delete(id);
    setProducts(ps => ps.filter(p => p.id !== id));
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    await ordersApi.updateStatus(orderId, status);
    setOrders(os => os.map(o => o.id === orderId ? { ...o, status: status as AdminOrder['status'] } : o));
  };

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-forest-800 mb-2">Admin Panel</h1>
      <p className="text-forest-500 mb-8">Manage your GoldenFreshCart store</p>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm flex justify-between">
          {msg} <button onClick={() => setMsg('')} className="text-green-500">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-200 p-1 rounded-2xl w-fit mb-8">
        {(['dashboard', 'products', 'orders', 'customers'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-forest-800 shadow-sm' : 'text-forest-600 hover:text-forest-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Dashboard tab */}
      {tab === 'dashboard' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
            { label: 'Total Products', value: stats.totalProducts, icon: '🥦' },
            { label: 'Customers', value: stats.totalUsers, icon: '👥' },
            { label: 'Revenue', value: `kr ${stats.totalRevenue.toFixed(0)}`, icon: '💰' },
          ].map(s => (
            <div key={s.label} className="card p-6">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className="text-forest-500 text-sm">{s.label}</p>
              <p className="font-display font-bold text-3xl text-forest-800 mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Products tab */}
      {tab === 'products' && (
        <>
          <div className="flex justify-between items-center mb-5">
            <p className="text-forest-500 text-sm">{products.length} products</p>
            <button onClick={openNew} className="btn-primary">+ Add Product</button>
          </div>

          {showProductForm && (
            <div className="card p-6 mb-6">
              <h2 className="font-display text-xl font-semibold text-forest-800 mb-5">
                {editProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">Name</label>
                  <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">Category</label>
                  <select className="input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-forest-700 mb-1">Description</label>
                  <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">Price (kr)</label>
                  <input className="input" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">Unit</label>
                  <input className="input" placeholder="kg, pcs, litre..." value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">Stock</label>
                  <input className="input" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">Image URL</label>
                  <input className="input" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
                {editProduct && (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="avail" checked={form.isAvailable} onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))} />
                    <label htmlFor="avail" className="text-sm font-medium text-forest-700">Available</label>
                  </div>
                )}
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Product'}</button>
                  <button type="button" onClick={() => setShowProductForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-forest-600">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-forest-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-forest-500">{p.categoryName}</td>
                    <td className="px-4 py-3 font-semibold text-forest-700">kr {p.price.toFixed(0)}</td>
                    <td className="px-4 py-3 text-forest-600">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.isAvailable ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-forest-600 hover:text-forest-800 font-medium text-xs">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 font-medium text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Customers tab — lists all registered Customer accounts */}
      {tab === 'customers' && (
        <>
          {customersError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              Failed to load customers: {customersError}
            </div>
          )}
          <p className="text-forest-500 text-sm mb-5">{customers.length} registered customers</p>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-forest-600">
                <tr>
                  {['#', 'Name', 'Email', 'Joined'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3 text-forest-400">{c.id}</td>
                    <td className="px-4 py-3 font-medium text-forest-800">{c.name}</td>
                    <td className="px-4 py-3 text-forest-500">{c.email}</td>
                    <td className="px-4 py-3 text-forest-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Orders tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                <div>
                  <p className="font-display font-bold text-forest-800">Order #{order.id}</p>
                  <p className="text-forest-500 text-sm">{order.customerName} · {order.customerEmail}</p>
                  <p className="text-forest-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-xl text-forest-700">kr {order.total.toFixed(0)}</span>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className={`badge ${statusColors[order.status]} border-0 cursor-pointer text-xs px-3 py-1.5 rounded-full font-medium`}
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-xs text-forest-400 mb-3">📍 {order.deliveryAddress}</p>
              <div className="flex gap-2 flex-wrap">
                {order.items.map(item => (
                  <span key={item.productId} className="text-xs bg-cream-100 text-forest-600 px-3 py-1 rounded-full">
                    {item.productName} ×{item.quantity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
