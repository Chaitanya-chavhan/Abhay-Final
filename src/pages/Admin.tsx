import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Package, CreditCard, Users, ShieldCheck, X, Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number;
  category: string;
  image_url: string | null;
  features: string[] | null;
  tag: string | null;
  is_active: boolean;
  drive_link: string | null;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  products?: { title: string } | null;
}

interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  created_at: string;
  products?: { title: string } | null;
}

const emptyProduct = {
  title: "",
  description: "",
  price: 0,
  original_price: 0,
  category: "Bundles",
  image_url: "",
  features: [] as string[],
  tag: "",
  is_active: true,
  drive_link: "",
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editProduct, setEditProduct] = useState<typeof emptyProduct & { id?: string }>(emptyProduct);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");
  const [adminEmails, setAdminEmails] = useState<{ id: string; email: string }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchAll = async () => {
    setLoadingData(true);
    const [productsRes, ordersRes, purchasesRes, adminsRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*, products(title)").order("created_at", { ascending: false }),
      supabase.from("purchases").select("*, products(title)").order("created_at", { ascending: false }),
      supabase.from("admin_emails").select("id, email").order("created_at", { ascending: true }),
    ]);
    if (productsRes.data) setProducts(productsRes.data as Product[]);
    if (ordersRes.data) setOrders(ordersRes.data as Order[]);
    if (purchasesRes.data) setPurchases(purchasesRes.data as Purchase[]);
    if (adminsRes.data) setAdminEmails(adminsRes.data);
    setLoadingData(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const openNew = () => {
    setEditProduct(emptyProduct);
    setFeaturesInput("");
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct({
      id: p.id,
      title: p.title,
      description: p.description || "",
      price: p.price,
      original_price: p.original_price,
      category: p.category,
      image_url: p.image_url || "",
      features: p.features || [],
      tag: p.tag || "",
      is_active: p.is_active,
      drive_link: p.drive_link || "",
    });
    setFeaturesInput((p.features || []).join(", "));
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setEditProduct({ ...editProduct, image_url: publicUrl });
      toast({ title: "Image uploaded successfully!", description: "Image URL updated." });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message || "Ensure 'products' bucket exists and is public.", variant: "destructive" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!editProduct.title || editProduct.price <= 0) {
      toast({ title: "Validation Error", description: "Title and price are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: editProduct.title,
      description: editProduct.description || null,
      price: editProduct.price,
      original_price: editProduct.original_price,
      category: editProduct.category,
      image_url: editProduct.image_url || null,
      features: featuresInput.split(",").map((f) => f.trim()).filter(Boolean),
      tag: editProduct.tag || null,
      is_active: editProduct.is_active,
      drive_link: editProduct.drive_link || null,
    };

    if (editProduct.id) {
      const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Product updated!" });
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Product created!" });
      }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchAll();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product deleted." });
      fetchAll();
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.includes("@")) return;
    const { error } = await supabase.from("admin_emails").insert({ email: newAdminEmail.trim().toLowerCase() });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin email added!" });
      setNewAdminEmail("");
      fetchAll();
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!confirm("Remove this admin?")) return;
    const { error } = await supabase.from("admin_emails").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Admin removed." });
      fetchAll();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          {[
            { label: "Products", value: products.length, icon: Package },
            { label: "Orders", value: orders.length, icon: CreditCard },
            { label: "Purchases", value: purchases.length, icon: Users },
            { label: "Revenue", value: `₹${orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0)}`, icon: CreditCard },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-heading text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="admins">Admin Access</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Products ({products.length})</h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNew} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editProduct.id ? "Edit Product" : "New Product"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Title *</label>
                      <Input value={editProduct.title} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <Textarea value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Price (₹) *</label>
                        <Input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Original Price (₹)</label>
                        <Input type="number" value={editProduct.original_price} onChange={(e) => setEditProduct({ ...editProduct, original_price: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground">Category</label>
                        <select
                          value={editProduct.category}
                          onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {["Bundles", "Courses", "Clips", "Elements"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Tag (optional)</label>
                        <Input value={editProduct.tag} onChange={(e) => setEditProduct({ ...editProduct, tag: e.target.value })} placeholder="e.g. Best Seller" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Image URL (or Upload direct)</label>
                      <div className="flex gap-2">
                        <Input value={editProduct.image_url} onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })} placeholder="https://..." className="flex-1" />
                        <label className="relative flex cursor-pointer items-center justify-center rounded-md border border-input bg-secondary px-4 hover:bg-secondary/80 transition-colors">
                          <span className="sr-only">Upload Image</span>
                          {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Google Drive Link (private)</label>
                      <Input value={editProduct.drive_link} onChange={(e) => setEditProduct({ ...editProduct, drive_link: e.target.value })} placeholder="https://drive.google.com/..." />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Use https://drive.google.com/..., https://docs.google.com/..., or https://drive.usercontent.google.com/... (other URLs are rejected for buyers).
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Features (comma separated)</label>
                      <Input value={featuresInput} onChange={(e) => setFeaturesInput(e.target.value)} placeholder="6000+ Clips, HD Quality, Instant Access" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editProduct.is_active}
                        onChange={(e) => setEditProduct({ ...editProduct, is_active: e.target.checked })}
                        className="h-4 w-4 rounded border-border"
                      />
                      <label className="text-sm text-foreground">Active (visible to customers)</label>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editProduct.id ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadingData ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Drive Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>₹{p.price} <span className="text-muted-foreground line-through text-xs ml-1">₹{p.original_price}</span></TableCell>
                        <TableCell>
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {p.drive_link ? <span className="text-xs text-primary">✓ Set</span> : <span className="text-xs text-muted-foreground">Not set</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Orders ({orders.length})</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Razorpay ID</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.products?.title || o.product_id.slice(0, 8)}</TableCell>
                      <TableCell>₹{o.amount}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          o.status === "paid" ? "bg-green-100 text-green-700" : o.status === "created" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                        }`}>
                          {o.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{o.razorpay_payment_id || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Purchases ({purchases.length})</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.products?.title || p.product_id.slice(0, 8)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.user_id.slice(0, 12)}...</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.order_id?.slice(0, 12) || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Admin Email Whitelist</h2>
            <p className="text-sm text-muted-foreground mb-6">Only users with these Gmail addresses can access this admin dashboard.</p>
            
            <div className="flex gap-2 mb-6 max-w-md">
              <Input
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@gmail.com"
                onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
              />
              <Button onClick={handleAddAdmin} className="gap-2">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            <div className="space-y-2 max-w-md">
              {adminEmails.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <span className="text-sm text-foreground">{a.email}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveAdmin(a.id)} className="text-destructive h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {adminEmails.length === 0 && (
                <p className="text-sm text-muted-foreground">No admin emails added yet. Add your Gmail to get started.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
