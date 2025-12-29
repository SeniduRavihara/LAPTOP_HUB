import { AuthHeader } from "@/components/auth-header";
import { SignupForm } from "@/components/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:block relative h-full w-full">
        <div className="absolute inset-0 bg-zinc-900" />
        <img
          src="/msi-gaming-laptop.jpg"
          alt="Authentication background"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="relative z-20 flex h-full flex-col justify-between p-10 text-white">
          <Link href='/' className='flex items-center gap-2 flex-shrink-0'>
						<div className='w-10 h-10 bg-[#0A1E5B] rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-lg'>T</span>
						</div>
						<span className='text-xl font-bold text-white-900'>
							TechHub
						</span>
					</Link>
          <div className="space-y-2">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Join our community of tech enthusiasts. Find your perfect machine or sell your old one.&rdquo;
              </p>
              <footer className="text-sm text-white/80">The Team</footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[400px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
