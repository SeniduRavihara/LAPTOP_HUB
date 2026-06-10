import * as z from "zod"

const numericOptional = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? null : val),
  z.coerce.number().min(0, { message: "Must be 0 or greater" }).nullable().optional()
)

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  brand: z.string().min(1, { message: "Brand is required." }),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  original_price: numericOptional,
  stock: z.coerce.number().int().min(0, { message: "Stock must be a non-negative integer." }),
  badge: z.string().optional().nullable(),
  images: z.array(z.string()).max(5, "Maximum 5 images allowed").default([]),
  specs: z
    .array(z.object({ key: z.string().min(1, "Key is required"), value: z.string().min(1, "Value is required") }))
    .default([]),
  isAuction: z.boolean().default(false),
  starting_bid: z.coerce.number().min(0).optional(),
  reserve_price: numericOptional,
  start_time: z.date().optional().nullable(),
  end_time: z.date().optional().nullable(),
}).superRefine((data, ctx) => {
  if (!data.isAuction) return

  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime())

  if (!data.starting_bid || data.starting_bid <= 0)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Starting bid is required and must be greater than 0", path: ["starting_bid"] })

  if (data.reserve_price != null && data.starting_bid != null && data.reserve_price < data.starting_bid)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Reserve price must be ≥ starting bid", path: ["reserve_price"] })

  if (!data.start_time || !isValidDate(data.start_time))
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start time is required for auction listings", path: ["start_time"] })

  if (!data.end_time || !isValidDate(data.end_time))
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End time is required for auction listings", path: ["end_time"] })

  if (isValidDate(data.start_time) && isValidDate(data.end_time) && data.end_time! <= data.start_time!)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "End time must be after start time", path: ["end_time"] })
})

export type ProductFormValues = z.infer<typeof productSchema>
