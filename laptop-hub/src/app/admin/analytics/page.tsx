'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  DollarSign, 
  ShieldAlert, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function AnalyticsPage() {
  const metrics = [
    {
      label: 'DAILY ACTIVE USERS',
      value: '12,584',
      trend: '+6.3% vs yesterday',
      trendUp: true,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'AVG. BID AMOUNT',
      value: '$1,248',
      trend: '+3.2% trend',
      trendUp: true,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'CHARGEBACK RATE',
      value: '0.42%',
      trend: '-0.1% vs last month',
      trendUp: false,
      icon: ShieldAlert,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'SELLER RESPONSE TIME',
      value: '1h 24m',
      trend: '+12m slower',
      trendUp: false,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  const funnelStages = [
    {
      label: 'Visits → Accounts',
      percentage: 42,
      color: 'bg-blue-600'
    },
    {
      label: 'Accounts → Active Bidders',
      percentage: 68,
      color: 'bg-green-600'
    },
    {
      label: 'Bidders → Winners',
      percentage: 37,
      color: 'bg-cyan-600'
    }
  ]

  const insights = [
    {
      title: 'Prime Time Engagement',
      description: 'Most bids occur between 7 PM and 10 PM local time, with 32% higher conversion.'
    },
    {
      title: 'Cross-border Growth',
      description: 'International buyers now account for 18% of GMV, up 4% month over month.'
    },
    {
      title: 'Quality Alerts',
      description: 'Six sellers triggered automated quality checks in the past 48 hours.'
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />

      {/* Header */}
      <div className="ml-64 bg-white border-b">
        <div className="px-8 py-6">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">ADMIN</p>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600 mt-1">
              High-level KPIs highlighting buyer engagement, liquidity, and trust.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 tracking-wide mb-2">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1">
                    {metric.trendUp ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <p className={`text-sm ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Buyer Funnel */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 h-full">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900">Buyer Funnel</h2>
              </CardHeader>
              <CardContent className="space-y-8 pb-8">
                {funnelStages.map((stage, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-900">{stage.label}</p>
                      <p className="text-sm font-semibold text-gray-900">{stage.percentage}%</p>
                    </div>
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${stage.color} rounded-full transition-all duration-500`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <div>
            <Card className="bg-white border border-gray-200 h-full">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900">Key Insights</h2>
              </CardHeader>
              <CardContent className="space-y-6 pb-6">
                {insights.map((insight, index) => (
                  <div key={index} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </main>
      <Footer/>
    </>
  )
}
