"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Address, AddressService } from "@/services/address-service";
import { createClient } from "@/lib/supabase/client";
import { Plus, MapPin, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { AddressForm } from "./address-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddressListProps {
  userId: string;
}

export function AddressList({ userId }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AddressService.getAddresses(supabase, userId);
      setAddresses(data);
    } catch (error: any) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, [supabase, userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSetDefault = async (addressId: string) => {
    try {
      await AddressService.setDefaultAddress(supabase, userId, addressId);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error: any) {
      toast.error("Failed to update default address");
    }
  };

  const handleDelete = async () => {
    if (!deletingAddressId) return;
    try {
      await AddressService.deleteAddress(supabase, deletingAddressId);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error: any) {
      toast.error("Failed to delete address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">My Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping addresses for faster checkout.
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <div className="col-span-full border border-dashed border-border rounded-lg p-12 text-center bg-muted/30">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h4 className="text-lg font-medium mb-1">No addresses found</h4>
            <p className="text-muted-foreground mb-4">
              Add your first shipping address to get started.
            </p>
            <Button variant="outline" onClick={handleAddNew}>
              Add Your First Address
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`relative border rounded-lg p-5 transition-all hover:shadow-md ${
                address.is_default
                  ? "border-primary/50 bg-primary/5 shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              {address.is_default && (
                <div className="absolute top-4 right-4 text-primary flex items-center gap-1.5 text-xs font-semibold bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Default
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`w-4 h-4 ${address.is_default ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-foreground">
                      {address.city}, {address.state}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1 mb-4">
                    <p>{address.street_line_1}</p>
                    {address.street_line_2 && <p>{address.street_line_2}</p>}
                    <p>{address.postal_code}, {address.country}</p>
                    {address.phone && <p className="pt-1 text-foreground/80 font-medium">Phone: {address.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1.5 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs flex items-center gap-1.5 px-2 text-destructive hover:text-destructive hover:bg-destructive/5"
                    onClick={() => setDeletingAddressId(address.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs ml-auto border-primary/20 hover:bg-primary/5 text-primary"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <AddressForm
            userId={userId}
            initialData={editingAddress}
            onSuccess={() => {
              setIsFormOpen(false);
              fetchAddresses();
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingAddressId}
        onOpenChange={(open) => !open && setDeletingAddressId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This address will be permanently deleted from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete Address
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
