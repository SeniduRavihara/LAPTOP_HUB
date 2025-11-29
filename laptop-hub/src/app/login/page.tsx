"use client";

import { AuthHeader } from "@/components/auth-header";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back! Please enter your details.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
