'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
 import Link from'next/link';
import { useAuth } from '@/lib/auth-context';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory,  } from '@/lib/firebase-db';
import { categories as defaultCategories } from '@/lib/products-data';
import type { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, ArrowLeft, Plus, Edit, Trash2, Loader2, Search, LogOut, Tags, RefreshCw,  } from 'lucide-react';
import { toast } from 'sonner';

const categoryEmojis: Record<string, string> = {
  'rice-grains': '🌾',
  'pulses-dal': '🫘',
  'spices': '🌶️',
  'oils': '🫒',
  'flour': '🌾',
  'sugar-salt': '🧂',
  'tea-coffee': '☕',
  'snacks': '🍪',
  'dairy': '🥛',
  'personal-care': '🧴',
  'cleaning': '🧹',
  'pooja': '🪔',
}

export default function ProductsManagement() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  
  // Product Dialog
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    nameTelugu: '',
    category: '',
    basePrice: '',
    unit: 'kg',
    description: '',
    inStock: true,
  })

  // Category Dialog
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameTelugu: '',
    icon: '',
    order: '',
  })

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
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ])
      setProducts(productsData)
      setCategories(categoriesData.length > 0 ? categoriesData : defaultCategories)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
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

  // Product CRUD
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name,
        nameTelugu: product.nameTelugu,
        category: product.category,
        basePrice: product.basePrice.toString(),
        unit: product.unit,
        description: product.description || '',
        inStock: product.inStock,
      })
    } else {
      setEditingProduct(null)
      setProductForm({
        name: '',
        nameTelugu: '',
        category: '',
        basePrice: '',
        unit: 'kg',
        description: '',
        inStock: true,
      })
    }
    setProductDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.nameTelugu || !productForm.category || !productForm.basePrice) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const productData = {
        name: productForm.name.trim(),
        nameTelugu: productForm.nameTelugu.trim(),
        category: productForm.category,
        basePrice: parseFloat(productForm.basePrice),
        unit: productForm.unit,
        description: productForm.description?.trim() || '',
        inStock: productForm.inStock,
        image: `/images/products/${productForm.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id ? { ...p, ...productData, updatedAt: new Date() } : p
          )
        )
        toast.success('Product updated successfully')
      } else {
        const id = await addProduct(productData)
        setProducts((prev) => [
          ...prev,
          { ...productData, id, createdAt: new Date(), updatedAt: new Date() } as Product,
        ])
        toast.success('Product added successfully')
      }
      setProductDialogOpen(false)
    } catch (error) {

  console.error('Product save error:', error)
  toast.error('Failed to save product')

    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleToggleStock = async (product: Product) => {
    try {
      await updateProduct(product.id, { inStock: !product.inStock })
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, inStock: !p.inStock } : p
        )
      )
      toast.success(`Product marked as ${!product.inStock ? 'in stock' : 'out of stock'}`)
    } catch (error) {
      toast.error('Failed to update stock status')
    }
  }

  // Category CRUD
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        nameTelugu: category.nameTelugu,
        icon: category.icon,
        order: category.order.toString(),
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({
        name: '',
        nameTelugu: '',
        icon: '',
        order: ((categories.length + 1) * 10).toString(),
      })
    }
    setCategoryDialogOpen(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name || !categoryForm.nameTelugu) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const categoryData = {
        name: categoryForm.name.trim(),
        nameTelugu: categoryForm.nameTelugu.trim(),
        icon: categoryForm.icon.trim() || 'package',
        order: parseInt(categoryForm.order) || categories.length + 1,
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData)
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...c, ...categoryData } : c
          )
        )
        toast.success('Category updated successfully')
      } else {
        const id = await addCategory(categoryData)
        setCategories((prev) => [...prev, { ...categoryData, id } as Category])
        toast.success('Category added successfully')
      }
      setCategoryDialogOpen(false)
    } catch (error) {
      toast.error('Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameTelugu.includes(searchQuery)
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/sundari-owner-panel/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Products & Categories</h1>
                <p className="text-xs text-muted-foreground">{products.length} products</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tags className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Products</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full sm:w-[200px]"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {categoryEmojis[cat.id] || '📦'} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => openProductDialog()}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>In Stock</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {categoryEmojis[product.category] || '📦'}
                                </span>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground telugu">
                                    {product.nameTelugu}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {categories.find((c) => c.id === product.category)?.name || product.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="font-semibold">Rs. {product.basePrice}</p>
                              <p className="text-xs text-muted-foreground">per {product.unit}</p>
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={product.inStock}
                                onCheckedChange={() => handleToggleStock(product)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openProductDialog(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Categories</CardTitle>
                  <Button onClick={() => openCategoryDialog()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">
                          {categoryEmojis[category.id] || '📦'}
                        </span>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground telugu">
                            {category.nameTelugu}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openCategoryDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product details' : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name (English) *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g., Rice"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameTelugu">Name (Telugu) *</Label>
                <Input
                  id="nameTelugu"
                  value={productForm.nameTelugu}
                  onChange={(e) => setProductForm({ ...productForm, nameTelugu: e.target.value })}
                  placeholder="e.g., బియ్యం"
                  className="telugu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) => setProductForm({ ...productForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {categoryEmojis[cat.id] || '📦'} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Price (Rs.) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={productForm.basePrice}
                  onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                  placeholder="e.g., 60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Select
                  value={productForm.unit}
                  onValueChange={(value) => setProductForm({ ...productForm, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="litre">Litre</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="tube">Tube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Optional product description"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">In Stock</Label>
              <Switch
                id="inStock"
                checked={productForm.inStock}
                onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Product'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details' : 'Add a new category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="catName">Name (English) *</Label>
                <Input
                  id="catName"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g., Rice & Grains"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catNameTelugu">Name (Telugu) *</Label>
                <Input
                  id="catNameTelugu"
                  value={categoryForm.nameTelugu}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameTelugu: e.target.value })}
                  placeholder="e.g., బియ్యం & ధాన్యాలు"
                  className="telugu"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="e.g., grain"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                  placeholder="e.g., 1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
