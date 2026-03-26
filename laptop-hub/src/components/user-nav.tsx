"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User, LayoutDashboard, ShoppingBag, UserCircle, LogOut, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";

export function UserNav() {
  const { user, role, signOut } = useAuth();

  if (!user) return null;

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";
  const userEmail = user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center border border-border/50 shadow-sm transition-all hover:scale-105 active:scale-95">
          <span className="text-sm font-bold text-primary">{userInitial}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {role === 'admin' && (
            <Link href="/admin/dashboard">
              <DropdownMenuItem className="cursor-pointer text-primary font-semibold focus:bg-primary/10">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          )}
          {role === 'seller' && (
            <Link href="/seller/dashboard">
              <DropdownMenuItem className="cursor-pointer text-primary font-semibold focus:bg-primary/10">
                <Store className="mr-2 h-4 w-4" />
                <span>Seller Dashboard</span>
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile?tab=orders">
            <DropdownMenuItem className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
