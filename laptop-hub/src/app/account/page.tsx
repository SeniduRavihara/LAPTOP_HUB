'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  User, 
  Package, 
  MapPin, 
  Lock, 
  Heart, 
  ShoppingBag,
  Edit
} from 'lucide-react'
import styles from './account.module.css'

function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [activeSidebar, setActiveSidebar] = useState('profile')
  
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  })

  const stats = [
    { label: 'Total Orders', value: 2, icon: ShoppingBag },
    { label: 'Active Orders', value: 1, icon: Package },
    { label: 'Wishlist', value: 3, icon: Heart },
    { label: 'Addresses', value: 2, icon: MapPin }
  ]

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  return (
    <div className={styles.accountPage}>
      <Navbar />
      
      <div className={styles.accountContainer}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Avatar className={styles.sidebarAvatar}>
              <AvatarFallback className={styles.avatarFallback}>JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className={styles.sidebarName}>John Doe</h3>
              <p className={styles.sidebarEmail}>john.doe@example.com</p>
            </div>
          </div>
          
          <nav className={styles.sidebarNav}>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSidebar(item.id)
                    setActiveTab(item.id)
                  }}
                  className={`${styles.sidebarItem} ${activeSidebar === item.id ? styles.sidebarItemActive : ''}`}
                >
                  <Icon className={styles.sidebarIcon} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <div>
              <h1 className={styles.contentTitle}>My Account</h1>
              <p className={styles.contentSubtitle}>Manage your account settings and preferences</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.contentTabs}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className={styles.tabContent}>
              <Card className={styles.profileCard}>
                <CardContent className={styles.profileCardContent}>
                  <div className={styles.profileHeader}>
                    <div className={styles.profileInfo}>
                      <Avatar className={styles.profileAvatar}>
                        <AvatarFallback className={styles.profileAvatarFallback}>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className={styles.profileName}>John Doe</h2>
                        <p className={styles.profileEmail}>john.doe@example.com</p>
                      </div>
                    </div>
                    <Button variant="outline" className={styles.editButton}>
                      <Edit className={styles.editIcon} />
                      Edit Profile
                    </Button>
                  </div>

                  <div className={styles.profileForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formField}>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <Card key={index} className={styles.statCard}>
                      <CardContent className={styles.statCardContent}>
                        <div className={styles.statIcon}>
                          <Icon />
                        </div>
                        <div className={styles.statInfo}>
                          <p className={styles.statLabel}>{stat.label}</p>
                          <p className={styles.statValue}>{stat.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className={styles.tabContent}>
              <Card className={styles.contentCard}>
                <CardHeader>
                  <h2 className={styles.cardTitle}>Order History</h2>
                  <p className={styles.cardDescription}>View and track your orders</p>
                </CardHeader>
                <CardContent>
                  <div className={styles.emptyState}>
                    <Package className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No orders yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className={styles.tabContent}>
              <Card className={styles.contentCard}>
                <CardHeader>
                  <h2 className={styles.cardTitle}>Saved Addresses</h2>
                  <p className={styles.cardDescription}>Manage your delivery addresses</p>
                </CardHeader>
                <CardContent>
                  <div className={styles.emptyState}>
                    <MapPin className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No addresses saved</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className={styles.tabContent}>
              <Card className={styles.contentCard}>
                <CardHeader>
                  <h2 className={styles.cardTitle}>Security Settings</h2>
                  <p className={styles.cardDescription}>Manage your password and security preferences</p>
                </CardHeader>
                <CardContent>
                  <div className={styles.securityForm}>
                    <div className={styles.formField}>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className={styles.formField}>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className={styles.formField}>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className={styles.tabContent}>
              <Card className={styles.contentCard}>
                <CardHeader>
                  <h2 className={styles.cardTitle}>My Wishlist</h2>
                  <p className={styles.cardDescription}>Items you want to purchase later</p>
                </CardHeader>
                <CardContent>
                  <div className={styles.emptyState}>
                    <Heart className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Your wishlist is empty</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default AccountPage
