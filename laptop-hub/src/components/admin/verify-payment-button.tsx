"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { verifyOrderPayment } from "@/app/actions/admin-orders";
import { toast } from "sonner";

interface VerifyPaymentButtonProps {
  paymentReference: string;
  isPaid: boolean;
}

export function VerifyPaymentButton({ paymentReference, isPaid }: VerifyPaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  if (isPaid) {
    return (
      <div className="flex items-center text-green-600 gap-1.5 text-xs font-medium">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Verified</span>
      </div>
    );
  }

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await verifyOrderPayment(paymentReference);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleVerify}
      disabled={loading}
      className="h-7 px-2 text-[10px] gap-1.5 font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all active:scale-95 border border-transparent hover:border-primary/20"
      title="Verify payment status with PayHere"
    >
      <RefreshCcw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
      <span className="hidden lg:inline">{loading ? "Verifying..." : "Verify Payment"}</span>
    </Button>
  );
}
