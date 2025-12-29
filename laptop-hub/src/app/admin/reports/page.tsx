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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

interface Report {
  id: string
  name: string
  type: 'Sales' | 'Users' | 'Products' | 'Financial' | 'Activity'
  description: string
  lastGenerated: string
  status: 'Ready' | 'Generating' | 'Scheduled'
  size?: string
}

export default function ReportsPage() {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [reportType, setReportType] = useState('sales')
  const [dateRange, setDateRange] = useState('last-30-days')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [reports, setReports] = useState<Report[]>([
    {
      id: 'RPT-001',
      name: 'Monthly Sales Report',
      type: 'Sales',
      description: 'Complete sales breakdown including revenue, orders, and top products',
      lastGenerated: '2 hours ago',
      status: 'Ready',
      size: '2.4 MB'
    },
    {
      id: 'RPT-002',
      name: 'User Activity Report',
      type: 'Users',
      description: 'User registration, engagement, and retention metrics',
      lastGenerated: '5 hours ago',
      status: 'Ready',
      size: '1.8 MB'
    },
    {
      id: 'RPT-003',
      name: 'Product Performance Report',
      type: 'Products',
      description: 'Product views, conversions, and inventory analysis',
      lastGenerated: '1 day ago',
      status: 'Ready',
      size: '3.1 MB'
    },
    {
      id: 'RPT-004',
      name: 'Financial Summary Report',
      type: 'Financial',
      description: 'Revenue, expenses, profit margins, and payment processing',
      lastGenerated: 'Generating...',
      status: 'Generating'
    },
    {
      id: 'RPT-005',
      name: 'Weekly Activity Report',
      type: 'Activity',
      description: 'Platform activity including listings, bids, and transactions',
      lastGenerated: 'Scheduled for tomorrow',
      status: 'Scheduled'
    }
  ])

  const reportStats = [
    {
      label: 'Total Reports',
      value: '28',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Generated This Month',
      value: '12',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Active Reports',
      value: '5',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Data Exported',
      value: '124 MB',
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Generating':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Scheduled':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Sales':
        return <ShoppingBag className="w-5 h-5 text-blue-600" />
      case 'Users':
        return <Users className="w-5 h-5 text-purple-600" />
      case 'Products':
        return <FileText className="w-5 h-5 text-green-600" />
      case 'Financial':
        return <DollarSign className="w-5 h-5 text-orange-600" />
      case 'Activity':
        return <TrendingUp className="w-5 h-5 text-cyan-600" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      type: reportType.charAt(0).toUpperCase() + reportType.slice(1) as Report['type'],
      description: `Custom ${reportType} report for ${dateRange}`,
      lastGenerated: 'Just now',
      status: 'Generating'
    }
    setReports([newReport, ...reports])
    setIsGenerateOpen(false)
  }

  const handleDownload = (reportId: string, reportName: string) => {
    console.log(`Downloading report: ${reportId} - ${reportName}`)
    // Add download logic here
  }

  const handleView = (reportId: string) => {
    console.log(`Viewing report: ${reportId}`)
    // Add view logic here
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
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">
                Generate insights, track KPIs, and export platform analytics.
              </p>
            </div>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
              onClick={() => setIsGenerateOpen(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportStats.map((stat, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Reports</h2>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {getTypeIcon(report.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.name}
                        </h3>
                        <Badge className={`${getStatusColor(report.status)} font-medium px-3 py-1`}>
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>
                          <span className="font-medium">ID:</span> {report.id}
                        </span>
                        <span>
                          <span className="font-medium">Type:</span> {report.type}
                        </span>
                        <span>
                          <span className="font-medium">Last Generated:</span> {report.lastGenerated}
                        </span>
                        {report.size && (
                          <span>
                            <span className="font-medium">Size:</span> {report.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700"
                      onClick={() => handleView(report.id)}
                      disabled={report.status === 'Generating'}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                      onClick={() => handleDownload(report.id, report.name)}
                      disabled={report.status !== 'Ready'}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border">
            No reports available. Generate your first report to get started.
          </div>
        )}
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>
              Create a custom report with your selected parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="users">User Activity Report</SelectItem>
                  <SelectItem value="products">Product Performance Report</SelectItem>
                  <SelectItem value="financial">Financial Summary Report</SelectItem>
                  <SelectItem value="activity">Platform Activity Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="auction">Auction Analytics Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90"
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>
      <Footer />
    </>
  )
}
