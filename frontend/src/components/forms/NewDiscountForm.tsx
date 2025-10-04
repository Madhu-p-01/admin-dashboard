import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface NewDiscountFormProps {
  onBack: () => void;
  onSave?: (discount: any) => void;
  onAdd?: (discount: any) => void;
}

export const NewDiscountForm: React.FC<NewDiscountFormProps> = ({ onBack, onSave, onAdd }) => {
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

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.discountCode.trim()) {
      newErrors.discountCode = 'Discount code is required';
    }
    if (!formData.discountValue.trim()) {
      newErrors.discountValue = 'Discount value is required';
    }
    if (formData.discountType === 'Percentage' && (parseFloat(formData.discountValue) < 0 || parseFloat(formData.discountValue) > 100)) {
      newErrors.discountValue = 'Percentage must be between 0 and 100';
    }
    if (formData.discountType === 'Fixed Amount' && parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = 'Fixed amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    onBack();
  };

  const handleSaveDraft = () => {
    if (onSave) {
      onSave(formData);
    }
    onBack();
  };

  const handleAdd = () => {
    if (validateForm()) {
      if (onAdd) {
        onAdd(formData);
      }
      onBack();
    }
  };

  const tooltips = {
    discountCode: 'Unique code that customers will enter to apply the discount. Maximum 100 characters.',
    discountType: 'Choose between percentage discount, fixed amount off, or free shipping.',
    discountValue: 'The amount of discount to apply. For percentage, enter 0-100. For fixed amount, enter the currency value.',
    usageRules: 'Set limits on how many times this discount can be used by individual customers and in total.',
    minimumPurchase: 'Minimum order value required for the discount to be applicable.',
    dateTime: 'Set the start and end dates when this discount will be active.'
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
        <h2 className="text-xl font-semibold text-gray-900">Create New Discount</h2>
      </div>

      {/* Form Fields */}
      <form className="space-y-6">
        {/* Discount Code */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Discount code <span className="text-red-500">*</span>
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip('discountCode')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
                >
                  i
                </button>
                {showTooltip === 'discountCode' && (
                  <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                    {tooltips.discountCode}
                  </div>
                )}
              </div>
            </label>
          </div>
          <input
            type="text"
            value={formData.discountCode}
            onChange={(e) => handleInputChange('discountCode', e.target.value)}
            placeholder="Input your discount code"
            maxLength={100}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.discountCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.discountCode && (
            <p className="text-red-500 text-xs mt-1">{errors.discountCode}</p>
          )}
        </div>

        {/* Discount Type */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Discount type <span className="text-red-500">*</span>
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip('discountType')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
                >
                  i
                </button>
                {showTooltip === 'discountType' && (
                  <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                    {tooltips.discountType}
                  </div>
                )}
              </div>
            </label>
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
            Discount value <span className="text-red-500">*</span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('discountValue')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'discountValue' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.discountValue}
                </div>
              )}
            </div>
          </label>
          <input
            type="text"
            value={formData.discountValue}
            onChange={(e) => handleInputChange('discountValue', e.target.value)}
            placeholder="Value"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.discountValue ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.discountValue && (
            <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>
          )}
        </div>

        {/* Usage Rules */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
            Usage Rules
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('usageRules')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'usageRules' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.usageRules}
                </div>
              )}
            </div>
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
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip('minimumPurchase')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
                >
                  i
                </button>
                {showTooltip === 'minimumPurchase' && (
                  <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                    {tooltips.minimumPurchase}
                  </div>
                )}
              </div>
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
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('dateTime')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'dateTime' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.dateTime}
                </div>
              )}
            </div>
          </label>
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
      </form>

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
          onClick={handleAdd}
          className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Add
        </button>
      </div>
    </div>
  );
};
