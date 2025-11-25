"use client";

export const dynamic = "force-dynamic";

import type React from "react";
import { useState, useEffect } from "react";
import { Filter, Search, Grid, List, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { useClientToast } from "@/hooks/use-client-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [animatingProduct, setAnimatingProduct] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useClientToast();

  const categories = [
    "All Products",
    "E-Bike",
    "E-Trike",
    "E-Scooter",
    "E-Motorcycle",
    "E-Dump",
  ];

  // Get category from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else if (categoryFromUrl) {
      // If category exists but not in our list, still set it
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]); // Refetch when category changes

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortBy, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Option 1: Server-side filtering (recommended)
      // Pass category to API if it's not "All Products"
      const categoryParam =
        selectedCategory !== "All Products" ? selectedCategory : undefined;
      const response = await productApi.getProducts({
        category: categoryParam,
      });

      // Option 2: Client-side filtering (fallback)
      // const response = await productApi.getProducts()

      const productsWithStock = response.map((product) => ({
        ...product,
        in_stock: Boolean(product.in_stock),
      }));

      console.log("Fetched products:", productsWithStock);
      setProducts(productsWithStock);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback: fetch all products if category filtering fails
      try {
        const response = await productApi.getProducts();
        const productsWithStock = response.map((product) => ({
          ...product,
          in_stock: Boolean(product.in_stock),
        }));
        setProducts(productsWithStock);
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filtering (only if using client-side filtering)
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "featured":
          return b.featured ? 1 : -1;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All Products") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const newUrl = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newUrl, { scroll: false });
  };

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "₱0.00";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleAddToCart = async (
    product: ProductData,
    event: React.MouseEvent
  ) => {
    try {
      setAnimatingProduct(product.id!);
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const cartIcon = document.querySelector("[data-cart-icon]");
      const cartRect = cartIcon?.getBoundingClientRect();

      if (cartRect) {
        const animationEl = document.createElement("div");
        animationEl.className =
          "fixed w-8 h-8 bg-orange-500 rounded-full z-50 pointer-events-none";
        animationEl.style.left = `${rect.left + rect.width / 2 - 16}px`;
        animationEl.style.top = `${rect.top + rect.height / 2 - 16}px`;
        animationEl.style.transition =
          "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        document.body.appendChild(animationEl);

        setTimeout(() => {
          animationEl.style.left = `${cartRect.left + cartRect.width / 2 - 16}px`;
          animationEl.style.top = `${cartRect.top + cartRect.height / 2 - 16}px`;
          animationEl.style.transform = "scale(0.5)";
          animationEl.style.opacity = "0";
        }, 100);

        setTimeout(() => {
          if (document.body.contains(animationEl)) {
            document.body.removeChild(animationEl);
          }
        }, 900);
      }

      await addToCart(product.id!, 1);

      // Show success toast
      toast.cartAdded(product.name);

      setAnimatingProduct(null);
      console.log("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        "Failed to Add",
        "Could not add item to cart. Please try again."
      );
      setAnimatingProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Category Info */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm px-2 py-1.5">
              Electric Mobility Solutions
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {selectedCategory === "All Products"
                ? "Our Products"
                : selectedCategory}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              {selectedCategory === "All Products"
                ? "Discover our complete range of electric vehicles designed for sustainable transportation"
                : `Explore our ${selectedCategory} collection`}
            </p>
            {selectedCategory !== "All Products" && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleCategoryChange("All Products")}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-6 md:mb-8 bg-background rounded-2xl shadow-sm p-4 md:p-6">
          {/* Top Row - Search and View Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 lg:max-w-md xl:max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-lg border-2 border-orange-200 focus:border-orange-500 hover:border-orange-500"
              />
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block apearance-none w-full h-full min-w-[200px] px-5 py-3 bg-transparent border-2 rounded-lg border-orange-200 text-sm focus:border-orange-500 focus:outline-none hover:border-orange-500 bg-white min-w-[180px]"
              >
                {/* className="block py-2.5 ps-0 w-full text-sm text-body bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" */}
                <option
                  value="name"
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  Sort by Name
                </option>
                <option
                  value="price-low"
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  Price: Low to High
                </option>
                <option
                  value="price-high"
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  Price: High to Low
                </option>
                <option
                  value="featured"
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  Featured First
                </option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-orange-200 hover:bg-orange-50 h-12"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters & Sort
            </Button>
          </div>

          {/* Category Filters Row */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={`h-10 px-4 ${
                    selectedCategory === category
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-white hover:bg-orange-100 border-orange-200 text-gray-700 hover:text-orange-400"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Mobile Sort Options */}
            <div className="lg:hidden">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border-2 text-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none bg-white mb-4"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="featured">Featured First</option>
              </select>

              {/* Mobile View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "border-orange-200 hover:bg-orange-50"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-8">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
            {/* Product Section */}
            <div className="space-y-6">
              <div className="grid lg:grid-cols-6 gap-4 my-4">
                <Card className="group relative bg-white flex justify-center w-auto h-auto m-auto border border-border border-gray-200 rounded-none shadow-lg transition-all duration-300 group-hover:border-5 group-hover:border-blue-400">
                  <button
                    className="relative overflow-hidden transition"
                    aria-label="View Angle 1"
                  >
                    <Badge className="absolute bg-red-300 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-tl-lg rounded-r-none border-l-red-200 shadow-sm group-hover:border-5 hover:bg-orange-300 hover:text-orange-900">
                      -10%
                    </Badge>
                    <img
                      src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                      alt="Shoe Angle 1"
                      className="flex h-56 w-full aspect-[4/3] object-cover transition"
                    />
                    <div className="mx-3 my-2">
                      <p className="line-clamp-2 text-sm text-gray-900 max-w-[320px] text-sm text-start text-foreground">
                        Nike Air Force
                      </p>
                    </div>
                    <div className="flex flex-cols gap-2 mx-3 my-3">
                      <Badge className="w-12 h-5 px-0.2 bg-blue-200 text-xs text-center border border-border border-blue-600 text-blue-600 rounded-none border border-border border-blue-600  hover:border-blue-600 shadow-sm">
                        ₽5 OFF
                      </Badge>
                      <Badge className="w-12 h-5 px-0.2 bg-blue-300 text-xs text-center border border-none rounded-none border border-border hover:border-blue-600 shadow-sm">
                        ₽5 OFF
                      </Badge>
                      <Badge className="w-12 h-5 px-0.2 bg-yellow-200 text-xs text-center text-blackborder border-border border-orange-500 rounded-none border border-border shadow-sm hover:text-yellow-200">
                        <span className="text-xs text-yellow-500 m-2">★</span>{" "}
                        4.8
                      </Badge>
                    </div>
                    <div className="flex flex-cols gap-2 mx-3 my-2">
                      <p className="text-start text-xs font-bold text-blue-600">
                        ₽ 100
                      </p>
                      <p className="text-end text-xs font-foreground">
                        10.6K Sold
                      </p>
                    </div>
                  </button>

                  <Button className="hidden group-hover:block absolute bottom-0 right-0 w-full h-auto text-white rounded-none border border-border shadow-sm group-hover:bg-blue-300 group-hover:text-blue-900">
                    <span className="text-xs text-center text-blue-500">
                      Find Similar
                    </span>
                  </Button>
                </Card>{" "}
                {filteredProducts.map((product) => (
                  <Card className="group relative bg-white flex justify-center w-auto h-auto m-auto border border-border border-gray-200 rounded-none shadow-lg transition-all duration-300 group-hover:border-5 group-hover:border-blue-400">
                    <Link
                      href={`/products/${product.id}`}
                      className={viewMode === "list" ? "flex-shrink-0" : ""}
                    >
                      <button
                        className="relative overflow-hidden transition"
                        aria-label="View Angle 1"
                      >
                        <Badge className="absolute bg-red-300 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-tl-lg rounded-r-none border-l-red-200 shadow-sm hover:bg-orange-300">
                          -10%
                        </Badge>    
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 1"
                          className="flex h-56 w-full aspect-[4/3] object-cover transition"
                        />
                        <div className="mx-3 my-2">
                          <p className="line-clamp-2 text-sm text-gray-900 max-w-[320px] text-sm text-start text-foreground">
                            Nike Air Force
                          </p>
                        </div>
                        <div className="flex flex-cols gap-2 mx-3 my-3">
                          <Badge className="w-12 h-5 px-0.2 bg-blue-200 text-xs text-center border border-border border-blue-600 text-blue-600 rounded-none border border-border border-blue-600  hover:border-blue-600 shadow-sm">
                            ₽5 OFF
                          </Badge>
                          <Badge className="w-12 h-5 px-0.2 bg-blue-300 text-xs text-center border border-none rounded-none border border-border hover:border-blue-600 shadow-sm">
                            ₽5 OFF
                          </Badge>
                          <Badge className="w-12 h-5 px-0.2 bg-yellow-200 text-xs text-center text-blackborder border-border border-orange-500 rounded-none border border-border shadow-sm hover:text-yellow-200">
                            <span className="text-xs text-yellow-500 m-2">
                              ★
                            </span>{" "}
                            4.8
                          </Badge>
                        </div>
                        <div className="flex flex-cols gap-2 mx-3 my-3">
                          <p className="text-start text-xs font-bold text-blue-600">
                            ₽ 100{" "}
                            <span className="text-xs text-gray-400 line-through">
                              {" "}
                              ₽ 100
                            </span>
                          </p>
                        </div>
                      </button>
                    </Link>

                    <Button className="hidden group-hover:block absolute bottom-0 right-0 w-full h-auto text-white rounded-none border border-border shadow-sm group-hover:bg-blue-300 group-hover:text-blue-900">
                      <span className="text-xs text-center text-blue-500">
                        Find Similar
                      </span>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-8">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
            {/* You May Also Like Section */}
            <p className="text-xs text-muted-foreground flex items-center uppercase">
              You May Also Like
            </p>
            <div className="mx-auto space-y-6">
              <Card className="bg-gray-100 w-auto h-14 pt-5 m-2 border border-border border-gray-300 rounded-none shadow-lg transition-all duration-300 hover:bg-gray-200">
                <p className="flex justify-center  justify-center text-xs w-56 text-gray-400 mx-96 text-center">
                  Login To See More/See More Products
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
