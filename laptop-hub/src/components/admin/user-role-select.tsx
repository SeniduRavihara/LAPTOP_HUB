"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateUserRole } from "@/app/actions/user"

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

  const handleValueChange = async (value: string) => {
    try {
      const result = await updateUserRole(userId, value)

      if (!result.success) {
        throw new Error(result.error || "Failed to update role")
      }

      toast.success("User role updated successfully")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Failed to update role")
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
