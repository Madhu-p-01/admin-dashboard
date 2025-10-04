import React from 'react';
import { Icon } from './Icon';

interface OrderItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  availability: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function OrderItem({ 
  id, 
  name, 
  price, 
  image, 
  quantity, 
  availability,
  onQuantityChange, 
  onRemove 
}: OrderItemProps) {
  const totalPrice = price * quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      {/* Product Image */}
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-600">₹ {price}</p>
      </div>

      {/* Availability */}
      <div className="text-sm text-gray-600 min-w-0">
        <span className="font-medium">{availability}</span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <select
          value={quantity}
          onChange={(e) => onQuantityChange(id, parseInt(e.target.value))}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from({ length: Math.min(availability, 20) }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Total Price */}
      <div className="text-sm font-medium text-gray-900 min-w-0">
        ₹ {totalPrice}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(id)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
