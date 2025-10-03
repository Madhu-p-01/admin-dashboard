import React from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: number;
  onAdd: (productId: string) => void;
  isAdded?: boolean;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  availability, 
  onAdd, 
  isAdded = false 
}: ProductCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Product Image */}
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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

      {/* Add Button */}
      <Button
        size="sm"
        variant={isAdded ? "secondary" : "default"}
        onClick={() => onAdd(id)}
        disabled={isAdded}
      >
        {isAdded ? "Added" : "Add"}
      </Button>
    </div>
  );
}
