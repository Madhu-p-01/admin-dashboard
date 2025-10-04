
export interface CustomerOrderHistoryItem {
  id: string;
  productName: string;
  image: string;
  size: string;
  color: string;
  orderDate: string;
  deliveredDate: string | 'Processing';
  totalPrice: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: 'Subscribed' | 'Unsubscribed'; // subscription status label
  emailAddress: string;
  phone: string;
  language: string;
  location: string;
  orders: string; // e.g. "2 orders"
  amountSpent: string; // formatted currency string
  avatar: string;
  shippingAddress: string;
  billingAddress: string;
  orderHistory: CustomerOrderHistoryItem[];
}

export const customersData: CustomerRecord[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'Subscribed',
    emailAddress: 'name@hh.c',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: [
      {
        id: 'o1',
        productName: 'Product Name',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        size: 'XL',
        color: 'Black',
        orderDate: '11/11/2020',
        deliveredDate: 'Processing',
        totalPrice: '$1000'
      },
      {
        id: 'o2',
        productName: 'Product Name',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        size: 'XL',
        color: 'Black',
        orderDate: '11/11/2020',
        deliveredDate: '11/11/2020',
        totalPrice: '$1000'
      },
      {
        id: 'o3',
        productName: 'Product Name',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        size: 'XL',
        color: 'Black',
        orderDate: '11/11/2020',
        deliveredDate: '11/11/2020',
        totalPrice: '$1000'
      }
    ]
  },
  ...Array.from({ length: 9 }).map((_, i) => ({
    id: String(i + 2),
    name: 'Aisha Sharma',
    email: (i % 2 === 0 ? 'Unsubscribed' : 'Subscribed') as 'Subscribed' | 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: [] as CustomerOrderHistoryItem[]
  }))
];

export function findCustomerById(id: string): CustomerRecord | undefined {
  return customersData.find(c => c.id === id);
}

export function addCustomer(record: CustomerRecord) {
  customersData.push(record);
}

export function updateCustomer(id: string, partial: Partial<CustomerRecord>) {
  const idx = customersData.findIndex(c => c.id === id);
  if (idx !== -1) {
    customersData[idx] = { ...customersData[idx], ...partial };
    return customersData[idx];
  }
  return undefined;
}

export function deleteCustomer(id: string) {
  const idx = customersData.findIndex(c => c.id === id);
  if (idx !== -1) {
    customersData.splice(idx, 1);
    return true;
  }
  return false;
}
