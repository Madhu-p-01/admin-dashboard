import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface NewCustomerFormProps {
  onBack: () => void;
  onSave?: (customer: any) => void;
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountry: string;
    phone: string;
    language: string;
    note: string;
  };
}

export const NewCustomerForm: React.FC<NewCustomerFormProps> = ({ onBack, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phoneCountry: initialData?.phoneCountry || '+91',
    phone: initialData?.phone || '',
    language: initialData?.language || '',
    note: initialData?.note || ''
  });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

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

  const handleConfirm = () => {
    // Validation for required fields
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.language.trim()) {
      alert('Please fill all required fields: First Name, Email, Phone Number, and Language.');
      return;
    }
    console.log('Confirm:', formData);
    if (onSave) {
      onSave(formData);
    }
    onBack();
  };

  const tooltips = {
    firstName: 'Enter the customer\'s first name. This field is required.',
    email: 'Enter a valid email address for the customer. This field is required.',
    phone: 'Enter the customer\'s phone number. This field is required.',
    language: 'Specify the customer\'s preferred language. This field is required.',
    note: 'Add any additional notes or comments about the customer.'
  };

  return (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 relative">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          title="Back to customers"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Customer Overview</h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* First Name & Last Name Row */}
        <div className="grid grid-cols-2 gap-14">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip('firstName')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
                >
                  i
                </button>
                {showTooltip === 'firstName' && (
                  <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                    {tooltips.firstName}
                  </div>
                )}
              </div>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Input your text"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Input your text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('email')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'email' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.email}
                </div>
              )}
            </div>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Input your text"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('phone')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'phone' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.phone}
                </div>
              )}
            </div>
          </label>
          <div className="flex gap-3">
            <div className="relative w-24">
              <select
                value={formData.phoneCountry}
                onChange={(e) => handleInputChange('phoneCountry', e.target.value)}
                title="Country code"
                className="w-full pl-4 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+86">+86</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Input your text"
              required
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Language <span className="text-red-500">*</span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('language')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'language' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.language}
                </div>
              )}
            </div>
          </label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            placeholder="Input your text"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Note */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            Note:
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip('note')}
                onMouseLeave={() => setShowTooltip(null)}
                className="inline-flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full text-xs text-gray-500 hover:bg-gray-100"
              >
                i
              </button>
              {showTooltip === 'note' && (
                <div className="absolute left-6 top-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-md shadow-lg">
                  {tooltips.note}
                </div>
              )}
            </div>
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="Type some notes"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
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
          onClick={handleConfirm}
          className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
