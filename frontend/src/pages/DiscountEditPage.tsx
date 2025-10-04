import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { NewDiscountForm } from '../components/forms/NewDiscountForm';
import { findDiscountById, updateDiscount } from '../data/discounts';

export default function DiscountEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const discount = id ? findDiscountById(id) : undefined;

  if (!discount) {
    return (
      <AdminLayout title="Edit Discount">
        <div className="p-6">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4">Back</button>
          <div className="bg-white border border-red-200 text-red-600 p-6 rounded-lg">Discount not found.</div>
        </div>
      </AdminLayout>
    );
  }

  const handleSave = (formData: any) => {
    updateDiscount(discount.id, {
      code: formData.discountCode,
      description: formData.discountType === 'Free Shipping' ? 'Free shipping' : `${formData.discountValue}${formData.discountType === 'Percentage' ? '%' : formData.discountType === 'Fixed Amount' ? '₹' : ''} off`,
      type: formData.discountType,
      value: formData.discountType === 'Free Shipping' ? undefined : (formData.discountValue ? Number(formData.discountValue) : undefined),
      maxUsage: formData.totalUsageLimit ? parseInt(formData.totalUsageLimit, 10) : discount.maxUsage,
      minPurchase: formData.minimumPurchase ? Number(formData.minimumPurchase) : undefined,
      maxPurchase: formData.maximumPurchase ? Number(formData.maximumPurchase) : undefined,
    });
    navigate(`/discount/${discount.id}`);
  };

  return (
    <AdminLayout title="Edit Discount">
      <div className="p-6">
        <NewDiscountForm
          onBack={() => navigate(`/discount/${discount.id}`)}
          onSave={handleSave}
          initialData={{
            discountCode: discount.code,
            discountType: discount.type || 'Percentage',
            discountValue: discount.type === 'Free Shipping' ? '' : (discount.value != null ? discount.value : ''),
            totalUsageLimit: discount.maxUsage,
            minimumPurchase: discount.minPurchase != null ? discount.minPurchase : '',
            maximumPurchase: discount.maxPurchase != null ? discount.maxPurchase : '',

          }}
        />
      </div>
    </AdminLayout>
  );
}
