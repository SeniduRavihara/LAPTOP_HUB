import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import { ProductService } from "@/services/product-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default async function SellerEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    // redirect("/login")
  }

  const product: any = await ProductService.getProductById(id, supabase)

  if (!product) {
    notFound()
  }

  // Security check: Ensure the product belongs to the logged-in seller
  if (user && product.seller_id !== user.id) {
    // Ideally show a 403 Forbidden page or redirect with error
    // redirect("/seller/products")
  }

  // Transform data for the form
  const formattedProduct = {
    ...product,
    images: product.images || [],
  }

  const isAuctionActive = product.auction && (
    Array.isArray(product.auction) 
      ? product.auction.some((a: any) => a.status === 'active')
      : product.auction.status === 'active'
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      
      {isAuctionActive && (
        <Alert variant="destructive" className="bg-orange-50 text-orange-900 border-orange-200">
          <AlertTriangle className="h-4 w-4 stroke-orange-600" />
          <AlertTitle className="text-orange-900">Warning: Active Auction</AlertTitle>
          <AlertDescription className="text-orange-800">
            This product is currently part of an active auction. Changing its specifications, name, or images might affect live bidders and violates standard auction policies. Proceed with caution.
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border bg-white p-6">
        <ProductForm initialData={formattedProduct} />
      </div>
    </div>
  )
}
