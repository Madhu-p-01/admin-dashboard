
export type DiscountStatus = 'Active' | 'Inactive' | 'Expired';

export interface DiscountRecord {
  id: string;
  code: string;
  description: string;
  status: DiscountStatus;
  usedBy: number;
  maxUsage: number;
  createdAt: string; // ISO date string
  startsAt?: string; // optional scheduling
  endsAt?: string;   // optional expiration
  type?: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value?: number; // if percentage or fixed
  minPurchase?: number;
  maxPurchase?: number;
}

export const discountsData: DiscountRecord[] = [
  {
    id: '1',
    code: 'GET5',
    description: '5% off entire order',
    status: 'Active',
    usedBy: 20,
    maxUsage: 100,
    createdAt: '2024-12-01',
    type: 'Percentage',
    value: 5
  },
  {
    id: '2',
    code: 'SAVE10',
    description: '10% off on orders above ₹500',
    status: 'Active',
    usedBy: 15,
    maxUsage: 50,
    createdAt: '2025-01-10',
    type: 'Percentage',
    value: 10,
    minPurchase: 500
  },
  {
    id: '3',
    code: 'FREESHIP',
    description: 'Free shipping on all orders',
    status: 'Inactive',
    usedBy: 5,
    maxUsage: 30,
    createdAt: '2025-02-05',
    type: 'Free Shipping'
  },
  {
    id: '4',
    code: 'WELCOME',
    description: '15% off for new customers',
    status: 'Expired',
    usedBy: 100,
    maxUsage: 100,
    createdAt: '2024-10-20',
    type: 'Percentage',
    value: 15
  }
];

export function getAllDiscounts(): DiscountRecord[] {
  return discountsData.slice();
}

export function findDiscountById(id: string): DiscountRecord | undefined {
  return discountsData.find(d => d.id === id);
}

export function addDiscount(record: DiscountRecord) {
  discountsData.push(record);
  return record;
}

export function updateDiscount(id: string, partial: Partial<DiscountRecord>) {
  const idx = discountsData.findIndex(d => d.id === id);
  if (idx !== -1) {
    discountsData[idx] = { ...discountsData[idx], ...partial };
    return discountsData[idx];
  }
  return undefined;
}

export function deleteDiscount(id: string) {
  const idx = discountsData.findIndex(d => d.id === id);
  if (idx !== -1) {
    discountsData.splice(idx, 1);
    return true;
  }
  return false;
}
