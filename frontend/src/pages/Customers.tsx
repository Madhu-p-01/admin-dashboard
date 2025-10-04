import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { NewCustomerForm } from '../components/forms/NewCustomerForm';
import { CustomerSearch } from '../components/ui/CustomerSearch';
import { FilterDropdown } from '../components/ui/FilterDropdown';
import { SortDropdown } from '../components/ui/SortDropdown';
import { ImportExport } from '../components/ui/ImportExport';

// Extended customer data with full profile information
const customersData = [
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
  {
    id: '2',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '3',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '4',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '5',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '6',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '7',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '8',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '9',
    name: 'Aisha Sharma',
    email: 'Subscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  },
  {
    id: '10',
    name: 'Aisha Sharma',
    email: 'Unsubscribed',
    emailAddress: 'aisha@example.com',
    phone: '+91 8877886677',
    language: 'English',
    location: 'Bengaluru KA, India',
    orders: '2 orders',
    amountSpent: '₹1200.50',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    shippingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    billingAddress: '#212 Bank road, Gottigere, B.G road, Bangalore - 560083',
    orderHistory: []
  }
];

export default function CustomersPage() {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customersData[0] | null>(null);
  const [view, setView] = useState<'table' | 'profile' | 'new-customer' | 'edit-customer'>('table');
  const [activeTab, setActiveTab] = useState<'order-history' | 'wishlist' | 'reviews' | 'note'>('order-history');
  const [customers, setCustomers] = useState(customersData);
  const [filteredCustomers, setFilteredCustomers] = useState(customersData);
  const [displayedCustomers, setDisplayedCustomers] = useState(customersData);

  // Filter and Sort states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [currentSort, setCurrentSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);

  // Edit/Delete states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<typeof customersData[0] | null>(null);

  // Delete confirmation states for notes and reviews
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showDeleteReviewConfirm, setShowDeleteReviewConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // Reviews states
  const [reviews, setReviews] = useState<Array<{
    id: string;
    customerId: string;
    customerName: string;
    customerAvatar: string;
    rating: number;
    comment: string;
    images: string[];
    date: string;
    replies: Array<{ id: string; text: string; date: string }>;
  }>>([
    {
      id: '1',
      customerId: '1',
      customerName: 'Jane Smith',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo, elit sit amet pretium laoreet, arcu lorem faucibus purus, at dictum lorem massa vitae lectus.',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
      ],
      date: '2024-01-15',
      replies: []
    }
  ]);

  // Notes states
  const [customerNotes, setCustomerNotes] = useState<Record<string, Array<{id: string, title: string, content: string, date: string}>>>({
    '1': [
      {
        id: '1',
        title: 'Loyal Customer',
        content: 'This customer has been with us for over 2 years and makes regular purchases.',
        date: '2024-01-10'
      }
    ]
  });
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Reviews reply states
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Edit note states
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info'}>>([]);

  // Notification function
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, {id, message, type}]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Filter configuration
  const filterGroups = [
    {
      id: 'subscription',
      label: 'Email Subscription',
      options: [
        { id: 'subscribed', label: 'Subscribed', count: customers.filter(c => c.email === 'Subscribed').length },
        { id: 'unsubscribed', label: 'Unsubscribed', count: customers.filter(c => c.email === 'Unsubscribed').length }
      ]
    },
    {
      id: 'location',
      label: 'Location',
      options: [
        { id: 'bengaluru', label: 'Bengaluru KA, India', count: customers.filter(c => c.location.includes('Bengaluru')).length }
      ]
    },
    {
      id: 'language',
      label: 'Language',
      options: [
        { id: 'english', label: 'English', count: customers.filter(c => c.language === 'English').length }
      ]
    }
  ];

  // Sort options
  const sortOptions = [
    { id: 'name-asc', label: 'Name (A-Z)', field: 'name', direction: 'asc' as const },
    { id: 'name-desc', label: 'Name (Z-A)', field: 'name', direction: 'desc' as const },
    { id: 'location-asc', label: 'Location (A-Z)', field: 'location', direction: 'asc' as const },
    { id: 'location-desc', label: 'Location (Z-A)', field: 'location', direction: 'desc' as const },
    { id: 'amount-asc', label: 'Amount Spent (Low to High)', field: 'amountSpent', direction: 'asc' as const },
    { id: 'amount-desc', label: 'Amount Spent (High to Low)', field: 'amountSpent', direction: 'desc' as const }
  ];

  // Apply filters and sorting
  const processedCustomers = useMemo(() => {
    let result = [...filteredCustomers];

    // Apply filters
    Object.entries(appliedFilters).forEach(([groupId, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        switch (groupId) {
          case 'subscription':
            result = result.filter(customer => {
              return selectedOptions.some(option => {
                if (option === 'subscribed') return customer.email === 'Subscribed';
                if (option === 'unsubscribed') return customer.email === 'Unsubscribed';
                return false;
              });
            });
            break;
          case 'location':
            result = result.filter(customer => {
              return selectedOptions.some(option => {
                if (option === 'bengaluru') return customer.location.includes('Bengaluru');
                return false;
              });
            });
            break;
          case 'language':
            result = result.filter(customer => {
              return selectedOptions.some(option => {
                if (option === 'english') return customer.language === 'English';
                return false;
              });
            });
            break;
        }
      }
    });

    // Apply sorting
    if (currentSort) {
      result.sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (currentSort.field) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'location':
            aValue = a.location.toLowerCase();
            bValue = b.location.toLowerCase();
            break;
          case 'amountSpent':
            aValue = parseFloat(a.amountSpent.replace(/[₹,]/g, ''));
            bValue = parseFloat(b.amountSpent.replace(/[₹,]/g, ''));
            break;
          default:
            return 0;
        }

        if (currentSort.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return result;
  }, [filteredCustomers, appliedFilters, currentSort]);

  // Update displayed customers when processed customers change
  React.useEffect(() => {
    setDisplayedCustomers(processedCustomers);
  }, [processedCustomers]);

  const handleCustomerClick = (customer: typeof customersData[0]) => {
    // Navigate to standalone profile route
    navigate(`/customer/${customer.id}`);
  };

  const handleNewCustomer = () => {
    setView('new-customer');
  };

  const handleBackToTable = () => {
    setView('table');
    setSelectedCustomer(null);
  };

  const handleBack = () => {
    setView('table');
    setSelectedCustomer(null);
    setActiveTab('order-history');
  };

  // Handler functions
  const handleSearchResults = (results: typeof customersData) => {
    setFilteredCustomers(results);
  };

  const handleApplyFilters = (filters: Record<string, string[]>) => {
    setAppliedFilters(filters);
  };

  const handleSortChange = (sort: { field: string; direction: 'asc' | 'desc' }) => {
    setCurrentSort(sort);
  };

  const handleImport = (importedCustomers: typeof customersData) => {
    const newCustomers = [...customers, ...importedCustomers];
    setCustomers(newCustomers);
    setFilteredCustomers(newCustomers);
  };

  const handleSaveNewCustomer = (formData: any) => {
    // Create new customer object from form data
    const newCustomer = {
      id: (Date.now() + Math.random()).toString(),
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: 'Subscribed', // Default to subscribed
      emailAddress: formData.email || '',
      phone: `${formData.phoneCountry} ${formData.phone}`.trim(),
      language: formData.language || 'English',
      location: '', // Will be filled later or left empty
      orders: '0 orders',
      amountSpent: '₹0.00',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', // Default avatar
      shippingAddress: '',
      billingAddress: '',
      orderHistory: []
    };

    // Add the new customer to the list
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);

    // Show success message
    showNotification(`Customer "${newCustomer.name}" has been added successfully!`, 'success');
  };

  const handleSaveEditedCustomer = (formData: any) => {
    if (!selectedCustomer) return;

    // Update the customer object with form data
    const updatedCustomer = {
      ...selectedCustomer,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      emailAddress: formData.email || selectedCustomer.emailAddress,
      phone: `${formData.phoneCountry} ${formData.phone}`.trim(),
      language: formData.language || selectedCustomer.language,
    };

    // Update the customer in the list
    const updatedCustomers = customers.map(c => c.id === selectedCustomer.id ? updatedCustomer : c);
    setCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);

    // Show success message and go back to profile
    showNotification(`Customer "${updatedCustomer.name}" has been updated successfully!`, 'success');
    setView('profile');
  };

  // Edit/Delete handlers
  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setView('edit-customer');
    }
  };

  const handleDeleteCustomer = (customer: typeof customersData[0]) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCustomer = () => {
    if (customerToDelete) {
      const updatedCustomers = customers.filter(c => c.id !== customerToDelete.id);
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
      setView('table');
      setSelectedCustomer(null);
      showNotification(`Customer "${customerToDelete.name}" has been deleted successfully!`, 'success');
    }
  };

  const cancelDeleteCustomer = () => {
    setShowDeleteConfirm(false);
    setCustomerToDelete(null);
  };

  // Note delete confirmation handlers
  const confirmDeleteNote = () => {
    if (selectedCustomer && noteToDelete) {
      setCustomerNotes(prevNotes => ({
        ...prevNotes,
        [selectedCustomer.id]: prevNotes[selectedCustomer.id]?.filter(note => note.id !== noteToDelete) || []
      }));
      setShowDeleteNoteConfirm(false);
      setNoteToDelete(null);
      showNotification('Note deleted successfully!', 'success');
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteNoteConfirm(false);
    setNoteToDelete(null);
  };

  // Reviews handlers
  const handleReplyToReview = (reviewId: string) => {
    setShowReplyInput(reviewId);
    setReplyText('');
  };

  const handleSaveReply = () => {
    if (showReplyInput && replyText.trim()) {
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === showReplyInput
            ? { ...review, replies: [...review.replies, { id: Date.now().toString(), text: replyText.trim(), date: new Date().toISOString().split('T')[0] }] }
            : review
        )
      );
      setShowReplyInput(null);
      setReplyText('');
      showNotification('Reply added successfully!', 'success');
    }
  };

  const handleCancelReply = () => {
    setShowReplyInput(null);
    setReplyText('');
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteReviewConfirm(true);
  };

  // Notes handlers
  const handleAddNewNote = () => {
    setShowAddNoteModal(true);
  };

  const handleSaveNewNote = () => {
    if (selectedCustomer && newNoteTitle.trim() && newNoteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      setCustomerNotes(prevNotes => ({
        ...prevNotes,
        [selectedCustomer.id]: [...(prevNotes[selectedCustomer.id] || []), newNote]
      }));

      setNewNoteTitle('');
      setNewNoteContent('');
      setShowAddNoteModal(false);
      showNotification('Note added successfully!', 'success');
    }
  };

  const handleCancelAddNote = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNoteModal(false);
  };

  // Edit note handlers
  const handleEditNote = (noteId: string) => {
    if (selectedCustomer) {
      const noteToEdit = customerNotes[selectedCustomer.id]?.find(note => note.id === noteId);
      if (noteToEdit) {
        setEditingNoteId(noteId);
        setEditNoteTitle(noteToEdit.title);
        setEditNoteContent(noteToEdit.content);
        setShowEditNoteModal(true);
      }
    }
  };

  const handleSaveEditNote = () => {
    if (selectedCustomer && editingNoteId && editNoteTitle.trim() && editNoteContent.trim()) {
      setCustomerNotes(prevNotes => ({
        ...prevNotes,
        [selectedCustomer.id]: prevNotes[selectedCustomer.id]?.map(note =>
          note.id === editingNoteId
            ? { ...note, title: editNoteTitle.trim(), content: editNoteContent.trim() }
            : note
        ) || []
      }));

      setEditingNoteId(null);
      setEditNoteTitle('');
      setEditNoteContent('');
      setShowEditNoteModal(false);
      showNotification('Note updated successfully!', 'success');
    }
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setEditNoteTitle('');
    setEditNoteContent('');
    setShowEditNoteModal(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteNoteConfirm(true);
  };

  return (
    <AdminLayout title="Customers">
      {/* Notification Display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className={`p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
            {notification.message}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 min-h-screen">
        {/* Combined Search/Table and Profile Container */}
        <div className="mx-6 mt-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            
            {/* Table View */}
            {view === 'table' && (
              <>
                {/* Search and Controls */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <CustomerSearch
                      customers={customers}
                      onSearchResults={handleSearchResults}
                      placeholder="Search customers..."
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 relative">
                      {/* Filter Button */}
                      <div className="relative">
                        <button 
                          onClick={() => setIsFilterOpen(!isFilterOpen)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          title="Filter"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          {Object.values(appliedFilters).flat().length > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {Object.values(appliedFilters).flat().length}
                            </span>
                          )}
                        </button>
                        
                        <FilterDropdown
                          isOpen={isFilterOpen}
                          onClose={() => setIsFilterOpen(false)}
                          filters={filterGroups}
                          appliedFilters={appliedFilters}
                          onApplyFilters={handleApplyFilters}
                        />
                      </div>

                      {/* Sort Button */}
                      <div className="relative">
                        <button 
                          onClick={() => setIsSortOpen(!isSortOpen)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          title="Sort"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                          {currentSort && (
                            <span className="bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>
                          )}
                        </button>
                        
                        <SortDropdown
                          isOpen={isSortOpen}
                          onClose={() => setIsSortOpen(false)}
                          options={sortOptions}
                          currentSort={currentSort}
                          onSortChange={handleSortChange}
                        />
                      </div>

                      {/* Import/Export */}
                      <ImportExport
                        customers={displayedCustomers}
                        onImport={handleImport}
                      />

                      {/* Add Customer Button */}
                      <button 
                        onClick={handleNewCustomer}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-black hover:text-white border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                        title="Add new customer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Customer</span>
                      </button>
                    </div>
                  </div>
                </div>

            {/* Table */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Email Subscription
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-black">
                        Amount Spent
                      </th>
                    </tr>
                  </thead>
                <tbody>
                  {displayedCustomers.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      onClick={() => handleCustomerClick(customer)}
                      className={`border-b border-gray-100 last:border-b-0 cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                      } hover:bg-gray-200 transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            customer.email === 'Subscribed' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{customer.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {customer.amountSpent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
              </>
            )}

            {/* Removed inline profile view: now handled by /customer/:id route */}

            {/* New Customer Form View */}
            {view === 'new-customer' && (
              <NewCustomerForm
                onBack={handleBackToTable}
                onSave={handleSaveNewCustomer}
              />
            )}

            {/* Edit Customer Form View */}
            {view === 'edit-customer' && selectedCustomer && (
              <div className="p-6">
                <NewCustomerForm
                  onBack={() => setView('profile')}
                  onSave={handleSaveEditedCustomer}
                  initialData={{
                    firstName: selectedCustomer.name.split(' ')[0] || '',
                    lastName: selectedCustomer.name.split(' ').slice(1).join(' ') || '',
                    email: selectedCustomer.emailAddress,
                    phoneCountry: selectedCustomer.phone.split(' ')[0] || '+91',
                    phone: selectedCustomer.phone.split(' ').slice(1).join(' ') || '',
                    language: selectedCustomer.language,
                    note: ''
                  }}
                />
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && customerToDelete && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Customer</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete customer "{customerToDelete.name}"? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={cancelDeleteCustomer}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteCustomer}
                      className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Note Modal */}
            {showAddNoteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter note title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="Enter note content"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <button
                      onClick={handleCancelAddNote}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNewNote}
                      className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Note Confirmation Modal */}
            {showDeleteNoteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Note</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this note? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={cancelDeleteNote}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteNote}
                      className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
