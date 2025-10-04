import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { findCustomerById, deleteCustomer } from '../data/customers';

interface ReviewReply { id: string; text: string; date: string }
interface ReviewItem {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  images: string[];
  date: string;
  replies: ReviewReply[];
}

interface NoteItem { id: string; title: string; content: string; date: string }

export default function CustomerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customer = id ? findCustomerById(id) : undefined;
  const [activeTab, setActiveTab] = useState<'order-history' | 'wishlist' | 'reviews' | 'note'>('order-history');
  // Reviews state (mock)
  const [reviews, setReviews] = useState<ReviewItem[]>(customer ? [{
    id: '1',
    customerId: customer.id,
    customerName: customer.name,
    customerAvatar: customer.avatar,
    rating: 5,
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo, elit sit amet pretium laoreet, arcu lorem faucibus purus, at dictum lorem massa vitae lectus.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    ],
    date: '2024-01-15',
    replies: []
  }] : []);
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Notes state (mock per customer)
  const [notes, setNotes] = useState<Record<string, NoteItem[]>>(customer ? {
    [customer.id]: [
      { id: '1', title: 'Loyal Customer', content: 'This customer has been with us for over 2 years and makes regular purchases.', date: '2024-01-10' }
    ]
  } : {});
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [editNoteContent, setEditNoteContent] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);

  // Simple notifications
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; type: 'success'|'error'|'info'}>>([]);
  const pushNotification = (message: string, type: 'success'|'error'|'info'='info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 2500);
  };

  // Handlers
  const handleReplyToReview = (reviewId: string) => { setShowReplyInput(reviewId); setReplyText(''); };
  const handleSaveReply = () => {
    if (showReplyInput && replyText.trim()) {
      setReviews(prev => prev.map(r => r.id === showReplyInput ? { ...r, replies: [...r.replies, { id: Date.now().toString(), text: replyText.trim(), date: new Date().toISOString().split('T')[0] }] } : r));
      setShowReplyInput(null); setReplyText(''); pushNotification('Reply added','success');
    }
  };
  const handleCancelReply = () => { setShowReplyInput(null); setReplyText(''); };
  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    pushNotification('Review deleted','success');
  };

  const handleAddNewNote = () => setShowAddNoteModal(true);
  const handleSaveNewNote = () => {
    if (!customer || !newNoteTitle.trim() || !newNoteContent.trim()) return;
    const newNote: NoteItem = { id: Date.now().toString(), title: newNoteTitle.trim(), content: newNoteContent.trim(), date: new Date().toISOString().split('T')[0] };
    setNotes(prev => ({ ...prev, [customer.id]: [...(prev[customer.id]||[]), newNote] }));
    setNewNoteTitle(''); setNewNoteContent(''); setShowAddNoteModal(false); pushNotification('Note added','success');
  };
  const handleCancelAddNote = () => { setNewNoteTitle(''); setNewNoteContent(''); setShowAddNoteModal(false); };
  const handleEditNote = (noteId: string) => {
    if (!customer) return;
    const note = notes[customer.id]?.find(n => n.id === noteId);
    if (!note) return;
    setEditingNoteId(noteId); setEditNoteTitle(note.title); setEditNoteContent(note.content); setShowEditNoteModal(true);
  };
  const handleSaveEditNote = () => {
    if (!customer || !editingNoteId || !editNoteTitle.trim() || !editNoteContent.trim()) return;
    setNotes(prev => ({ ...prev, [customer.id]: prev[customer.id].map(n => n.id === editingNoteId ? { ...n, title: editNoteTitle.trim(), content: editNoteContent.trim() } : n) }));
    setEditingNoteId(null); setEditNoteTitle(''); setEditNoteContent(''); setShowEditNoteModal(false); pushNotification('Note updated','success');
  };
  const handleCancelEditNote = () => { setEditingNoteId(null); setEditNoteTitle(''); setEditNoteContent(''); setShowEditNoteModal(false); };
  const handleDeleteNote = (noteId: string) => { setNoteToDelete(noteId); setShowDeleteNoteConfirm(true); };
  const confirmDeleteNote = () => {
    if (!customer || !noteToDelete) return;
    setNotes(prev => ({ ...prev, [customer.id]: prev[customer.id].filter(n => n.id !== noteToDelete) }));
    setNoteToDelete(null); setShowDeleteNoteConfirm(false); pushNotification('Note deleted','success');
  };
  const cancelDeleteNote = () => { setNoteToDelete(null); setShowDeleteNoteConfirm(false); };

  // Edit/Delete customer state (edit now navigates to dedicated page)
  const [showDeleteCustomerConfirm, setShowDeleteCustomerConfirm] = useState(false);

  const handleEditCustomer = () => {
    if (!customer) return;
    navigate(`/customer/${customer.id}/edit`);
  };
  const handleDeleteCustomer = () => { setShowDeleteCustomerConfirm(true); };
  const confirmDeleteCustomer = () => {
    if (!customer) return;
    deleteCustomer(customer.id);
    pushNotification('Customer deleted','success');
    navigate('/customers');
  };
  const cancelDeleteCustomer = () => setShowDeleteCustomerConfirm(false);

  // Utility for conditional classes
  const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');


  if (!customer) {
    return (
      <AdminLayout title="Customer">
        <div className="p-6">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline mb-4">Back</button>
          <div className="bg-white border border-red-200 text-red-600 p-6 rounded-lg">Customer not found.</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customer">
      <div className="p-6">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Customers</span>
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button onClick={handleEditCustomer} className="p-2 text-gray-900 hover:text-gray-900" title="Edit">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={handleDeleteCustomer} className="p-2 text-gray-900 hover:text-red-600" title="Delete">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-start gap-16 max-w-3xl mx-auto">
            <div className="flex-shrink-0 text-center">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-35 h-40 rounded-full object-cover mx-auto"
              />
              <p className="text-center font-semibold text-gray-900 mt-4 text-base">{customer.name}</p>
            </div>
            <div className="flex-1 space-y-5 pt-2">
              <div className="flex items-start">
                <p className="text-sm font-semibold text-black w-40">Email</p>
                <p className="text-sm text-gray-900 flex-1">{customer.emailAddress}</p>
              </div>
              <div className="flex items-start">
                <p className="text-sm font-semibold text-black w-40">Phone</p>
                <p className="text-sm text-gray-900 flex-1">{customer.phone}</p>
              </div>
              <div className="flex items-start">
                <p className="text-sm font-semibold text-black w-40">Language</p>
                <p className="text-sm text-gray-900 flex-1">{customer.language}</p>
              </div>
              <div className="flex items-start">
                <p className="text-sm font-semibold text-black w-40">Shipping Address</p>
                <p className="text-sm text-gray-900 leading-relaxed flex-1">{customer.shippingAddress}</p>
              </div>
              <div className="flex items-start">
                <p className="text-sm font-semibold text-black w-40">Billing Address</p>
                <p className="text-sm text-gray-900 leading-relaxed flex-1">{customer.billingAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            {(['order-history', 'wishlist', 'reviews', 'note'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'order-history' && (
          <div className="space-y-4">
            {customer.orderHistory.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img src={order.image} alt={order.productName} className="w-24 h-24 object-cover rounded" />
                  {order.deliveredDate === 'Processing' && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.productName}</p>
                    <p className="text-xs text-gray-500 mt-1">Size: {order.size}</p>
                    <p className="text-xs text-gray-500">Color: {order.color}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Order Date: {order.orderDate}</p>
                    <p className={`text-xs mt-1 ${order.deliveredDate === 'Processing' ? 'text-green-600' : 'text-gray-500'}`}>Delivered Date: {order.deliveredDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Total Price: {order.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(item => (
              <div key={item} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Product" className="w-full h-48 object-cover" />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600" title="Remove from wishlist">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
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

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">REVIEW LIST</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">Sort by:</span>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" aria-label="Sort reviews">
                  <option>newest</option>
                  <option>oldest</option>
                  <option>highest rated</option>
                  <option>lowest rated</option>
                </select>
              </div>
            </div>
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={review.customerAvatar} alt={review.customerName} className="w-16 h-16 rounded-full object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-3 mb-4">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDeleteReview(review.id)} className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Delete</button>
                    <button onClick={() => handleReplyToReview(review.id)} className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">Reply</button>
                  </div>
                  {showReplyInput === review.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleSaveReply} className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">Save Reply</button>
                        <button onClick={handleCancelReply} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                      </div>
                    </div>
                  )}
                  {review.replies.map(reply => (
                    <div key={reply.id} className="mt-4 bg-gray-50 border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-sm text-gray-700">{reply.text}</p>
                      <p className="text-xs text-gray-500 mt-1">Replied on {reply.date}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'note' && (
          <div className="space-y-4">
            {customer && notes[customer.id]?.map(note => (
              <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">{note.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{note.date}</span>
                    <button onClick={() => handleEditNote(note.id)} className="p-2 text-gray-900 hover:text-gray-900" title="Edit">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="p-2 text-gray-900 hover:text-red-600" title="Delete">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
              </div>
            ))}
            <div className="bg-white border border-gray-300 border-dashed rounded-lg p-12 flex items-center justify-center">
              <button onClick={handleAddNewNote} className="flex flex-col items-center gap-2 text-gray-900 hover:text-gray-900">
                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="text-sm">Add New Note</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`p-3 rounded text-white text-sm shadow ${n.type === 'success' ? 'bg-green-600' : n.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>{n.message}</div>
          ))}
        </div>

        {/* Add Note Modal */}
        {showAddNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="Enter note title" aria-label="Note title" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} rows={4} placeholder="Enter note content" aria-label="Note content" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={handleCancelAddNote} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg">Cancel</button>
                <button onClick={handleSaveNewNote} className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg">Save Note</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Note Modal */}
        {showEditNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Note</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} placeholder="Edit note title" aria-label="Edit note title" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} rows={4} placeholder="Edit note content" aria-label="Edit note content" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={handleCancelEditNote} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg">Cancel</button>
                <button onClick={handleSaveEditNote} className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Note Confirmation */}
        {showDeleteNoteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Note</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={cancelDeleteNote} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg">Cancel</button>
                <button onClick={confirmDeleteNote} className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Inline customer edit modal removed; edit now navigates to /customer/:id/edit */}

        {/* Delete Customer Confirmation */}
        {showDeleteCustomerConfirm && customer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Customer</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this customer? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={cancelDeleteCustomer} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg">Cancel</button>
                <button onClick={confirmDeleteCustomer} className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
