"use client"

import { createClient } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus, Trash2, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"
import { ProductService } from "@/services/product-service"
import { AuctionService } from "@/services/auction-service"

const numericOptional = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : val),
  z.coerce.number().nullable().optional()
);

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  brand: z.string().min(2, {
    message: "Brand must be at least 2 characters.",
  }),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  original_price: numericOptional,
  stock: z.coerce.number().int().min(0, {
    message: "Stock must be a non-negative integer.",
  }),
  badge: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  specs: z.array(z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required")
  })).default([]),
  isAuction: z.boolean().default(false),
  starting_bid: z.coerce.number().min(0).optional(),
  reserve_price: numericOptional,
  start_time: z.date().optional().nullable(),
  end_time: z.date().optional().nullable(),
})

type ProductFormValues = z.infer<typeof productSchema>

type Props = {
  initialData?: any
}


export function ProductForm({ initialData }: Props) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  useEffect(() => {
    if (initialData?.images) {
      console.log('Initial Images:', initialData.images)
    }
    
    // Diagnostic: List all buckets
    const checkBuckets = async () => {
      console.log('Checking available storage buckets...')
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) {
        console.error('Error listing buckets:', error)
      } else {
        console.log('Available buckets:', buckets.map((b: any) => `${b.name} (Public: ${b.public})`))
      }
    }
    checkBuckets()
  }, [initialData])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      ...initialData,
      description: initialData.description ?? "",
      original_price: initialData.original_price ?? "",
      badge: initialData.badge ?? "",
      images: initialData.images || [],
      specs: initialData.specs ? Object.entries(initialData.specs).map(([key, value]) => ({
        key,
        value: String(value)
      })) : [],
      isAuction: !!initialData.auction && (Array.isArray(initialData.auction) ? initialData.auction.length > 0 : true),
      starting_bid: (Array.isArray(initialData.auction) ? initialData.auction[0]?.starting_bid : initialData.auction?.starting_bid) ?? 0,
      reserve_price: (Array.isArray(initialData.auction) ? initialData.auction[0]?.reserve_price : initialData.auction?.reserve_price) ?? "",
      start_time: (Array.isArray(initialData.auction) ? (initialData.auction[0]?.start_time ? new Date(initialData.auction[0].start_time) : null) : (initialData.auction?.start_time ? new Date(initialData.auction.start_time) : null)),
      end_time: (Array.isArray(initialData.auction) ? (initialData.auction[0]?.end_time ? new Date(initialData.auction[0].end_time) : null) : (initialData.auction?.end_time ? new Date(initialData.auction.end_time) : null)),
    } : {
      name: "",
      brand: "",
      description: "",
      price: 0,
      original_price: "",
      stock: 0,
      badge: "",
      images: [],
      specs: [],
      isAuction: false,
      starting_bid: 0,
      reserve_price: "",
      start_time: null,
      end_time: null,
    },
  })

  // Watch images to render previews
  const images = form.watch("images")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (!user) {
      toast.error("You must be logged in to upload images")
      return
    }

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      console.log('Starting image upload workflow...')
      const filesArray = Array.from(files)
      
      for (const file of filesArray) {
        try {
          console.log(`Uploading file: ${file.name}...`)
          const publicUrl = await ProductService.uploadImage(supabase, file, user.id)
          uploadedUrls.push(publicUrl)
          console.log('Upload successful:', publicUrl)
        } catch (error: any) {
          console.error(`Error uploading file ${file.name}:`, error)
          toast.error(`Failed to upload ${file.name}: ${error.message}`)
        }
      }

      if (uploadedUrls.length > 0) {
        const currentImages = form.getValues("images")
        form.setValue("images", [...currentImages, ...uploadedUrls])
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`)
      }
    } catch (error: any) {
      console.error('Critical upload process error:', error)
      toast.error("Upload process encountered an error")
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ''
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
    if (!user) {
      toast.error("You must be logged in to save a product")
      return
    }

    setIsLoading(true)
    try {
      // Convert specs array to object
      const specsObject = data.specs.reduce((acc, spec) => {
        acc[spec.key] = spec.value
        return acc
      }, {} as Record<string, string>)

      const productData = {
        name: data.name,
        brand: data.brand,
        description: data.description || null,
        price: data.price,
        original_price: data.original_price ?? null,
        stock: data.stock,
        badge: data.badge || null,
        images: data.images,
        specs: specsObject,
        seller_id: user.id,
      }

      let productId = initialData?.id

      if (initialData?.id) {
        await ProductService.updateProduct(supabase, initialData.id, productData as any)
      } else {
        const newProduct: any = await ProductService.createProduct(supabase, productData as any)
        productId = newProduct.id
      }

      // Handle Auction creation/update via AuctionService
      if (data.isAuction) {
        const auctionData = {
          product_id: productId!,
          seller_id: user.id,
          starting_bid: data.starting_bid || 0,
          reserve_price: data.reserve_price ?? null,
          start_time: data.start_time?.toISOString() || null,
          end_time: data.end_time?.toISOString() || null,
          status: 'active' as const
        }

        const existingAuction = Array.isArray(initialData?.auction) ? initialData.auction[0] : initialData?.auction

        if (existingAuction) {
          await AuctionService.updateAuction(supabase, existingAuction.id, auctionData)
        } else {
          await AuctionService.createAuction(supabase, auctionData)
        }
      } else {
        const existingAuction = Array.isArray(initialData?.auction) ? initialData.auction[0] : initialData?.auction
        if (existingAuction) {
          await AuctionService.cancelAuction(supabase, existingAuction.id)
        }
      }

      toast.success(initialData?.id ? "Product updated successfully" : "Product created successfully")
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      console.error("Submission error:", error)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Brand (e.g. ASUS, Apple)" {...field} value={field.value ?? ""} />
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
                  <Input type="number" placeholder="0.00" step="0.01" {...field} value={field.value ?? 0} />
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
                    value={field.value ?? ""} 
                  />
                </FormControl>
                <FormDescription>Used to show discounts (e.g. Strike through price)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} value={field.value ?? 0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Badge (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New, Sale, Hot" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormDescription>A small badge displayed on the product card</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell customers about this laptop..."
                    className="min-h-[120px]"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                      <Input placeholder="Label (e.g. RAM)" {...field} value={field.value ?? ""} />
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
                      <Input placeholder="Value (e.g. 16GB)" {...field} value={field.value ?? ""} />
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

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Auction Settings</FormLabel>
              <FormDescription>
                Enable this to list this product for auction.
              </FormDescription>
            </div>
            <FormField
              control={form.control}
              name="isAuction"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {form.watch("isAuction") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
              <FormField
                control={form.control}
                name="starting_bid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Bid (LKR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" step="0.01" {...field} value={field.value ?? 0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reserve_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserve Price (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        step="0.01" 
                        {...field} 
                        value={field.value ?? ""} 
                      />
                    </FormControl>
                    <FormDescription>Minimum price to win the auction</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <= (form.getValues("start_time") || new Date())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading || isUploading} className="w-full md:w-auto">
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
