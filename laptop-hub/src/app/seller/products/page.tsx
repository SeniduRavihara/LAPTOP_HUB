import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/services/auth-service"
import { ProductService } from "@/services/product-service"
import { SellerProductsClient } from "./products-client"

export default async function SellerProductsPage() {
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Please log in to view your products.</p>
      </div>
    )
  }

  // Fetch all seller products once
  const products = (await ProductService.getSellerProducts(
    user.id, 
    {}, 
    supabase
  )) as any[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Products</h2>
        <Button asChild>
          <Link href="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <SellerProductsClient initialProducts={products || []} />
    </div>
  )
}
