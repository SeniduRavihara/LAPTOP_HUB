"use client"

import { useState, useMemo } from "react"
import { UserRoleSelect } from "@/components/admin/user-role-select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SellersClientProps {
    initialSellers: any[]
}

export function SellersClient({ initialSellers }: SellersClientProps) {
    const [search, setSearch] = useState("")

    const filteredSellers = useMemo(() => {
        return initialSellers.filter((seller) => {
            const name = (seller.name || "").toLowerCase()
            const email = (seller.email || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            
            return name.includes(searchTerm) || email.includes(searchTerm)
        })
    }, [initialSellers, search])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search sellers by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {search && (
                    <Button
                        variant="ghost"
                        onClick={() => setSearch("")}
                        className="h-10 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[80px] font-semibold">Avatar</TableHead>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Rating</TableHead>
                            <TableHead className="font-semibold">Joined</TableHead>
                            <TableHead className="font-semibold">Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSellers.map((seller) => (
                            <TableRow key={seller.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                            {seller.name?.slice(0, 2).toUpperCase() || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{seller.name || "Unknown"}</span>
                                        <span className="text-xs text-muted-foreground">{seller.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={seller.rate ? "font-semibold text-yellow-600" : "text-muted-foreground text-sm italic"}>
                                        {seller.rate || "N/A"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(seller.created_at).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </TableCell>
                                <TableCell>
                                    <UserRoleSelect userId={seller.id} currentRole={seller.role} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredSellers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">
                                    No sellers found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
