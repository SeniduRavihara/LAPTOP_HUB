"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

const profileSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email().readonly(),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: User
  userData: any
}

export function ProfileForm({ user, userData }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const nameParts = (userData?.name || "").split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: user.email || "",
      phone: userData?.phone || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim()
      const { error } = await supabase
        .from("users")
        .update({
          name: fullName,
          // phone: data.phone, // Uncomment if phone field is added to users table
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
        console.error(error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-muted/10 border-none h-12 opacity-70" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="px-8 h-12">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
