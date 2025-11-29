"use client";

import { AuthHeader } from "@/components/auth-header";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join LaptopHub and start buying or selling today.
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
