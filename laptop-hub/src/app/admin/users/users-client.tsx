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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UsersClientProps {
    initialUsers: any[]
}

export function UsersClient({ initialUsers }: UsersClientProps) {
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredUsers = useMemo(() => {
        return initialUsers.filter((user) => {
            const name = (user.name || "").toLowerCase()
            const email = (user.email || "").toLowerCase()
            const searchTerm = search.toLowerCase()
            const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm)
            const matchesRole = roleFilter === "all" || user.role === roleFilter

            return matchesSearch && matchesRole
        })
    }, [initialUsers, search, roleFilter])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                </Select>

                {(search || roleFilter !== "all") && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearch("")
                            setRoleFilter("all")
                        }}
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
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[80px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {user.name?.slice(0, 2).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{user.name || "Unknown"}</span>
                                        <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-32 text-muted-foreground italic">
                                    No users found matching your filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
