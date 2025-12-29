'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 



  User, 
  
  Package, 
  MapPin, 
  Lock, 
  Heart, 
  Bell, 
  CreditCard,
  Settings,
  Edit2,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  Shield,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

function AccountPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    avatar: '/placeholder.svg'
  })

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true
    },
    {
      id: 2,
      type: 'Work',
      name: 'John Doe',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false
    }
  ])

  const [orders] = useState([
    {
      id: 'ORD-2025-001',
      date: '2025-12-10',
      status: 'Delivered',
      total: 2698.00,
      items: 2,
      products: [
        { name: 'Dell XPS 13 Plus', quantity: 1, price: 1299, image: '/placeholder.svg?key=dell' },
        { name: 'MacBook Air M2', quantity: 1, price: 1199, image: '/placeholder.svg?key=mac' }
      ]
    },
    {
      id: 'ORD-2025-002',
      date: '2025-12-08',
      status: 'In Transit',
      total: 1549.99,
      items: 1,
      products: [
        { name: 'HP Spectre x360', quantity: 1, price: 1549.99, image: '/placeholder.svg?key=hp' }
      ]
    },
    {
      id: 'ORD-2025-003',
      date: '2025-11-25',
      status: 'Processing',
      total: 899.00,
      items: 1,
      products: [
        { name: 'ASUS VivoBook', quantity: 1, price: 899, image: '/placeholder.svg?key=asus' }
      ]
    }
  ])

  const [wishlist] = useState([
    {
      id: 1,
      name: 'Lenovo ThinkPad X1 Carbon',
      price: 1899,
      image: '/placeholder.svg?key=lenovo',
      inStock: true,
      discount: 10
    },
    {
      id: 2,
      name: 'ASUS ROG Zephyrus G14',
      price: 1699,
      image: '/placeholder.svg?key=rog',
      inStock: true,
      discount: 0
    },
    {
      id: 3,
      name: 'Microsoft Surface Laptop 5',
      price: 999,
      image: '/placeholder.svg?key=surface',
      inStock: false,
      discount: 0
    }
  ])

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    priceDrops: true
  })

  const handleProfileSave = () => {
    setIsEditingProfile(false)
  }

  const handlePasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }



  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'in transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const [activeTab, setActiveTab] = useState("profile")
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Card className="lg:col-span-1 h-fit bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "profile" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "orders" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "addresses" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "wishlist" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "payment" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Payment Methods</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "security" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Security</span>
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeTab === "notifications" ? "bg-accent" : "hover:bg-accent"}`}
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Notifications</span>
                </button>
                <Separator className="my-2" />
                <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            </CardContent>
          </Card>
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              {/* Payment Methods Tab */}
              <TabsContent value="payment">
                <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Visa ending in 1234</p>
                            <p className="text-sm text-muted-foreground">Expires 12/28</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Mastercard ending in 5678</p>
                            <p className="text-sm text-muted-foreground">Expires 05/27</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Remove</Button>
                      </div>
                      <Button variant="default" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" /> Add New Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      <Button
                        variant={isEditingProfile ? "default" : "outline"}
                        onClick={() => isEditingProfile ? handleProfileSave() : setIsEditingProfile(true)}
                      >
                        {isEditingProfile ? 'Save Changes' : <><Edit2 className="w-4 h-4 mr-2" />Edit</>}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <User className="w-16 h-16 text-muted-foreground" />
                        </div>
                        {isEditingProfile && (
                          <Button variant="outline" size="sm">
                            Change Photo
                          </Button>
                        )}
                      </div>

                      {/* Profile Form */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                              disabled={!isEditingProfile}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                              disabled={!isEditingProfile}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                              disabled={!isEditingProfile}
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                              disabled={!isEditingProfile}
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <Input
                              id="dob"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                              disabled={!isEditingProfile}
                              className="flex-1"
                            />
                          </div>
                        </div>

                        {isEditingProfile && (
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditingProfile(false)}
                            className="mr-2"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                          <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Wishlist Items</p>
                          <p className="text-2xl font-bold text-foreground">{wishlist.length}</p>
                        </div>
                        <Heart className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Saved Addresses</p>
                          <p className="text-2xl font-bold text-foreground">{addresses.length}</p>
                        </div>
                        <MapPin className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="font-semibold">{order.id}</h3>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Ordered on {new Date(order.date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <div className="space-y-2 mt-4">
                                  {order.products.map((product, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                        <Package className="w-6 h-6 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Saved Addresses</CardTitle>
                        <CardDescription>Manage your delivery addresses</CardDescription>
                      </div>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{address.type}</Badge>
                                {address.isDefault && (
                                  <Badge className="bg-primary/10 text-primary">Default</Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteAddress(address.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            <p className="font-semibold mb-1">{address.name}</p>
                            <p className="text-sm text-muted-foreground">{address.street}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.country}</p>
                            {!address.isDefault && (
                              <Button 
                                variant="link" 
                                className="px-0 mt-2"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Items you want to purchase later</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="pt-6">
                            <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                              <Package className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                            <div className="flex items-center gap-2 mb-3">
                              <p className="text-xl font-bold">${item.price}</p>
                              {item.discount > 0 && (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                  -{item.discount}%
                                </Badge>
                              )}
                            </div>
                            {item.inStock ? (
                              <Button className="w-full">Add to Cart</Button>
                            ) : (
                              <Button variant="outline" className="w-full" disabled>
                                Out of Stock
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              className="w-full mt-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          />
                        </div>
                        <Button onClick={handlePasswordChange}>
                          <Lock className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                    <CardHeader>
                      <CardTitle>Two-Factor Authentication</CardTitle>
                      <CardDescription>Add an extra layer of security to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">2FA Status</p>
                            <p className="text-sm text-muted-foreground">Not enabled</p>
                          </div>
                        </div>
                        <Button>Enable 2FA</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-700 shadow-lg">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-muted-foreground">Get notified about your orders</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifications.orderUpdates}
                            onChange={(e) => setNotifications({...notifications, orderUpdates: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Promotions & Deals</p>
                            <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifications.promotions}
                            onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-muted-foreground">Stay updated with our newsletter</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifications.newsletter}
                            onChange={(e) => setNotifications({...notifications, newsletter: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Price Drops</p>
                            <p className="text-sm text-muted-foreground">Get alerts on wishlist price drops</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifications.priceDrops}
                            onChange={(e) => setNotifications({...notifications, priceDrops: e.target.checked})}
                            className="w-4 h-4"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AccountPage