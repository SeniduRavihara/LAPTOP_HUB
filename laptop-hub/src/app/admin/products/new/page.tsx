import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
      </div>
      <div className="rounded-md border bg-white p-6">
        <ProductForm />
      </div>
    </div>
  )
}
