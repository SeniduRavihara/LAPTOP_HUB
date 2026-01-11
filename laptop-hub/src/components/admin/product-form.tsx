"use client"

import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  brand: z.string().min(2, {
    message: "Brand must be at least 2 characters.",
  }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a non-negative integer.",
  }),
  // For simplicity, we'll handle images as a comma-separated string for now or just one URL
  // Ideally this would be a file upload
  images: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

type Props = {
  initialData?: ProductFormValues & { id: string }
}

export function ProductForm({ initialData }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Initialize Supabase client
  const supabase = createClient()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      brand: "",
      description: "",
      price: 0,
      stock: 0,
      images: "",
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)

    try {
      // Get current user (seller)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("You must be logged in to create a product")
        return
      }

      const imagesArray = data.images 
        ? data.images.split(",").map((url) => url.trim()).filter((url) => url !== "")
        : []

      if (initialData) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: data.name,
            brand: data.brand,
            description: data.description,
            price: data.price,
            stock: data.stock,
            images: imagesArray,
            seller_id: user.id, // Ensure seller_id is preserved or updated if needed
          })
          .eq("id", initialData.id)

        if (error) throw error
        toast.success("Product updated successfully")
      } else {
        // Create new product
        const { error } = await supabase.from("products").insert({
          name: data.name,
          brand: data.brand,
          description: data.description,
          price: data.price,
          stock: data.stock,
          images: imagesArray,
          seller_id: user.id,
        })

        if (error) throw error
        toast.success("Product created successfully")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images (URLs)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter image URLs separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </Form>
  )
}
