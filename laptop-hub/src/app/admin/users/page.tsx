'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: 'Buyer' | 'Seller'
  status: 'Active' | 'Pending' | 'Suspended'
  joined: string
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Buyer',
    password: ''
  })

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Buyer',
      status: 'Active',
      joined: 'Jan 12, 2025'
    },
    {
      id: 2,
      name: 'David Kim',
      email: 'david.k@example.com',
      role: 'Seller',
      status: 'Pending',
      joined: 'Jan 18, 2025'
    },
    {
      id: 3,
      name: 'Emily Carter',
      email: 'emily@shopify.com',
      role: 'Buyer',
      status: 'Suspended',
      joined: 'Feb 02, 2025'
    },
    {
      id: 4,
      name: 'Marcus Brown',
      email: 'marcus@prosales.com',
      role: 'Seller',
      status: 'Active',
      joined: 'Feb 10, 2025'
    }
  ])

  const flaggedCount = users.filter(u => u.status === 'Suspended' || u.status === 'Pending').length

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default'
      case 'Pending':
        return 'secondary'
      case 'Suspended':
        return 'destructive'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-50'
      case 'Pending':
        return 'text-orange-600 bg-orange-50'
      case 'Suspended':
        return 'text-red-600 bg-red-50'
      default:
        return ''
    }
  }

  const handleAddUser = () => {
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'Buyer' | 'Seller',
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    }
    setUsers([...users, user])
    setIsAddUserOpen(false)
    setNewUser({ name: '', email: '', role: 'Buyer', password: '' })
  }

  const handleRestrict = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Suspended' ? 'Active' : 'Suspended' as 'Active' | 'Suspended' }
        : user
    ))
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <AdminSidebar />

      {/* Header */}
      <div className="ml-64 bg-white border-b">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">ADMIN</p>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage every buyer & seller account across the marketplace.
              </p>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account for the marketplace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buyer">Buyer</SelectItem>
                        <SelectItem value="Seller">Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#0A1E5B] hover:bg-[#0A1E5B]/90"
                    onClick={handleAddUser}
                    disabled={!newUser.name || !newUser.email || !newUser.password}
                  >
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="ml-64 p-8">
        <div className="bg-white rounded-lg border">
          {/* Stats Header */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {flaggedCount} flagged accounts this week
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">User</TableHead>
                <TableHead className="font-semibold text-gray-700">Role</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Joined</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{user.role}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(user.status)} border-0 font-medium`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-700">
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        className={`${
                          user.status === 'Suspended' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-red-600 hover:bg-red-700'
                        } text-white`}
                        onClick={() => handleRestrict(user.id)}
                      >
                        {user.status === 'Suspended' ? 'Activate' : 'Restrict'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </>
  )
}
