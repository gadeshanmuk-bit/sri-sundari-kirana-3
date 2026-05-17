'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getOrders, getProducts, getCustomRequests, updateOrderStatus } from '@/lib/firebase-db'
import type { Order, Product, CustomRequest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Store,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  LogOut,
  Loader2,
  MoreHorizontal,
  Phone,
  MapPin,
  Eye,
  RefreshCw,
  MessageSquare,
  IndianRupee,
  Box,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customRequests, setCustomRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sundari-owner-panel')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [ordersData, productsData, requestsData] = await Promise.all([
        getOrders(),
        getProducts(),
        getCustomRequests(),
      ])
      setOrders(ordersData)
      setProducts(productsData)
      setCustomRequests(requestsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
    toast.success('Data refreshed')
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/sundari-owner-panel')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter((order) => order.status === statusFilter)

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30"><Truck className="h-3 w-3 mr-1" />Processing</Badge>
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    processingOrders: orders.filter((o) => o.status === 'processing').length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
    totalRevenue: orders.filter((o) => o.status === 'delivered').reduce((acc, o) => acc + o.totalAmount, 0),
    totalProducts: products.length,
    customRequests: customRequests.filter((r) => r.status === 'pending').length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Sri Sundari Admin</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/sundari-owner-panel/products">
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-1" />
                  Products
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.processingOrders}</p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <IndianRupee className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <Box className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.customRequests}</p>
                  <p className="text-xs text-muted-foreground">Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Orders
              </CardTitle>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <a
                              href={`tel:${order.phoneNumber}`}
                              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              {order.phoneNumber}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {order.items.length} item(s)
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {order.items.map((i) => i.product.name).join(', ')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          Rs. {order.totalAmount.toFixed(0)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(order.createdAt, 'dd/MM/yy HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(order.id, 'pending')}
                                disabled={order.status === 'pending'}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Mark Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(order.id, 'processing')}
                                disabled={order.status === 'processing'}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Mark Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(order.id, 'delivered')}
                                disabled={order.status === 'delivered'}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Delivered
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Requests */}
        {customRequests.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Custom Item Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customRequests.slice(0, 5).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between p-4 bg-secondary/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{request.customerName}</p>
                      <a
                        href={`tel:${request.phoneNumber}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {request.phoneNumber}
                      </a>
                      <p className="text-sm mt-2">{request.itemDescription}</p>
                      {request.quantity && (
                        <p className="text-xs text-muted-foreground">Qty: {request.quantity}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={request.status === 'pending' ? 'outline' : 'secondary'}>
                        {request.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(request.createdAt, 'dd/MM/yy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
