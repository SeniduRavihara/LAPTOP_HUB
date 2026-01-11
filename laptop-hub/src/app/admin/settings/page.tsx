"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function SettingsPage() {
  const handleSave = () => {
    toast.success("Settings saved")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure basic platform information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="Laptop Hub" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" defaultValue="support@laptophub.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance & Access</CardTitle>
            <CardDescription>
              Control system availability and access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-base">Maintenance Mode</Label>
                <div className="text-sm text-muted-foreground">
                    Disable access to the platform for all users.
                </div>
              </div>
              <Switch />
            </div>
             <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-base">Allow New User Registrations</Label>
                <div className="text-sm text-muted-foreground">
                    If disabled, no new users can sign up.
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
