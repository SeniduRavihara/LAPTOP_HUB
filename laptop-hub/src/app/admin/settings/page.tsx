'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SystemSettingsPage() {
  const [marketplaceName, setMarketplaceName] = useState('TechHub Marketplace')
  const [supportEmail, setSupportEmail] = useState('support@techhub.com')
  const [defaultCurrency, setDefaultCurrency] = useState('USD')
  
  const [require2FA, setRequire2FA] = useState(true)
  const [weeklyAudit, setWeeklyAudit] = useState(false)
  const [criticalAlerts, setCriticalAlerts] = useState(true)

  const handleSaveBranding = () => {
    console.log('Saving branding settings:', {
      marketplaceName,
      supportEmail,
      defaultCurrency
    })
    // Add save logic here
  }

  const handleResetDefaults = () => {
    setRequire2FA(true)
    setWeeklyAudit(false)
    setCriticalAlerts(true)
    console.log('Reset automation settings to defaults')
  }

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
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure authentication, notifications, marketplace policies, and automation.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branding Section */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-bold text-gray-900">Branding</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="marketplaceName" className="text-sm font-medium text-gray-900">
                  Marketplace Name
                </Label>
                <Input
                  id="marketplaceName"
                  value={marketplaceName}
                  onChange={(e) => setMarketplaceName(e.target.value)}
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="text-sm font-medium text-gray-900">
                  Support Email
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium text-gray-900">
                  Default Currency
                </Label>
                <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                  <SelectTrigger id="currency" className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white"
                onClick={handleSaveBranding}
              >
                Save Branding
              </Button>
            </CardContent>
          </Card>

          {/* Automation Section */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-bold text-gray-900">Automation</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                {/* Require Seller 2FA */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Require seller 2FA
                    </h3>
                    <p className="text-sm text-gray-600">
                      Force multi-factor authentication for all seller dashboards.
                    </p>
                  </div>
                  <Switch
                    checked={require2FA}
                    onCheckedChange={setRequire2FA}
                  />
                </div>

                {/* Weekly Audit Digest */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Weekly audit digest
                    </h3>
                    <p className="text-sm text-gray-600">
                      Email a weekly compliance report to admins.
                    </p>
                  </div>
                  <Switch
                    checked={weeklyAudit}
                    onCheckedChange={setWeeklyAudit}
                  />
                </div>

                {/* Critical Incident Alerts */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      Critical incident alerts
                    </h3>
                    <p className="text-sm text-gray-600">
                      Push and email alerts for fraud or downtime.
                    </p>
                  </div>
                  <Switch
                    checked={criticalAlerts}
                    onCheckedChange={setCriticalAlerts}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleResetDefaults}
              >
                Reset Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      <Footer />
    </>
  )
}
