import React, { useRef } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  emailAddress: string;
  phone: string;
  language: string;
  location: string;
  orders: string;
  amountSpent: string;
  avatar: string;
  shippingAddress: string;
  billingAddress: string;
  orderHistory: Array<{
    id: string;
    productName: string;
    image: string;
    size: string;
    color: string;
    orderDate: string;
    deliveredDate: string;
    totalPrice: string;
  }>;
}

interface ImportExportProps {
  customers: Customer[];
  onImport: (customers: Customer[]) => void;
}

export function ImportExport({ customers, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          
          const importedCustomers: Customer[] = [];
          
          // Helper function to parse CSV line properly
          const parseCSVLine = (line: string) => {
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              
              if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                  // Escaped quote
                  current += '"';
                  i++; // Skip next quote
                } else {
                  // Toggle quote state
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                // End of field
                values.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            
            // Add the last field
            values.push(current.trim());
            return values;
          };
          
          for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= headers.length && values[0].trim()) {
              const customer: Customer = {
                id: Date.now().toString() + i,
                name: values[0]?.trim() || '',
                emailAddress: values[1]?.trim() || '',
                email: values[2]?.trim() || 'Unsubscribed',
                phone: values[3]?.trim() || '',
                language: values[4]?.trim() || 'English',
                location: values[5]?.trim() || '',
                orders: values[6]?.trim() || '0 orders',
                amountSpent: values[7]?.trim() || '₹0.00',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                shippingAddress: '',
                billingAddress: '',
                orderHistory: []
              };
              importedCustomers.push(customer);
            }
          }
          
          onImport(importedCustomers);
          alert(`Successfully imported ${importedCustomers.length} customers`);
        } catch (error) {
          alert('Error parsing CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'Email Address', 'Subscription Status', 'Phone', 'Language', 'Location', 'Orders', 'Amount Spent'];
    
    // Helper function to escape field if needed
    const escapeField = (field: string) => {
      // Only add quotes if the field contains comma, quote, or newline
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        // Escape any existing quotes by doubling them
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };
    
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        customer.name,
        customer.emailAddress,
        customer.email,
        customer.phone,
        customer.language,
        customer.location,
        customer.orders,
        customer.amountSpent
      ].map(escapeField).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Import CSV file"
      />
      
      <div className="flex items-center gap-2">
        <button 
          onClick={handleImport}
          className="px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Import
        </button>
        <button 
          onClick={handleExport}
          className="px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Export
        </button>
      </div>
    </>
  );
}