import React, { useRef } from 'react';

interface Discount {
  id: string;
  code: string;
  description: string;
  status: string;
  usedBy: number;
  maxUsage: number;
}

interface ImportExportDiscountProps {
  discounts: Discount[];
  onImport: (discounts: Discount[]) => void;
}

export function ImportExportDiscount({ discounts, onImport }: ImportExportDiscountProps) {
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

          const importedDiscounts: Discount[] = [];

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
              const discount: Discount = {
                id: Date.now().toString() + i,
                code: values[0]?.trim() || '',
                description: values[1]?.trim() || '',
                status: values[2]?.trim() || 'Active',
                usedBy: parseInt(values[3]?.trim() || '0', 10),
                maxUsage: parseInt(values[4]?.trim() || '0', 10),
              };
              importedDiscounts.push(discount);
            }
          }

          onImport(importedDiscounts);
          alert(`Successfully imported ${importedDiscounts.length} discounts`);
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
    const headers = ['Code', 'Description', 'Status', 'Used By', 'Max Usage'];

    // Helper function to escape field if needed
    const escapeField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csvContent = [
      headers.join(','),
      ...discounts.map(discount => [
        discount.code,
        discount.description,
        discount.status,
        discount.usedBy.toString(),
        discount.maxUsage.toString()
      ].map(escapeField).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `discounts_${new Date().toISOString().split('T')[0]}.csv`);
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
