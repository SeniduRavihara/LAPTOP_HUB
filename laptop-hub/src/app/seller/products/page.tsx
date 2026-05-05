import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/services/auth-service"
import { ProductService } from "@/services/product-service"
import { DataTableFilters } from "@/components/ui/data-table-filters"

export default async function SellerProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : ""
  const type = typeof params.type === 'string' ? params.type : ""

  const supabase = await createClient()
  const user: any = await AuthService.getUser(supabase)

  if (!user) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">Please log in to view your products.</p>
      </div>
    )
  }

  const products = (await ProductService.getSellerProducts(
    user.id, 
    { search, type }, 
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

      <DataTableFilters 
        searchPlaceholder="Search my inventory..."
        filterKey="type"
        filterLabel="Type"
        filterOptions={[
          { label: "Auction", value: "auction" },
          { label: "Standard", value: "standard" },
        ]}
      />

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Brand</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Stock</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product: any) => (
              <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  {product.auctions && (Array.isArray(product.auctions) ? product.auctions.length > 0 : !!product.auctions) ? (
                    <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 border-none">Auction</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Standard</Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">LKR {product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-white transition-all">
                    <Link href={`/seller/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground italic">
                  {search || type 
                    ? "No products match your search/filters." 
                    : "No products found. Start selling by adding a product!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
