import React, { useState, useMemo } from 'react';
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
    setSelectedCustomer(customer);
    setView('profile');
    setActiveTab('order-history');
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

            {/* Profile View */}
            {view === 'profile' && selectedCustomer && (
              <div className="p-6">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Customer Profile</span>
                </button>

                {/* Customer Info Card - Centered */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1"></div>
                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                      <button onClick={handleEditCustomer} className="p-2 text-gray-900 hover:text-gray-900" title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteCustomer(selectedCustomer)} className="p-2 text-gray-900 hover:text-red-600" title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-16 max-w-3xl mx-auto">
                    {/* Avatar - Left */}
                    <div className="flex-shrink-0 text-center">
                      <img
                        src={selectedCustomer.avatar}
                        alt={selectedCustomer.name}
                        className="w-35 h-40 rounded-full object-cover mx-auto"
                      />
                      <p className="text-center font-semibold text-gray-900 mt-4 text-base">{selectedCustomer.name}</p>
                    </div>

                    {/* Customer Details - Right */}
                    <div className="flex-1 space-y-5 pt-2">
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-black w-40">Email</p>
                        <p className="text-sm text-gray-900 flex-1">{selectedCustomer.emailAddress}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-black w-40">Phone</p>
                        <p className="text-sm text-gray-900 flex-1">{selectedCustomer.phone}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-black w-40">Language</p>
                        <p className="text-sm text-gray-900 flex-1">{selectedCustomer.language}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-black w-40">Shipping Address</p>
                        <p className="text-sm text-gray-900 leading-relaxed flex-1">{selectedCustomer.shippingAddress}</p>
                      </div>
                      <div className="flex items-start">
                        <p className="text-sm font-semibold text-black w-40">Billing Address</p>
                        <p className="text-sm text-gray-900 leading-relaxed flex-1">{selectedCustomer.billingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex gap-8">
                    <button
                      onClick={() => setActiveTab('order-history')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'order-history'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Order History
                    </button>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'wishlist'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Wishlist
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'reviews'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab('note')}
                      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'note'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Note
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {/* Order History Tab */}
                {activeTab === 'order-history' && (
                  <div className="space-y-4">
                    {selectedCustomer.orderHistory.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                      >
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={order.image}
                            alt={order.productName}
                            className="w-24 h-24 object-cover rounded"
                          />
                          {order.deliveredDate === 'Processing' && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.productName}</p>
                            <p className="text-xs text-gray-500 mt-1">Size: {order.size}</p>
                            <p className="text-xs text-gray-500">Color: {order.color}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
                            <p className={`text-xs mt-1 ${
                              order.deliveredDate === 'Processing' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              Delivered Date: {order.deliveredDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Total Price: {order.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {selectedCustomer.orderHistory.length > 0 && (
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <button className="p-2 text-gray-400 hover:text-gray-600" title="Previous">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600" title="Next">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <div key={item} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="relative">
                          <img
                            src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                            alt="Product"
                            className="w-full h-48 object-cover"
                          />
                          <button 
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                            title="Remove from wishlist"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-3 text-center">
                          <p className="text-sm font-medium text-gray-900">Product Name</p>
                          <p className="text-xs text-gray-500 mt-1">Price: $ 1000</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">REVIEW LIST</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">Sort by:</span>
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          aria-label="Sort reviews"
                        >
                          <option>newest</option>
                          <option>oldest</option>
                          <option>highest rated</option>
                          <option>lowest rated</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={selectedCustomer.avatar}
                            alt={selectedCustomer.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{selectedCustomer.name}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo, elit sit amet pretium laoreet, arcu lorem faucibus purus, at dictum lorem massa vitae lectus.
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="" className="w-20 h-20 object-cover rounded" />
                          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="" className="w-20 h-20 object-cover rounded" />
                          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="" className="w-20 h-20 object-cover rounded" />
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDeleteReview('1')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleReplyToReview('1')}
                            className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                          >
                            Reply
                          </button>
                        </div>

                        {/* Reply Input */}
                        {showReplyInput === '1' && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleSaveReply}
                                className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                              >
                                Save Reply
                              </button>
                              <button
                                onClick={handleCancelReply}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Display Replies */}
                        {reviews.find(r => r.id === '1')?.replies.map((reply) => (
                          <div key={reply.id} className="mt-4 bg-gray-50 border-l-4 border-blue-500 pl-4 py-2">
                            <p className="text-sm text-gray-700">{reply.text}</p>
                            <p className="text-xs text-gray-500 mt-1">Replied on {reply.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Note Tab */}
                {activeTab === 'note' && (
                  <div className="space-y-4">
                    {/* Existing Notes */}
                    {selectedCustomer && customerNotes[selectedCustomer.id]?.map((note) => (
                      <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{note.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{note.date}</span>
                            <button onClick={() => handleEditNote(note.id)} className="p-2 text-gray-900 hover:text-gray-900" title="Edit">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDeleteNote(note.id)} className="p-2 text-gray-900 hover:text-red-600" title="Delete">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                      </div>
                    ))}

                    {/* Add New Note Button */}
                    <div className="bg-white border border-gray-300 border-dashed rounded-lg p-12 flex items-center justify-center">
                      <button
                        onClick={handleAddNewNote}
                        className="flex flex-col items-center gap-2 text-gray-900 hover:text-gray-900"
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <span className="text-sm">Add New Note</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

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
