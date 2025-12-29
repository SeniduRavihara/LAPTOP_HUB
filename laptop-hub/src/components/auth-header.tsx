import Link from 'next/link'

export function AuthHeader() {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">T</span>
        </div>
        <span className="text-xl font-bold text-foreground">TechHub</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Don't have an account?</span>
      </div>
    </div>
  )
}
