'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, FileCheck } from 'lucide-react'

interface Seller {
  id: string
  name: string
  status: 'Verified' | 'Under Review' | 'Suspended'
  rating: number
  products: number
  revenue: string
}

export default function SellersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const [sellers, setSellers] = useState<Seller[]>([
    {
      id: 'SLR-901',
      name: 'TechStore_Pro',
      status: 'Verified',
      rating: 4.9,
      products: 58,
      revenue: '$245k'
    },
    {
      id: 'SLR-902',
      name: 'ElectroMart',
      status: 'Under Review',
      rating: 4.7,
      products: 42,
      revenue: '$189k'
    },
    {
      id: 'SLR-903',
      name: 'GadgetHub_Plus',
      status: 'Verified',
      rating: 4.5,
      products: 37,
      revenue: '$156k'
    },
    {
      id: 'SLR-904',
      name: 'TechDealers',
      status: 'Suspended',
      rating: 2.1,
      products: 15,
      revenue: '$98k'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Under Review':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Suspended':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return ''
    }
  }

  const handleInviteSeller = () => {
    // Handle invite logic
    console.log('Inviting seller:', inviteEmail)
    setIsInviteOpen(false)
    setInviteEmail('')
  }

  const handleAudit = (sellerId: string) => {
    console.log('Auditing seller:', sellerId)
  }

  const handleViewProfile = (sellerId: string) => {
    console.log('Viewing seller profile:', sellerId)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />

      {/* Header */}
      <div className="ml-64 bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">ADMIN</p>
              <h1 className="text-3xl font-bold text-gray-900">Seller Oversight</h1>
              <p className="text-gray-600 mt-1">
                Track performance, compliance, and growth metrics for every seller.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsInviteOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Seller
              </Button>
              <Button
                className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                onClick={() => setIsVerifyOpen(true)}
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Verify Documents
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <Card key={seller.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">{seller.id}</p>
                    <h3 className="text-xl font-semibold text-gray-900">{seller.name}</h3>
                  </div>
                  <Badge className={`${getStatusColor(seller.status)} font-medium px-3 py-1`}>
                    {seller.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Rating </span>
                    <span className="font-semibold text-gray-900">{seller.rating}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Products </span>
                    <span className="font-semibold text-gray-900">{seller.products}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue </span>
                    <span className="font-semibold text-gray-900">{seller.revenue}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => handleViewProfile(seller.id)}
                  >
                    View Profile
                  </Button>
                  <Button
                    className="flex-1 bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                    onClick={() => handleAudit(seller.id)}
                  >
                    Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Invite Seller Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Seller</DialogTitle>
            <DialogDescription>
              Send an invitation to a new seller to join the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="seller@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Business Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Invitation Message (Optional)</Label>
              <Input
                id="message"
                type="text"
                placeholder="Add a personal message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90"
              onClick={handleInviteSeller}
              disabled={!inviteEmail}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Documents Dialog */}
      <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verify Seller Documents</DialogTitle>
            <DialogDescription>
              Review and verify pending seller verification documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">ElectroMart</p>
                  <p className="text-sm text-gray-500">Submitted: Dec 20, 2025</p>
                </div>
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  Pending Review
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  View Documents
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">
                  Approve
                </Button>
                <Button size="sm" variant="destructive" className="text-xs">
                  Reject
                </Button>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm py-4">
              No more pending verifications
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
      <Footer />  
    </>
  )
}
