import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface NewDiscountFormProps {
  onBack: () => void;
  onSave?: (discount: any) => void;
}

export const NewDiscountForm: React.FC<NewDiscountFormProps> = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    discountCode: '',
    discountType: 'Percentage',
    discountValue: '',
    limitPerCustomer: '',
    totalUsageLimit: '',
    minimumPurchase: '0',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    onBack();
  };

  const handleSaveDraft = () => {
    console.log('Save draft:', formData);
    // Implement save draft logic
  };

  const handleActivate = () => {
    console.log('Activate:', formData);
    if (onSave) {
      onSave(formData);
    }
    onBack();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          title="Back to discounts"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Name & description</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Discount Code */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Discount code
              <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500">
                i
              </span>
            </label>
            <p className="text-xs text-gray-500">Maximum 100 characters. No HTML or emoji allowed</p>
          </div>
          <input
            type="text"
            value={formData.discountCode}
            onChange={(e) => handleInputChange('discountCode', e.target.value)}
            placeholder="Input your text"
            maxLength={100}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Discount Type */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Discount type
              <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500">
                i
              </span>
            </label>
            <p className="text-xs text-gray-500">Maximum 100 characters. No HTML or emoji allowed</p>
          </div>
          <div className="relative">
            <select
              value={formData.discountType}
              onChange={(e) => handleInputChange('discountType', e.target.value)}
              title="Discount type"
              className="w-full px-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="Percentage">Percentage</option>
              <option value="Fixed Amount">Fixed Amount</option>
              <option value="Free Shipping">Free Shipping</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Discount Value */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Discount value
            <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500">
              i
            </span>
          </label>
          <input
            type="text"
            value={formData.discountValue}
            onChange={(e) => handleInputChange('discountValue', e.target.value)}
            placeholder="Value"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Usage Rules */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            Usage Rules
            <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500">
              i
            </span>
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={formData.limitPerCustomer}
              onChange={(e) => handleInputChange('limitPerCustomer', e.target.value)}
              placeholder="Limit per Customer"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={formData.totalUsageLimit}
              onChange={(e) => handleInputChange('totalUsageLimit', e.target.value)}
              placeholder="Total Usage Limit"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Minimum Purchase Amount */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Minimum purchase amount
              <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500">
                i
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
              <input
                type="text"
                value={formData.minimumPurchase}
                onChange={(e) => handleInputChange('minimumPurchase', e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            Date & Time
            <span className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500">
              i
            </span>
          </label>
          <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg mb-4">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-700">Feb 16,2025 - Feb 20,2025</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                placeholder="mm/dd/yyyy"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveDraft}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Save Draft
        </button>
        <button
          onClick={handleActivate}
          className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Activate
        </button>
      </div>
    </div>
  );
};
