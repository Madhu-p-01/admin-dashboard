import React, { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Icon } from '../components/ui/Icon';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Lily Admin Dashboard',
    siteDescription: 'Complete e-commerce admin solution',
    contactEmail: 'admin@lily.com',
    supportPhone: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'en',
    
    // Store Settings
    storeName: 'Lily Store',
    storeAddress: '123 Fashion Street, Mumbai, India',
    storeCountry: 'India',
    storeCity: 'Mumbai',
    storeZipCode: '400001',
    taxRate: '18',
    shippingRate: '50',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    emailFromName: 'Lily Store',
    emailFromAddress: 'noreply@lily.com',
    
    // Notification Settings
    orderNotifications: true,
    inventoryAlerts: true,
    customerUpdates: false,
    marketingEmails: true,
    systemMaintenance: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '60',
    passwordExpiry: '90',
    loginAttempts: '5',
    
    // Payment Settings
    paymentGateway: 'razorpay',
    razorpayKey: '',
    razorpaySecret: '',
    stripeKey: '',
    stripeSecret: ''
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'store', label: 'Store Info', icon: 'store' },
    { id: 'email', label: 'Email', icon: 'mail' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'payments', label: 'Payments', icon: 'credit-card' },
    { id: 'advanced', label: 'Advanced', icon: 'code' }
  ];

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              placeholder="Enter site name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="Enter contact email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleInputChange('supportPhone', e.target.value)}
              placeholder="Enter support phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select 
              title="Timezone"
              value={settings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select 
              title="Currency"
              value={settings.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select 
              title="Language"
              value={settings.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter site description"
          />
        </div>
      </Card>
    </div>
  );

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Store Name"
            value={settings.storeName}
            onChange={(e) => handleInputChange('storeName', e.target.value)}
            placeholder="Enter store name"
          />
          <Input
            label="Country"
            value={settings.storeCountry}
            onChange={(e) => handleInputChange('storeCountry', e.target.value)}
            placeholder="Enter country"
          />
          <Input
            label="City"
            value={settings.storeCity}
            onChange={(e) => handleInputChange('storeCity', e.target.value)}
            placeholder="Enter city"
          />
          <Input
            label="Zip Code"
            value={settings.storeZipCode}
            onChange={(e) => handleInputChange('storeZipCode', e.target.value)}
            placeholder="Enter zip code"
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            value={settings.taxRate}
            onChange={(e) => handleInputChange('taxRate', e.target.value)}
            placeholder="Enter tax rate"
          />
          <Input
            label="Shipping Rate (₹)"
            type="number"
            value={settings.shippingRate}
            onChange={(e) => handleInputChange('shippingRate', e.target.value)}
            placeholder="Enter shipping rate"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
          <textarea
            value={settings.storeAddress}
            onChange={(e) => handleInputChange('storeAddress', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter store address"
          />
        </div>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'orderNotifications', label: 'Order Notifications', description: 'Receive notifications for new orders' },
            { key: 'inventoryAlerts', label: 'Inventory Alerts', description: 'Get alerts when products are low in stock' },
            { key: 'customerUpdates', label: 'Customer Updates', description: 'Notifications about customer activities' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive marketing and promotional emails' },
            { key: 'systemMaintenance', label: 'System Maintenance', description: 'Alerts about system updates and maintenance' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleInputChange(item.key, e.target.checked)}
                  className="sr-only peer"
                  title={item.label}
                  placeholder={item.label}
                  aria-label={item.label}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <label htmlFor="twoFactorAuth" className="sr-only">Enable Two-Factor Authentication</label>
              <input
                id="twoFactorAuth"
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
                title="Enable Two-Factor Authentication"
                placeholder="Enable Two-Factor Authentication"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
              placeholder="Enter session timeout"
            />
            <Input
              label="Password Expiry (days)"
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
              placeholder="Enter password expiry"
            />
            <Input
              label="Max Login Attempts"
              type="number"
              value={settings.loginAttempts}
              onChange={(e) => handleInputChange('loginAttempts', e.target.value)}
              placeholder="Enter max login attempts"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'store':
        return renderStoreSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return (
          <Card className="p-6">
            <div className="text-center py-8">
              <Icon name="settings" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-500">This section is under development.</p>
            </div>
          </Card>
        );
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Settings</h3>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTab()}
            
            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="px-6 py-2">
                <Icon name="save" size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}