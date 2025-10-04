import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { NewCustomerForm } from '../components/forms/NewCustomerForm';
import { findCustomerById, updateCustomer } from '../data/customers';

export default function CustomerEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const customer = id ? findCustomerById(id) : undefined;

  if (!customer) {
    return (
      <AdminLayout title="Edit Customer">
        <div className="p-6">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4">Back</button>
          <div className="bg-white border border-red-200 text-red-600 p-6 rounded-lg">Customer not found.</div>
        </div>
      </AdminLayout>
    );
  }

  const parts = customer.name.split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');
  const phoneParts = customer.phone.split(' ');
  const phoneCountry = phoneParts[0] || '+91';
  const phone = phoneParts.slice(1).join(' ') || '';

  const handleSave = (formData: any) => {
    // Update underlying mock dataset
    updateCustomer(customer.id, {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      emailAddress: formData.email,
      phone: `${formData.phoneCountry} ${formData.phone}`.trim(),
      language: formData.language,
      shippingAddress: customer.shippingAddress, // preserve existing
      billingAddress: customer.billingAddress
    });
    navigate(`/customer/${customer.id}`);
  };

  return (
    <AdminLayout title="Edit Customer">
      <div className="p-6">
        <NewCustomerForm
          onBack={() => navigate(`/customer/${customer.id}`)}
          onSave={handleSave}
          initialData={{
            firstName,
            lastName,
            email: customer.emailAddress,
            phoneCountry,
            phone,
            language: customer.language,
            note: customer.shippingAddress // reuse field as note/address
          }}
        />
      </div>
    </AdminLayout>
  );
}
