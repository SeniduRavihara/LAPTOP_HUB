import { AuthHeader } from "@/components/auth-header";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AuthHeader />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Please enter your details.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
