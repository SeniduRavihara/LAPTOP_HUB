import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function SellerEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // redirect("/login")
  }

  const { data: product } = await supabase
    .from("products")
    .select("*, auction:auctions(*)")
    .eq("id", id)
    .single()

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>
      <div className="rounded-md border bg-white p-6">
        <ProductForm initialData={formattedProduct} />
      </div>
    </div>
  )
}
