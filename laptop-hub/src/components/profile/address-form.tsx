"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Address, AddressService } from "@/services/address-service";
import { createClient } from "@/lib/supabase/client";

const addressSchema = z.object({
  street_line_1: z.string().min(1, "Address is required"),
  street_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  phone: z.string().min(1, "Phone number is required"),
  is_default: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  userId: string;
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddressForm({ userId, initialData, onSuccess, onCancel }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street_line_1: initialData?.street_line_1 || "",
      street_line_2: initialData?.street_line_2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      postal_code: initialData?.postal_code || "",
      phone: initialData?.phone || "",
      is_default: initialData?.is_default || false,
    },
  });

  const isDefault = watch("is_default");

  const onSubmit = async (data: AddressFormValues) => {
    setLoading(true);
    try {
      if (initialData?.id) {
        await AddressService.updateAddress(supabase, initialData.id, {
          ...data,
          user_id: userId,
        });
        toast.success("Address updated successfully");
      } else {
        await AddressService.createAddress(supabase, {
          ...data,
          user_id: userId,
          country: "Sri Lanka",
        });
        toast.success("Address added successfully");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="street_line_1">Address Line 1</Label>
          <Input
            id="street_line_1"
            {...register("street_line_1")}
            placeholder="123 Main St"
          />
          {errors.street_line_1 && (
            <p className="text-xs text-red-500">{errors.street_line_1.message}</p>
          )}
        </div>

        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label htmlFor="street_line_2">Address Line 2 (Optional)</Label>
          <Input
            id="street_line_2"
            {...register("street_line_2")}
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register("city")} placeholder="Colombo" />
          {errors.city && (
            <p className="text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State / Province</Label>
          <Input id="state" {...register("state")} placeholder="Western" />
          {errors.state && (
            <p className="text-xs text-red-500">{errors.state.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input id="postal_code" {...register("postal_code")} placeholder="10100" />
          {errors.postal_code && (
            <p className="text-xs text-red-500">{errors.postal_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...register("phone")} placeholder="+94 7X XXX XXXX" />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="is_default"
          checked={isDefault}
          onCheckedChange={(checked) => setValue("is_default", checked as boolean)}
        />
        <Label htmlFor="is_default" className="text-sm cursor-pointer font-normal">
          Set as default address
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Address" : "Add Address"}
        </Button>
      </div>
    </form>
  );
}
