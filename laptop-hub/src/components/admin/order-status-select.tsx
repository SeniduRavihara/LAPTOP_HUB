"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Props = {
  orderId: string
  currentStatus: string
}

const statuses = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter()

  const handleValueChange = async (value: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: value })
        .eq("id", orderId)

      if (error) throw error

      toast.success("Order status updated")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update status")
    }
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
