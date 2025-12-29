'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SellerSidebar } from '@/components/seller-sidebar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'


export default function StoreSettingsPage() {
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'TechStore_Pro',
    storeEmail: 'contact@techstore-pro.com',
    phoneNumber: '+1-800-123-4567',
    description: 'Premium laptops and computer hardware',
    address: '123 Tech Ave, Silicon Valley, CA 94025',
    city: 'Silicon Valley',
    state: 'California',
    zipCode: '94025',
    country: 'United States',
  })

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: 'Tech Store Pro',
    accountNumber: '****-****-****-1234',
    bankName: 'Bank of America',
    routingNumber: '****-****-6789',
  })

  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log('Settings saved:', { storeInfo, bankDetails })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <SellerSidebar />
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Store Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your store profile and preferences</p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Store Logo */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Store Logo</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">TP</span>
              </div>
              <div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Upload Logo
                </button>
                <p className="text-xs text-muted-foreground">PNG or JPG, max 1MB</p>
              </div>
            </div>
          </div>

          {/* Store Information */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Store Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={storeInfo.storeName}
                    onChange={handleStoreInfoChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Store Email</label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={storeInfo.storeEmail}
                    onChange={handleStoreInfoChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={storeInfo.phoneNumber}
                    onChange={handleStoreInfoChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                  <select
                    name="country"
                    value={storeInfo.country}
                    onChange={(e) => setStoreInfo((prev) => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Store Description</label>
                <textarea
                  name="description"
                  value={storeInfo.description}
                  onChange={handleStoreInfoChange}
                  placeholder="Describe your store"
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={storeInfo.address}
                  onChange={handleStoreInfoChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={storeInfo.city}
                    onChange={handleStoreInfoChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={storeInfo.state}
                    onChange={handleStoreInfoChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={storeInfo.zipCode}
                    onChange={handleStoreInfoChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-card rounded-lg border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Bank Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={bankDetails.accountHolderName}
                  onChange={handleBankDetailsChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Account Number</label>
                  <input
                    type="password"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleBankDetailsChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Routing Number</label>
                <input
                  type="password"
                  name="routingNumber"
                  value={bankDetails.routingNumber}
                  onChange={handleBankDetailsChange}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Changes
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>

          {/* Account Status */}
          <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800 p-4">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              Account Status: <span className="font-semibold">Verified</span> - All features unlocked
            </p>
          </div>
        </div>
       
      </main>
      <Footer />
      </div>
      
    </>
     
  )
}
