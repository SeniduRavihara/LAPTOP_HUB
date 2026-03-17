"use client"

import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react"
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
  original_price: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a non-negative integer.",
  }),
  badge: z.string().optional(),
  images: z.array(z.string()).default([]),
  specs: z.array(z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required")
  })).default([]),
})

type ProductFormValues = z.infer<typeof productSchema>

type Props = {
  initialData?: ProductFormValues & { id: string }
}

export function ProductForm({ initialData }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Initialize Supabase client
  const supabase = createClient()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      specs: Object.entries(initialData.specs || {}).map(([key, value]) => ({
        key,
        value: String(value)
      }))
    } : {
      name: "",
      brand: "",
      description: "",
      price: 0,
      original_price: null,
      stock: 0,
      badge: "",
      images: [],
      specs: [],
    },
  })

  // Watch images to render previews
  const images = form.watch("images")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      console.log('Starting image upload for', files.length, 'files')
      for (const file of Array.from(files)) {
        console.log('Uploading file:', file.name, 'size:', file.size)
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        console.log('Target path:', filePath)
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Supabase upload error:', uploadError)
          throw uploadError
        }

        console.log('Upload successful, generating public URL...')
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        console.log('Public URL:', publicUrl)
        uploadedUrls.push(publicUrl)
      }

      // Add new URLs to existing images
      const currentImages = form.getValues("images")
      form.setValue("images", [...currentImages, ...uploadedUrls])
      toast.success("Images uploaded successfully")
    } catch (error: any) {
      console.error('Full upload error context:', error)
      toast.error(`Upload failed: ${error.message || "Unknown error"}`)
    } finally {
      console.log('Upload process finished')
      setIsUploading(false)
      // Reset input value to allow selecting same file again
      e.target.value = ''
    }
  }

  const removeImage = (urlToRemove: string) => {
    const currentImages = form.getValues("images")
    const newImages = currentImages.filter((url) => url !== urlToRemove)
    form.setValue("images", newImages)
  }

  const addSpec = () => {
    const currentSpecs = form.getValues("specs")
    form.setValue("specs", [...currentSpecs, { key: "", value: "" }])
  }

  const removeSpec = (index: number) => {
    const currentSpecs = form.getValues("specs")
    form.setValue("specs", currentSpecs.filter((_, i) => i !== index))
  }

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)

    try {
      // Get current user (seller)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("You must be logged in to create a product")
        return
      }

      // Convert specs array to object
      const specsObject = data.specs.reduce((acc, spec) => {
        acc[spec.key] = spec.value
        return acc
      }, {} as Record<string, string>)

      const productData = {
        name: data.name,
        brand: data.brand,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        stock: data.stock,
        badge: data.badge,
        images: data.images,
        specs: specsObject,
        seller_id: user.id,
      }

      if (initialData) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id)

        if (error) throw error
        toast.success("Product updated successfully")
      } else {
        // Create new product
        const { error } = await supabase.from("products").insert(productData)

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Brand (e.g. ASUS, Apple)" {...field} />
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
                <FormLabel>Price (LKR)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormDescription>Used to show discounts (e.g. Strike through price)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New, Sale, Hot" {...field} />
                </FormControl>
                <FormDescription>A small badge displayed on the product card</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell customers about this laptop..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Technical Specifications</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpec}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Spec
            </Button>
          </div>
          {form.watch("specs").map((_, index) => (
            <div key={index} className="flex gap-4 items-start">
              <FormField
                control={form.control}
                name={`specs.${index}.key`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Label (e.g. RAM)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`specs.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Value (e.g. 16GB)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSpec(index)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {form.watch("specs").length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-md">
              No specifications added yet. Add specs like Processor, RAM, SSD, etc.
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <FormLabel>Images</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((url, index) => (
              <div key={index} className="relative aspect-square border rounded-md overflow-hidden bg-muted group">
                <img
                  src={url}
                  alt="Product Image"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-sidebar-primary/50 hover:bg-sidebar-accent/5 transition-colors">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Upload Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
          <FormDescription>
            Upload one or more product images. First image will be the main one.
          </FormDescription>
        </div>

        <Button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialData ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </Form>
  )
}
