import { ProductForm } from "@/components/admin/product-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="px-2">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
        </div>
      </div>
      <div className="rounded-md border bg-white p-6">
        <ProductForm />
      </div>
    </div>
  )
}
