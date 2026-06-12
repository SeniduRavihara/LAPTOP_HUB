"use client"

import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2, Plus, Upload, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import { adminCreateProduct, adminUpdateProduct } from "@/app/actions/product"
import { adminCreateAuction, adminUpdateAuction, adminCancelAuction } from "@/app/actions/auction"
import { ProductService } from "@/services/product-service"

import { LAPTOP_BRANDS, SPEC_DEFINITIONS } from "./constants"
import { productSchema, type ProductFormValues } from "./schema"
import { SearchableSelect } from "./searchable-select"
import { SpecRow } from "./spec-row"
import { SpecTypePickerModal } from "./spec-type-picker-modal"

type Props = { initialData?: any }

export function ProductForm({ initialData }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [specPickerOpen, setSpecPickerOpen] = useState(false)

  useEffect(() => {
    if (initialData?.images) console.log("Initial Images:", initialData.images)
    const checkBuckets = async () => {
      const { data: buckets, error } = await supabase.storage.listBuckets()
      if (error) console.error("Error listing buckets:", error)
      else console.log("Buckets:", buckets.map((b: any) => b.name))
    }
    checkBuckets()
  }, [initialData])

  const parseInitialSpecs = (rawSpecs: any): { key: string; value: string }[] => {
    if (!rawSpecs) return []
    if (Array.isArray(rawSpecs)) return rawSpecs
    return Object.entries(rawSpecs).map(([key, value]) => ({ key, value: String(value) }))
  }

  const getActiveOrLatestAuction = () => {
    const auctions = initialData?.auction
    if (!auctions) return null
    if (Array.isArray(auctions)) {
      return auctions.find((a: any) => a.status === 'active') || auctions[0]
    }
    return auctions
  }
  const targetAuction = getActiveOrLatestAuction()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description ?? "",
          original_price: initialData.original_price ?? "",
          badge: initialData.badge ?? "",
          images: initialData.images || [],
          specs: parseInitialSpecs(initialData.specs),
          isAuction: !!(targetAuction && targetAuction.status === 'active'),
          starting_bid: targetAuction?.starting_bid ?? 0,
          reserve_price: targetAuction?.reserve_price ?? "",
          start_time: targetAuction?.start_time ? new Date(targetAuction.start_time) : null,
          end_time: targetAuction?.end_time ? new Date(targetAuction.end_time) : null,
        }
      : {
          name: "", brand: "", description: "", price: 0, original_price: "",
          stock: 0, badge: "", images: [], specs: [], isAuction: false,
          starting_bid: 0, reserve_price: "", start_time: null, end_time: null,
        },
  })

  const images = form.watch("images")
  const specs = form.watch("specs")
  const usedSpecKeys = specs.map((s) => s.key).filter((k) => k !== "custom" && !!SPEC_DEFINITIONS[k])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (!user) { toast.error("You must be logged in to upload images"); return }
    
    const currentImages = form.getValues("images")
    const remainingSlots = 5 - currentImages.length
    
    if (remainingSlots <= 0) {
      toast.error("Maximum 5 images allowed")
      if (e.target) e.target.value = ""
      return
    }
    
    const filesToUpload = Array.from(files).slice(0, remainingSlots)
    if (files.length > remainingSlots) {
      toast.warning(`Only the first ${remainingSlots} image(s) will be uploaded to stay within the limit of 5.`)
    }
    
    setIsUploading(true)
    const uploadedUrls: string[] = []
    try {
      for (const file of filesToUpload) {
        try {
          const publicUrl = await ProductService.uploadImage(file, user.id)
          uploadedUrls.push(publicUrl)
        } catch (error: any) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`)
        }
      }
      if (uploadedUrls.length > 0) {
        form.setValue("images", [...currentImages, ...uploadedUrls])
        toast.success(`Uploaded ${uploadedUrls.length} image(s)`)
      }
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ""
    }
  }

  const removeImage = (url: string) =>
    form.setValue("images", form.getValues("images").filter((u) => u !== url))

  const handleAddSpec = (key: string) => {
    form.setValue("specs", [...specs, { key, value: "" }])
  }

  const removeSpec = (index: number) =>
    form.setValue("specs", specs.filter((_, i) => i !== index))

  const updateSpecKey = (index: number, key: string) => {
    const updated = [...specs]
    updated[index] = { ...updated[index], key }
    form.setValue("specs", updated)
  }

  const updateSpecValue = (index: number, value: string) => {
    const updated = [...specs]
    updated[index] = { ...updated[index], value }
    form.setValue("specs", updated)
  }

  async function onSubmit(data: ProductFormValues) {
    if (!user) { toast.error("You must be logged in"); return }
    setIsLoading(true)
    try {
      const specsObject = data.specs.reduce((acc, spec) => {
        acc[spec.key] = spec.value
        return acc
      }, {} as Record<string, string>)

      const productData = {
        name: data.name, brand: data.brand,
        description: data.description || null,
        price: data.price, original_price: data.original_price ?? null,
        stock: data.stock, badge: data.badge || null,
        images: data.images, specs: specsObject,
        seller_id: initialData?.seller_id || user.id,
      }

      let productId = initialData?.id
      let result = initialData?.id
        ? await adminUpdateProduct(initialData.id, productData)
        : await adminCreateProduct(productData)

      if (!result.success) throw new Error(result.error || "Failed to save product")
      if (!initialData?.id) productId = result.data.id

      if (data.isAuction) {
        if (!data.start_time || !data.end_time) throw new Error("Auction times required")
        const auctionData = {
          product_id: productId!,
          seller_id: initialData?.seller_id || user.id,
          starting_bid: data.starting_bid || 0,
          reserve_price: data.reserve_price ?? null,
          start_time: data.start_time.toISOString(),
          end_time: data.end_time.toISOString(),
          status: "active" as const,
        }
        const auctions = initialData?.auction
        const existingAuction = Array.isArray(auctions)
          ? auctions.find((a: any) => a.status === 'active')
          : auctions
        const auctionResult = existingAuction
          ? await adminUpdateAuction(existingAuction.id, auctionData)
          : await adminCreateAuction(auctionData)
        if (!auctionResult.success) throw new Error(auctionResult.error || "Failed to save auction")
      } else {
        const auctions = initialData?.auction
        const existingAuction = Array.isArray(auctions)
          ? auctions.find((a: any) => a.status === 'active')
          : auctions
        if (existingAuction) {
          const cancelResult = await adminCancelAuction(existingAuction.id)
          if (!cancelResult.success) throw new Error(cancelResult.error || "Failed to cancel auction")
        }
      }

      toast.success(initialData?.id ? "Product updated" : "Product created")
      const redirectPath = pathname.startsWith("/seller") ? "/seller/products" : "/admin/products"
      router.push(redirectPath)
      router.refresh()
    } catch (error: any) {
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
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ASUS ROG Zephyrus G14" {...field} value={field.value ?? ""} />
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
                  <SearchableSelect
                    options={LAPTOP_BRANDS}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Select brand..."
                    allowCustom
                  />
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
                <FormLabel>Original Price <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" step="0.01" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormDescription>Strike-through price to show discount</FormDescription>
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
                <FormLabel>Badge <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New, Sale, Hot" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormDescription>Small label shown on the product card</FormDescription>
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <FormLabel className="text-base">Technical Specifications</FormLabel>
              <p className="text-sm text-muted-foreground mt-0.5">
                Add structured specs so filters work correctly
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSpecPickerOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Spec
            </Button>
          </div>

          <div className="space-y-2">
            {specs.map((spec, index) => (
              <SpecRow
                key={index}
                specKey={spec.key}
                specValue={spec.value}
                onKeyChange={(v) => updateSpecKey(index, v)}
                onValueChange={(v) => updateSpecValue(index, v)}
                onRemove={() => removeSpec(index)}
              />
            ))}
            {specs.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-xl">
                <p className="font-medium">No specifications added yet</p>
                <p className="text-xs mt-1">Click &ldquo;Add Spec&rdquo; to add CPU, RAM, Storage and more</p>
              </div>
            )}
          </div>

          {form.formState.errors.specs && (
            <p className="text-sm text-destructive">
              {typeof form.formState.errors.specs === "object" && "message" in form.formState.errors.specs
                ? (form.formState.errors.specs as any).message
                : "Please fix spec errors above"}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <FormLabel className="text-base">Product Images</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative aspect-square border rounded-xl overflow-hidden bg-muted group">
                <img src={url} alt="Product" className="object-cover w-full h-full" />
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 font-medium">
                    MAIN
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-accent/10 transition-colors">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground mb-1.5" />
                    <span className="text-xs text-muted-foreground text-center leading-tight px-2">
                      Upload<br />Image
                    </span>
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
            )}
          </div>
          <FormDescription>Up to 5 images. First image is the main one.</FormDescription>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <FormLabel className="text-base">Auction Settings</FormLabel>
              <FormDescription>Enable to list this product for auction</FormDescription>
            </div>
            <FormField
              control={form.control}
              name="isAuction"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {form.watch("isAuction") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl bg-muted/20">
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
                    <FormLabel>Reserve Price <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" step="0.01" {...field} value={field.value ?? ""} />
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
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date <= (form.getValues("start_time") || new Date())}
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

        <SpecTypePickerModal
          open={specPickerOpen}
          onClose={() => setSpecPickerOpen(false)}
          onSelect={handleAddSpec}
          usedKeys={usedSpecKeys}
        />

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
