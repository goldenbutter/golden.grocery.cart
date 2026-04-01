import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ordersApi } from '../api';
import type { Order } from '../types';
import { useT } from '../hooks/useT';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const successOrderId = searchParams.get('success');
  const { t, lang } = useT();

  // Status badge colours are the same regardless of language
  const statusColors: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Processing: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
  };

  // Map backend status values to translated display labels
  const statusLabels: Record<string, string> = {
    Pending: t.status_pending,
    Processing: t.status_processing,
    Delivered: t.status_delivered,
    Cancelled: t.status_cancelled,
  };

  // Use locale matching the active language for date formatting
  const dateLocale = lang === 'NO' ? 'nb-NO' : 'en-GB';

  useEffect(() => {
    ordersApi.myOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-forest-800 mb-2">{t.orders_title}</h1>
      <p className="text-forest-500 mb-8">{t.orders_sub}</p>

      {successOrderId && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl px-5 py-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold">Order #{successOrderId} {t.orders_placed}</p>
            <p className="text-sm text-green-600">{t.orders_success_sub}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="card h-32 animate-pulse bg-cream-200" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <span className="text-5xl">📦</span>
          <p className="mt-4 text-forest-500 font-medium">{t.orders_empty}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="font-display font-bold text-forest-800 text-lg">Order #{order.id}</p>
                  <p className="text-forest-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${statusColors[order.status] ?? 'bg-gray-100 text-gray-600'} px-3 py-1`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  <span className="font-display font-bold text-xl text-forest-700">kr {order.total.toFixed(0)}</span>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {order.items.slice(0, 5).map(item => (
                  <div key={item.productId} className="flex items-center gap-2 bg-cream-100 rounded-xl px-3 py-2">
                    <img src={item.imageUrl} alt={item.productName} className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-xs text-forest-700">{item.productName} ×{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 5 && (
                  <div className="flex items-center px-3 py-2 bg-cream-100 rounded-xl text-xs text-forest-500">
                    +{order.items.length - 5} {t.orders_more}
                  </div>
                )}
              </div>
              <p className="text-xs text-forest-400 mt-3">📍 {order.deliveryAddress}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
