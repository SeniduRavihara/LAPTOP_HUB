"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Props = {
  userId: string
  currentRole: string
}

const roles = [
  'customer',
  'seller',
  'admin',
]

export function UserRoleSelect({ userId, currentRole }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const handleValueChange = async (value: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: value })
        .eq("id", userId)

      if (error) throw error

      toast.success("User role updated")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update role")
    }
  }

  return (
    <Select defaultValue={currentRole} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
