"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { AuthService } from "@/services/auth-service";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setLoading(true);
    try {
      await AuthService.updatePassword(data.password);
      await AuthService.signOut();
      toast.success("Password updated! Please sign in with your new password.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm">
      {/* New password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          New Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`w-full pl-9 pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={`w-full pl-9 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Password rules hint */}
      <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
        <li>At least 8 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one number</li>
      </ul>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg font-medium transition-colors"
      >
        {loading ? "Updating…" : "Set New Password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="text-accent hover:text-accent/80 font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
