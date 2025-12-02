import { AuthHeader } from "@/components/auth-header";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:block relative h-full w-full">
        <div className="absolute inset-0 bg-zinc-900" />
        <img
          src="/auth-hero.png"
          alt="Authentication background"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2 font-medium text-lg">
            <div className="w-8 h-8 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center">
              <span className="font-bold">L</span>
            </div>
            LaptopHub
          </div>
          <div className="space-y-2">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;The best place to buy and sell premium laptops. Secure, fast, and reliable.&rdquo;
              </p>
              <footer className="text-sm text-white/80">Senidu Ravihara</footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
