"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [userRole, setUserRole] = useState<"customer" | "seller">("customer");
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          role: userRole,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Sign up as
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setUserRole("customer")}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              userRole === "customer"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-border/50"
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setUserRole("seller")}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              userRole === "seller"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-border/50"
            }`}
          >
            Seller
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        <Input
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirm Password
        </label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full"
          required
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <Checkbox
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
          className="mt-1"
        />
        <span className="text-sm text-muted-foreground">
          I agree to the{" "}
          <Link href="/terms" className="text-accent hover:text-accent/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-accent hover:text-accent/80">
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg font-medium transition-colors"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          className="border border-border bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border border-border bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors"
        >
          Facebook
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent hover:text-accent/80 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
