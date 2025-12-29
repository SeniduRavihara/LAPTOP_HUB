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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Search, AlertTriangle } from 'lucide-react'

interface FlaggedContent {
  id: string
  type: 'Product' | 'Review' | 'Comment' | 'User Report'
  title: string
  reportedBy: string
  reason: string
  date: string
  status: 'Pending' | 'Approved' | 'Removed'
  description: string
}

export default function ContentModerationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null)
  const [moderationNote, setModerationNote] = useState('')

  const [flaggedItems, setFlaggedItems] = useState<FlaggedContent[]>([
    {
      id: 'FLG-1001',
      type: 'Product',
      title: 'Suspicious Product Listing - iPhone 14 Pro',
      reportedBy: 'John Doe',
      reason: 'Possible counterfeit product',
      date: 'Dec 24, 2025',
      status: 'Pending',
      description: 'Product images appear to be stock photos. Price is suspiciously low compared to market value.'
    },
    {
      id: 'FLG-1002',
      type: 'Review',
      title: 'Inappropriate Review Content',
      reportedBy: 'Sarah Johnson',
      reason: 'Offensive language',
      date: 'Dec 23, 2025',
      status: 'Pending',
      description: 'Review contains inappropriate language and personal attacks against the seller.'
    },
    {
      id: 'FLG-1003',
      type: 'Comment',
      title: 'Spam Comment on Product Page',
      reportedBy: 'System Auto-Detection',
      reason: 'Spam/Advertisement',
      date: 'Dec 23, 2025',
      status: 'Removed',
      description: 'Multiple comments promoting external website links.'
    },
    {
      id: 'FLG-1004',
      type: 'User Report',
      title: 'Seller Misconduct Report',
      reportedBy: 'Emily Carter',
      reason: 'Fraudulent activity',
      date: 'Dec 22, 2025',
      status: 'Pending',
      description: 'User reports seller requested payment outside the platform.'
    },
    {
      id: 'FLG-1005',
      type: 'Product',
      title: 'Prohibited Item Listed',
      reportedBy: 'System Auto-Detection',
      reason: 'Prohibited category',
      date: 'Dec 22, 2025',
      status: 'Removed',
      description: 'Product listing violates marketplace prohibited items policy.'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Removed':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return ''
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Product':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Review':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'Comment':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200'
      case 'User Report':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      default:
        return ''
    }
  }

  const filteredItems = flaggedItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || item.type.toLowerCase().replace(' ', '-') === typeFilter
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const pendingCount = flaggedItems.filter(item => item.status === 'Pending').length

  const handleReview = (item: FlaggedContent) => {
    setSelectedContent(item)
    setModerationNote('')
    setIsReviewOpen(true)
  }

  const handleApprove = () => {
    if (selectedContent) {
      setFlaggedItems(flaggedItems.map(item =>
        item.id === selectedContent.id ? { ...item, status: 'Approved' as const } : item
      ))
      setIsReviewOpen(false)
      setSelectedContent(null)
    }
  }

  const handleRemove = () => {
    if (selectedContent) {
      setFlaggedItems(flaggedItems.map(item =>
        item.id === selectedContent.id ? { ...item, status: 'Removed' as const } : item
      ))
      setIsReviewOpen(false)
      setSelectedContent(null)
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-gray-600 mt-1">
                Review flagged content, enforce community guidelines, and maintain platform integrity.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-orange-900">{pendingCount} Pending Reviews</p>
                <p className="text-xs text-orange-700">Requires immediate attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title, reporter, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="comment">Comment</SelectItem>
                <SelectItem value="user-report">User Report</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Flagged Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-xs text-gray-500 font-medium">{item.id}</p>
                      <Badge className={`${getTypeColor(item.type)} font-medium px-2 py-0.5 text-xs`}>
                        {item.type}
                      </Badge>
                      <Badge className={`${getStatusColor(item.status)} font-medium px-2 py-0.5 text-xs`}>
                        {item.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>
                        <span className="font-medium">Reported by:</span> {item.reportedBy}
                      </span>
                      <span>
                        <span className="font-medium">Reason:</span> {item.reason}
                      </span>
                      <span>
                        <span className="font-medium">Date:</span> {item.date}
                      </span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <Button
                      className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                      onClick={() => handleReview(item)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
            No flagged content found matching your search criteria.
          </div>
        )}
      </div>

      {/* Review Content Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Flagged Content</DialogTitle>
            <DialogDescription>
              Review and take action on {selectedContent?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="flex items-center gap-2">
                <Badge className={`${getTypeColor(selectedContent?.type || '')} font-medium`}>
                  {selectedContent?.type}
                </Badge>
                <Badge className={`${getStatusColor(selectedContent?.status || '')} font-medium`}>
                  {selectedContent?.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <p className="text-sm text-gray-700 font-medium">{selectedContent?.title}</p>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <p className="text-sm text-gray-700">{selectedContent?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reported By</Label>
                <p className="text-sm text-gray-700">{selectedContent?.reportedBy}</p>
              </div>
              <div className="space-y-2">
                <Label>Report Date</Label>
                <p className="text-sm text-gray-700">{selectedContent?.date}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason for Flag</Label>
              <p className="text-sm text-gray-700">{selectedContent?.reason}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Moderation Note (Optional)</Label>
              <Textarea
                id="note"
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                placeholder="Add internal notes about this moderation decision..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApprove}
            >
              Approve Content
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
            >
              Remove Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
      <Footer />
    </>
  )
}
