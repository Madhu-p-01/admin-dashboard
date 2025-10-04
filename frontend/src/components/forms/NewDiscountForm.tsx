import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface NewDiscountFormProps {
  onBack: () => void;
  onSave?: (discount: any) => void; // used for editing
  onAdd?: (discount: any) => void;  // used for creation
  initialData?: Partial<{
    discountCode: string;
    discountType: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
    discountValue: string | number;
    limitPerCustomer: string | number;
    totalUsageLimit: string | number;
    minimumPurchase: string | number;
    maximumPurchase: string | number;
    startDate: string;
    endDate: string;
  }>;
}

export const NewDiscountForm: React.FC<NewDiscountFormProps> = ({ onBack, onSave, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    discountCode: initialData?.discountCode || '',
    discountType: initialData?.discountType || 'Percentage',
    discountValue: initialData?.discountValue !== undefined ? String(initialData.discountValue) : '',
    limitPerCustomer: initialData?.limitPerCustomer !== undefined ? String(initialData.limitPerCustomer) : '',
    totalUsageLimit: initialData?.totalUsageLimit !== undefined ? String(initialData.totalUsageLimit) : '',
    minimumPurchase: initialData?.minimumPurchase !== undefined ? String(initialData.minimumPurchase) : '0',
    maximumPurchase: initialData?.maximumPurchase !== undefined ? String(initialData.maximumPurchase) : '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || ''
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Apply validation based on field type
    if (field === 'discountValue') {
      // Only allow numbers and decimals for discount value
      const numericValue = value.replace(/[^\d.]/g, '');
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      let formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      // Clamp percentage to 100 when discount type is Percentage
      if (formData.discountType === 'Percentage') {
        const num = parseFloat(formattedValue);
        if (!isNaN(num) && num > 100) {
          formattedValue = '100';
        }
      }
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'limitPerCustomer' || field === 'totalUsageLimit') {
      // Only allow whole numbers for usage limits
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else if (field === 'minimumPurchase') {
      // Only allow numbers and decimals for minimum purchase
      const numericValue = value.replace(/[^\d.]/g, '');
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'maximumPurchase') {
      // Only allow numbers and decimals for maximum purchase
      const numericValue = value.replace(/[^\d.]/g, '');
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'discountCode') {
      // Convert to uppercase and remove spaces
      const codeValue = value.toUpperCase().replace(/\s/g, '');
      setFormData(prev => ({ ...prev, [field]: codeValue }));
    } else if (field === 'discountType') {
      // When switching to Free Shipping, clear discount value & errors
      if (value === 'Free Shipping') {
        setFormData(prev => ({ ...prev, discountType: value as 'Free Shipping', discountValue: '' }));
        setErrors(prev => ({ ...prev, discountValue: '' }));
      } else {
        setFormData(prev => ({ ...prev, discountType: value as 'Percentage' | 'Fixed Amount' }));
      }
    } else if (field === 'startDate' || field === 'endDate') {
      // Format date input as mm/dd/yyyy
      let dateValue = value.replace(/\D/g, '');
      if (dateValue.length >= 2) {
        dateValue = dateValue.slice(0, 2) + '/' + dateValue.slice(2);
      }
      if (dateValue.length >= 5) {
        dateValue = dateValue.slice(0, 5) + '/' + dateValue.slice(5, 9);
      }
      setFormData(prev => ({ ...prev, [field]: dateValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Discount code validation
    if (!formData.discountCode.trim()) {
      newErrors.discountCode = 'Discount code is required';
    } else if (formData.discountCode.length < 3) {
      newErrors.discountCode = 'Discount code must be at least 3 characters';
    }

    // Discount value validation (only if not Free Shipping)
    if (formData.discountType !== 'Free Shipping') {
      if (!formData.discountValue.trim()) {
        newErrors.discountValue = 'Discount value is required';
      } else {
        const value = parseFloat(formData.discountValue);
        if (isNaN(value)) {
          newErrors.discountValue = 'Discount value must be a number';
        } else if (formData.discountType === 'Percentage' && (value < 0 || value > 100)) {
          newErrors.discountValue = 'Percentage must be between 0 and 100';
        } else if (formData.discountType === 'Fixed Amount' && value <= 0) {
          newErrors.discountValue = 'Fixed amount must be greater than 0';
        }
      }
    }

    // Usage limits validation
    if (formData.limitPerCustomer && parseInt(formData.limitPerCustomer) <= 0) {
      newErrors.limitPerCustomer = 'Limit per customer must be greater than 0';
    }
    
    if (formData.totalUsageLimit && parseInt(formData.totalUsageLimit) <= 0) {
      newErrors.totalUsageLimit = 'Total usage limit must be greater than 0';
    }

    // Minimum purchase validation
    if (formData.minimumPurchase && parseFloat(formData.minimumPurchase) < 0) {
      newErrors.minimumPurchase = 'Minimum purchase cannot be negative';
    }

    if (formData.maximumPurchase) {
      const maxVal = parseFloat(formData.maximumPurchase);
      if (isNaN(maxVal) || maxVal < 0) {
        newErrors.maximumPurchase = 'Maximum purchase cannot be negative';
      } else if (formData.minimumPurchase) {
        const minVal = parseFloat(formData.minimumPurchase);
        if (!isNaN(minVal) && maxVal < minVal) {
          newErrors.maximumPurchase = 'Maximum must be greater than or equal to minimum';
        }
      }
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startParts = formData.startDate.split('/');
      const endParts = formData.endDate.split('/');
      
      if (startParts.length === 3 && endParts.length === 3) {
        const startDate = new Date(parseInt(startParts[2]), parseInt(startParts[0]) - 1, parseInt(startParts[1]));
        const endDate = new Date(parseInt(endParts[2]), parseInt(endParts[0]) - 1, parseInt(endParts[1]));
        
        if (startDate > endDate) {
          newErrors.endDate = 'End date must be after start date';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    onBack();
  };

  const handleSave = () => {
    // For edit (onSave) we still validate to enforce constraints
    if (onSave) {
      if (!validateForm()) return;
      onSave(formData);
    }
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
    discountCode: 'Unique coupon code the admin creates (e.g. SAVE10). Max 100 characters, no spaces.',
    discountType: 'Select discount style: percentage, fixed amount off, or free shipping.',
    discountValue: 'Discount amount. Percentage: 0-100. Fixed amount: enter currency value. Auto hidden for Free Shipping.',
    usageRules: 'Set limits on how many times this discount can be used per user and overall.',
    minimumPurchase: 'Define the order value range this discount applies to. Both min and max are optional; leave blank to ignore.',
    dateTime: 'Start and end date window when this discount is active.'
  };

  // Sample coupon codes list (10)
  const sampleCodes = [
    'SAVE10', 'WELCOME15', 'FREESHIP', 'DEAL20', 'NEWUSER5', 'SPRING25', 'FLASH30', 'MEGA50', 'FIRST100', 'GET5OFF'
  ];

  const handleGenerateCode = () => {
    const random = sampleCodes[Math.floor(Math.random() * sampleCodes.length)];
    setFormData(prev => ({ ...prev, discountCode: random }));
    // Clear any error if generated code length is fine
    if (errors.discountCode) {
      setErrors(prev => ({ ...prev, discountCode: '' }));
    }
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
  <h2 className="text-xl font-semibold text-gray-900">{onSave && !onAdd ? 'Edit Discount' : 'Create New Discount'}</h2>
      </div>

      {/* Form Fields */}
      <form className="space-y-6">
        {/* Discount Code with Generate Button */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
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
            <button
              type="button"
              onClick={handleGenerateCode}
              className="px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Generate
            </button>
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

        {/* Discount Value (conditional) */}
        {formData.discountType !== 'Free Shipping' && (
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
            <div className="relative">
              {formData.discountType === 'Fixed Amount' && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
              )}
              <input
                type="text"
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', e.target.value)}
                placeholder={formData.discountType === 'Percentage' ? '0 - 100' : 'Amount'}
                className={`w-full ${formData.discountType === 'Fixed Amount' ? 'pl-8 pr-4' : 'px-4'} py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.discountValue ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formData.discountType === 'Percentage' && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
              )}
            </div>
            {errors.discountValue && (
              <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>
            )}
          </div>
        )}

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
            <div>
              <input
                type="text"
                value={formData.limitPerCustomer}
                onChange={(e) => handleInputChange('limitPerCustomer', e.target.value)}
                placeholder="Limit per Customer"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.limitPerCustomer ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.limitPerCustomer && (
                <p className="text-red-500 text-xs mt-1">{errors.limitPerCustomer}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={formData.totalUsageLimit}
                onChange={(e) => handleInputChange('totalUsageLimit', e.target.value)}
                placeholder="Total Usage Limit"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.totalUsageLimit ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.totalUsageLimit && (
                <p className="text-red-500 text-xs mt-1">{errors.totalUsageLimit}</p>
              )}
            </div>
          </div>

          {/* Minimum & Maximum Purchase Amount */}
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Purchase amount range
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                <input
                  type="text"
                  value={formData.minimumPurchase}
                  onChange={(e) => handleInputChange('minimumPurchase', e.target.value)}
                  placeholder="Minimum"
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.minimumPurchase ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.minimumPurchase && (
                  <p className="text-red-500 text-xs mt-1">{errors.minimumPurchase}</p>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">₹</span>
                <input
                  type="text"
                  value={formData.maximumPurchase}
                  onChange={(e) => handleInputChange('maximumPurchase', e.target.value)}
                  placeholder="Maximum"
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maximumPurchase ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.maximumPurchase && (
                  <p className="text-red-500 text-xs mt-1">{errors.maximumPurchase}</p>
                )}
              </div>
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
                type="Date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                placeholder="mm/dd/yyyy"
                maxLength={10}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="Date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                placeholder="mm/dd/yyyy"
                maxLength={10}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
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
        {onAdd && !onSave && (
          <button
            onClick={handleAdd}
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Add
          </button>
        )}
        {onSave && !onAdd && (
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};
