"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Filter, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProductForm from "@/components/admin/product-form";
import CategoryForm from "@/components/admin/category-form";
import CategoryTable from "@/components/admin/category-table";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/product/tabs-card";

import ProductTable from "@/components/admin/product-table";

export default function ProductManagementPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editId) {
      handleEditById(Number(editId));
    }
  }, [editId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: searchTerm || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
      };

      const response = await productApi.getProducts(params);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditById = async (id: number) => {
    try {
      const product = await productApi.getProduct(id);
      setEditingProduct(product);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      setError("Failed to fetch product for editing.");
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: ProductData) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.deleteProduct(id);
        await fetchProducts(); // Refresh the list
        setError(null);
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (data: ProductData | FormData) => {
    try {
      setError(null);

      if (editingProduct && editingProduct.id) {
        await productApi.updateProduct(editingProduct.id, data);
      } else {
        await productApi.createProduct(data);
      }

      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    }
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleExport = () => {
    // Convert products to CSV
    const headers = [
      "Name",
      "Model",
      "Category",
      "Price",
      "Original Price",
      "In Stock",
      "Featured",
    ];
    const csvContent = [
      headers.join(","),
      ...products.map((product) =>
        [
          `"${product.name}"`,
          `"${product.model}"`,
          `"${product.category}"`,
          product.price,
          product.original_price || "",
          product.in_stock ? "Yes" : "No",
          product.featured ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const categories = ["Price: High to Low", "Price: Low to High"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Admin Dashboard
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Products Management
              </h1>
              <p className="text-blue-100">
                Manage your categories in your inventory
              </p>
            </div>{" "}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="p-2 border-blue-500 text-xs text-blue-500 hover:text-blue-700  hover:bg-blue-50"
                onClick={handleCreateProduct}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
              <Button
                variant="outline"
                className="p-2 border-blue-500 text-xs  text-blue-500 hover:text-blue-700  hover:bg-blue-50"
                onClick={handleCreateProduct}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>{" "}
            </div>{" "}
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full flex justify-end flex-col sm:flex-row gap-4 flex-1">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-4 text-xs rounded-lg border-2 border-blue-200 focus:border-blue-500 bg-white min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="relative max-w-md">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-56 pl-2 h-10 rounded-lr-full rounded-r-2xl border-r-sm border-2 border-blue-200 focus:border-blue-500 text-xs"
                />
              </div>

              <Button
                onClick={handleSearch}
                variant="outline"
                className="group absolute p-2 bg-blue-500 group-hover:border-2 group-hover:border-blue-700 text-xs text-blue-600 rounded-full hover:bg-blue-50"
                disabled={loading}
              >
                {loading ? (
                  <p className="flex text-xs text-white">loading</p>
                ) : (
                  <Search className="transform text-white group-hover:text-blue-700 w-5 h-5" />
                )}
              </Button>
            </div>
            <Badge className="bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white border-blue-200">
              {products.length} Product{products.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </section>

      {/* Products Table */}
      <section className="relative mx-2 py-8">
        <Tabs defaultValue="categories">
          <div className="flex flex-col max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 overflow-x-auto">
            <TabsList className="w-full flex justify-between items-center border-none">
              {/* Left: Tabs */}
              <div className="flex gap-2">
                <TabsTrigger
                  value="categories"
                  className="bg-white p-2 text-sm text-blue-500 hover:text-blue-700  whitespace-nowrap rounded-md border border-blue-300
            data-[state=active]:text-blue-500 data-[state=active]:border 
            data-[state=active]:border-blue-600 data-[state=active]:bg-blue-100 hover:bg-blue-50"
                >
                  Categories
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="bg-white p-2 text-sm text-blue-500 hover:text-blue-700  whitespace-nowrap rounded-md border border-blue-300
            data-[state=active]:text-blue-500 data-[state=active]:border 
            data-[state=active]:border-blue-600 data-[state=active]:bg-blue-100 hover:bg-blue-50"
                >
                  Products
                </TabsTrigger>
              </div>

              {/* Right: Export Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="p-2 text-sm whitespace-nowrap text-blue-500 hover:text-blue-700 rounded-lg border-blue-300
            hover:bg-blue-50"
                  onClick={handleExport}
                  disabled={products.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Categories
                </Button>
                <Button
                  variant="outline"
                  className="p-2 text-sm whitespace-nowrap text-blue-500 hover:text-blue-700 rounded-lg border-blue-300
            hover:bg-blue-50"
                  onClick={handleExport}
                  disabled={products.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Products
                </Button>
              </div>
            </TabsList>
          </div>

          {/* Products Tab Content */}
          <TabsContent value="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <ETrikeLoader />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    No products found
                  </div>
                  <Button
                    onClick={handleCreateProduct}
                    className="bg-gradient-to-r from-orange-500 to-red-500 
                       hover:from-orange-600 hover:to-red-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <ProductTable
                  products={products}
                  loading={loading}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              )}
            </div>
          </TabsContent>

          {/* Categories Tab Content */}
          <TabsContent value="categories">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <ETrikeLoader />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    No category found
                  </div>
                  <Button
                    onClick={handleCreateProduct}
                    className="bg-gradient-to-r from-orange-500 to-red-500 
                       hover:from-orange-600 hover:to-red-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <CategoryTable
                  products={products}
                  loading={loading}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
            setError(null);
          }}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
            setError(null);
          }}
        />
      )}
    </div>
  );
}
