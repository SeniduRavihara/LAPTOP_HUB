import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsClient } from "./products-client"
import { AuthService } from "@/services/auth-service"

export default async function ProductsPage() {
  const supabase = await createClient()
  const user = await AuthService.getUser(supabase);

  const { data: allProducts, error } = await supabase
    .from("products")
    .select("*, auction:auctions(status)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[ProductsPage] Error fetching data:", error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsClient initialProducts={allProducts || []} adminId={user?.id} />
    </div>
  )
}
