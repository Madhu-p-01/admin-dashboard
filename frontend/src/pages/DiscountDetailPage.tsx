import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { ToastList, ToastItem } from '../components/ui/Toast';
import { findDiscountById, updateDiscount, deleteDiscount } from '../data/discounts';

export default function DiscountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const discount = id ? findDiscountById(id) : undefined;
  const [status, setStatus] = useState(discount?.status || 'Inactive');
  // Inline edit modal removed; using dedicated edit page
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = (message: string, type: ToastItem['type']='info') => {
    setToasts(prev => {
      if (prev[0]?.message === message) return prev; // de-dupe immediate repeat
      const id = Date.now().toString();
      return [{ id, message, type }, ...prev].slice(0,4);
    });
    setTimeout(() => setToasts(prev => prev.slice(0, prev.length-1)), 3200);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!discount) return;
    updateDiscount(discount.id, { status: newStatus as any });
    setStatus(newStatus as any);
    push(`Status set to ${newStatus}`, 'success');
  };

  const handleDelete = () => {
    if (!discount) return;
    if (deleteDiscount(discount.id)) {
      push('Discount deleted', 'success');
      setTimeout(() => navigate('/discounts'), 400);
    }
  };



  if (!discount) {
    return (
      <AdminLayout title="Discount">
        <div className="p-6">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4">Back</button>
          <div className="bg-white border border-red-200 text-red-600 p-6 rounded-lg">Discount not found.</div>
        </div>
      </AdminLayout>
    );
  }

  const usagePercent = Math.min(100, Math.round((discount.usedBy / discount.maxUsage) * 100));

  return (
    <AdminLayout title="Discount">
      <div className="p-6">
        <button onClick={() => navigate('/discounts')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-medium">Discounts</span>
        </button>

        {/* Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{discount.code}</h1>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : status === 'Inactive' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{status}</span>
              </div>
              <p className="text-gray-700 max-w-2xl text-sm leading-relaxed">{discount.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div>Created: {discount.createdAt}</div>
                {discount.startsAt && <div>Starts: {discount.startsAt}</div>}
                {discount.endsAt && <div>Ends: {discount.endsAt}</div>}
                {discount.type && <div>Type: {discount.type}{discount.value != null && discount.type !== 'Free Shipping' && ` (${discount.value}${discount.type === 'Percentage' ? '%' : ''})`}</div>}
                {discount.minPurchase != null && <div>Min Purchase: ₹{discount.minPurchase}</div>}
                {discount.maxPurchase != null && <div>Max Purchase: ₹{discount.maxPurchase}</div>}
              </div>
            </div>
            <div className="flex items-center gap-3 self-start">
              <button onClick={() => navigate(`/discount/${discount.id}/edit`)} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700">Edit</button>
              <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 text-red-600 hover:bg-red-50">Delete</button>
            </div>
          </div>
        </div>

        {/* Status & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Status</h2>
            <div className="space-y-3">
              {['Active','Inactive','Expired'].map(s => (
                <label key={s} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                  <span className="font-medium text-gray-700">{s}</span>
                  <input type="radio" name="discount-status" checked={status===s} onChange={() => handleStatusChange(s)} className="text-blue-600 focus:ring-blue-500" />
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 lg:col-span-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Usage</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Used by</span>
              <span className="font-semibold text-gray-900">{discount.usedBy} / {discount.maxUsage}</span>
            </div>
            {(() => {
              const step = Math.min(100, Math.max(0, Math.round(usagePercent / 5) * 5));
              const widthClass = {
                0:'w-0',5:'w-1/20',10:'w-1/10',15:'w-[15%]',20:'w-1/5',25:'w-1/4',30:'w-[30%]',35:'w-[35%]',40:'w-2/5',45:'w-[45%]',50:'w-1/2',55:'w-[55%]',60:'w-3/5',65:'w-[65%]',70:'w-7/10',75:'w-3/4',80:'w-4/5',85:'w-[85%]',90:'w-9/10',95:'w-[95%]',100:'w-full'
              } as Record<number,string>;
              return (
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <div aria-label={`Usage ${usagePercent}%`} className={`h-3 bg-blue-600 transition-all ${widthClass[step] || 'w-0'}`} />
                </div>
              );
            })()}
            <p className="text-xs text-gray-500">{usagePercent}% capacity utilized</p>
          </div>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Configuration</h2>
            <div className="text-sm space-y-3">
              <div className="flex justify-between"><span className="text-gray-600">Code</span><span className="font-medium text-gray-900">{discount.code}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Type</span><span className="font-medium text-gray-900">{discount.type || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Value</span><span className="font-medium text-gray-900">{discount.type === 'Free Shipping' ? '—' : discount.value != null ? (discount.type === 'Percentage' ? discount.value + '%' : '₹' + discount.value) : '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Min Purchase</span><span className="font-medium text-gray-900">{discount.minPurchase != null ? '₹'+discount.minPurchase : '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Max Purchase</span><span className="font-medium text-gray-900">{discount.maxPurchase != null ? '₹'+discount.maxPurchase : '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Max Usage Limit</span><span className="font-medium text-gray-900">{discount.maxUsage}</span></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Insights</h2>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              <li>Redemption rate: {usagePercent}%</li>
              <li>Remaining quota: {discount.maxUsage - discount.usedBy}</li>
              <li>Status: {status}</li>
              {discount.type === 'Free Shipping' && <li>Encourages higher cart conversions by removing shipping barrier.</li>}
            </ul>
          </div>
        </div>

        <ToastList toasts={toasts} onDismiss={id => setToasts(prev => prev.filter(t => t.id !== id))} />

        {/* Inline edit modal removed; edit now on separate page */}

        {/* Delete Confirm */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Discount</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <span className="font-medium">{discount.code}</span>? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
