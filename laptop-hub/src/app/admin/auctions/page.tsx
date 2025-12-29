'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'

interface Auction {
  id: string
  name: string
  bids: number
  topBid: string
  endsIn: string
  status: 'Live' | 'Completed' | 'Flagged'
}

export default function AuctionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newAuction, setNewAuction] = useState({
    productName: '',
    startingBid: '',
    duration: '24',
    description: ''
  })

  const [auctions, setAuctions] = useState<Auction[]>([
    {
      id: 'AUC-3201',
      name: 'Dell XPS 15 Limited',
      bids: 23,
      topBid: '$1,450',
      endsIn: '2h 15m',
      status: 'Live'
    },
    {
      id: 'AUC-3202',
      name: 'MSI Raider RTX 4080',
      bids: 56,
      topBid: '$2,050',
      endsIn: 'Closed',
      status: 'Completed'
    },
    {
      id: 'AUC-3203',
      name: 'Surface Laptop Studio',
      bids: 8,
      topBid: '$1,210',
      endsIn: 'Pending Review',
      status: 'Flagged'
    },
    {
      id: 'AUC-3204',
      name: 'ASUS Zephyrus G15',
      bids: 14,
      topBid: '$1,640',
      endsIn: '16h 45m',
      status: 'Live'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Completed':
        return 'bg-gray-200 text-gray-700 border-gray-300'
      case 'Flagged':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return ''
    }
  }

  const handleCreateAuction = () => {
    const auction: Auction = {
      id: `AUC-${3200 + auctions.length + 1}`,
      name: newAuction.productName,
      bids: 0,
      topBid: newAuction.startingBid,
      endsIn: `${newAuction.duration}h`,
      status: 'Live'
    }
    setAuctions([auction, ...auctions])
    setIsCreateOpen(false)
    setNewAuction({ productName: '', startingBid: '', duration: '24', description: '' })
  }

  const handlePause = (auctionId: string) => {
    console.log('Pausing auction:', auctionId)
    // Add pause logic here
  }

  const handleView = (auctionId: string) => {
    console.log('Viewing auction:', auctionId)
    // Navigate to auction details
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
              <h1 className="text-3xl font-bold text-gray-900">Auction Operations</h1>
              <p className="text-gray-600 mt-1">
                Oversee live auctions, resolve disputes, and ensure fair bidding.
              </p>
            </div>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Auction
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="space-y-4">
          {auctions.map((auction) => (
            <Card key={auction.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium mb-1">{auction.id}</p>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {auction.name}
                        </h3>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>
                            <span className="font-medium">Bids:</span> {auction.bids}
                          </span>
                          <span>
                            <span className="font-medium">Top Bid:</span> {auction.topBid}
                          </span>
                          <span>
                            <span className="font-medium">Ends In:</span> {auction.endsIn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(auction.status)} font-medium px-4 py-1.5`}>
                          {auction.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          className="text-gray-700"
                          onClick={() => handleView(auction.id)}
                        >
                          View
                        </Button>
                        <Button
                          className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                          onClick={() => handlePause(auction.id)}
                        >
                          Pause
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {auctions.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
            No auctions found. Create your first auction to get started.
          </div>
        )}
      </div>

      {/* Create Auction Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Auction</DialogTitle>
            <DialogDescription>
              Set up a new auction for a product in the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={newAuction.productName}
                onChange={(e) => setNewAuction({ ...newAuction, productName: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingBid">Starting Bid</Label>
              <Input
                id="startingBid"
                value={newAuction.startingBid}
                onChange={(e) => setNewAuction({ ...newAuction, startingBid: e.target.value })}
                placeholder="$0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={newAuction.duration}
                onValueChange={(value) => setNewAuction({ ...newAuction, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">72 hours</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newAuction.description}
                onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                placeholder="Add auction details or special conditions"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90"
              onClick={handleCreateAuction}
              disabled={!newAuction.productName || !newAuction.startingBid}
            >
              Create Auction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
      <Footer />
    </>
  )
}
