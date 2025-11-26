"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Truck,
  Shield,
  Zap,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Award,
  Phone,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { productApi, type ProductData } from "@/lib/api";
import { addToCart } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { useETrikeToast } from "@/components/ui/toast-container";
import { useCart } from "@/contexts/cart-context";
import { useFlyingETrike } from "@/components/ui/flying-etrike-animation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Twitter, Copy } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useETrikeToast();
  const { refreshCart } = useCart();
  const { triggerAnimation, AnimationContainer } = useFlyingETrike();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState("White");

  const colors = [
    { name: "White", class: "bg-white" },
    { name: "Black", class: "bg-black" },
    { name: "Red", class: "bg-red-700" },
    { name: "Blue", class: "bg-blue-700" },
  ];

  const sizes = ["6", "7", "8", "9", "10", "11", "12"];
  const [selectedSize, setSelectedSize] = useState("8");

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getProduct(Number(params.id));
      setProduct(response);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product details");
      toast.error(
        "Failed to Load",
        "Could not load product details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const user = getCurrentUser();

    if (!user) {
      toast.warning(
        "Login Required",
        "Please log in to add items to your cart"
      );
      router.push("/login");
      return;
    }

    try {
      setAddingToCart(true);

      // Get button and cart icon elements for animation
      const button = event.currentTarget;
      const cartIcon = document.querySelector(
        "[data-cart-icon]"
      ) as HTMLElement;

      if (cartIcon) {
        // Trigger flying animation
        triggerAnimation(button, cartIcon);
      }

      const selectedColor = product?.colors?.[selectedColorIndex]?.name;
      await addToCart(product!.id!, quantity, selectedColor);

      // Refresh cart count in header
      await refreshCart();

      // Show success toast
      toast.cartAdded(product!.name, {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        "Failed to Add",
        "Could not add item to cart. Please try again."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // Enhanced price formatting for large numbers
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

  const nextImage = () => {
    const images = product?.images ?? [];
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = product?.images ?? [];
    if (images.length > 1) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Product not found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg px-8 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.original_price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-100">
      <Header />

      {/* Flying Animation Container */}
      <AnimationContainer />

      {/* Enhanced Breadcrumb */}
      <div className="bg-white border-b-2 border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-3 text-sm sm:text-base flex-wrap">
            <button
              onClick={() => router.push("/products")}
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Products
            </button>
            <span className="text-orange-300 text-xl">›</span>
            <span className="text-gray-600 font-medium">
              {product.category}
            </span>
            <span className="text-orange-300 text-xl">›</span>
            <span className="text-gray-900 font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="bg-background grid grid-cols-1 lg:grid-cols-3 gap-3 mx-2 my-5">
            {/* 1st Column */}
            <div className="space-y-6 col-span-2">
              {/* Left Column - Images */}
              <div className="lg:col-span-2 space-y-6">
                {/* Main Image Container */}
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
                    {/* Thumbnails - Hidden on mobile, shown on lg+ */}
                    <aside className="hidden lg:block lg:col-span-2">
                      <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <button
                            key={i}
                            className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                            aria-label={`View Angle ${i}`}
                          >
                            <img
                              src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                              alt={`Shoe Angle ${i}`}
                              className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                            />
                          </button>
                        ))}
                      </div>
                    </aside>

                    {/* Hero image */}
                    <div className="lg:col-span-10">
                      <div className="overflow-hidden h-full w-auto rounded-xl border border-gray-200">
                        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500">
                          Top-down view
                        </div>
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Nike Air Force shoe top-down view"
                          className="overflow-hidden h-full w-auto aspect-[4/3] object-cover transition group-hover:scale-[1.52]"
                          sizes="(max-width: 1250px) 100vw, 50vw"
                        />
                      </div>
                    </div>

                    {/* Mobile Thumbnails - Horizontal scroll */}
                    <div className="lg:hidden col-span-1 overflow-x-auto">
                      <div className="flex gap-2 pb-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <button
                            key={i}
                            className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md border-2 border-gray-200 hover:border-blue-500"
                          >
                            <img
                              src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                              alt={`Thumbnail ${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Share and Favorite */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4  pt-6 border-t">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Share:</span>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition">
                          <Facebook className="w-5 h-5 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition">
                          <Twitter className="w-5 h-5 text-sky-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition">
                          <Copy className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-sm hover:text-red-600 transition">
                      <Heart className="w-5 h-5" />
                      <span className="hidden sm:inline">Favorite (44.1K)</span>
                      <span className="sm:hidden">(44.1K)</span>
                    </button>
                  </div>
                </div>

                {/* Badges */}
                {/* <div className="flex flex-wrap gap-2">
                  <Badge className="bg-red-100 text-red-600 border border-red-300">
                    Save ₽1000
                  </Badge>
                  <Badge className="bg-green-100 text-green-600 border border-green-300">
                    ✓ In Stock
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-600 border border-yellow-300">
                    ⭐ Featured
                  </Badge>
                </div> */}
              </div>

              {/* Thumbnail Images - Enhanced */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-3">
                  <span className="text-sm font-semibold text-destructive">
                    {product.original_price &&
                      product.original_price > product.price && (
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-red-100 text-red-600 border-red-600 text-xs font-bold px-2 py-1">
                            Save{" "}
                            {formatPrice(
                              product.original_price - product.price
                            )}
                          </Badge>
                          <Badge
                            className={`text-xs font-bold px-2 ${
                              product.in_stock
                                ? "bg-green-100 text-green-600 border-green-600"
                                : "bg-red-100 text-red-600 border-red-600"
                            }`}
                          >
                            {product.in_stock ? "✓ In Stock" : "✗ Out of Stock"}
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-600 text-xs px-2 font-bold border-yellow-600">
                            ⭐<span> Featured</span>
                          </Badge>
                        </div>
                      )}

                    {/* Stock Status and Featured Badge - Better positioning */}
                    <div className="flex flex-col items-start sm:items-end space-y-2"></div>
                  </span>
                </div>
              )}
            </div>

            {/* 2nd Column */}
            <div className="space-y-3 mt-5 lg:mt-5 col-span-1">
              <div className="relative w-auto h-auto overflow-hidden sm:p-2 mx-3 my-3">
                <h1 className="text-2xl lg:text-3xl font-bold text-balance mb-4">
                  {" "}
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 pb-4 border-b mb-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium underline">5.0</span>
                    <div className="flex text-yellow-400 text-sm">
                      {"★".repeat(5)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium underline">4.2k</span> Ratings
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium underline">10k+</span> Sold
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline ml-auto"
                  >
                    Report
                  </a>
                </div>

                {/* Price Section */}
                <div className="text-base text-gray-700 bg-blue-50 p-2 border border-blue-200 my-2">
                  <span className="text-xl font-bold text-blue-600">
                    {" "}
                    ₽{product.original_price}
                  </span>
                  <span className="text-sm text-muted-foreground line-through mx-2 my-1">
                    ₽ {product.price}
                  </span>
                </div>

                {/* Model, Location Manufacturer, Delivery Date */}
                <div className="grid gap-4 my-5">
                  {/* Shop Vouchers */}

                  <HoverCard>
                    <HoverCardTrigger className="flex flex-row items-center text-xs text-muted-foreground">
                      <p className="font-medium">Shop Vouchers:</p>
                      <div className="flex gap-2 ml-2">
                        <span className="px-2 py-1 bg-blue-300 text-white rounded text-[11px]">
                          ₽5 OFF
                        </span>
                        <span className="px-2 py-1 bg-blue-300 text-white rounded text-[11px]">
                          ₽5 OFF
                        </span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="items-center w-full max-w-xl bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Shop Vouchers
                      </h3>

                      {/* Voucher 1 */}
                      <div className="flex items-center justify-between border border-blue-200 rounded-md gap-3 px-2 py-3 bg-blue-50">
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 1"
                          className="h-24 w-24 object-cover transition group-hover:scale-[1.02] mx-3"
                        />
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold text-blue-600">₱5 OFF</p>
                          <p>
                            Min. spend ₱200 ·{" "}
                            <span className="text-xs text-gray-500">
                              Second Order Voucher
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Valid Till: 24.01.2026
                          </p>
                        </div>
                        <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                          Claim
                        </button>
                      </div>

                      {/* Voucher 2 */}
                      <div className="flex items-center justify-between border border-blue-200 rounded-md gap-3 px-2 py-3 bg-blue-50">
                        {" "}
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 1"
                          className="h-24 w-24 object-cover transition group-hover:scale-[1.02] m-3"
                        />
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold text-blue-600">₱5 OFF</p>
                          <p>
                            Min. spend ₱200 ·{" "}
                            <span className="text-xs text-gray-500">
                              Shop Welcome Voucher
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Valid Till: 24.01.2026
                          </p>
                        </div>
                        <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                          Claim
                        </button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  {/* Shipping Section */}
                  <HoverCard>
                    <HoverCardTrigger className="flex flex-row items-center text-xs text-muted-foreground">
                      <p className="font-medium">Shipping:</p>
                      <div className="flex items-start gap-2 ml-2">
                        {/* courrier logo */}
                        <svg
                          className="w-5 h-5 text-blue-600 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 3a1 1 0 011-1h10a1 1 0 011 1v5h2a1 1 0 011 1v4h-1a2 2 0 10-4 0H8a2 2 0 10-4 0H3V3z" />
                        </svg>
                        <div className="text-[13px] text-gray-700 leading-snug">
                          <p className="font-medium">
                            Guaranteed to get by{" "}
                            <span className="text-gray-900">25 - 26 Nov</span>
                          </p>
                          <p>Get a ₱50 voucher if your order arrives late.</p>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="items-center w-full max-w-3xl bg-white border border-gray-200 rounded-lg py-4 space-y-4 shadow-sm">
                      {/* Header */}
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Shipping Fee Information
                      </h3>
                      <p className="text-xs text-gray-600">
                        Shipping to:{" "}
                        <span className="font-medium text-gray-900">
                          Metro Manila
                        </span>
                      </p>
                      <hr />

                      {/* Standard Local */}
                      <div className="border border-blue-200 rounded-md p-4 bg-blue-50 space-y-2">
                        <h3 className="text-sm font-semibold text-blue-700">
                          Standard Local
                        </h3>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          <li>
                            Guaranteed to get by{" "}
                            <span className="font-medium text-gray-900">
                              25 - 26 Nov
                            </span>
                          </li>
                          <li>Get a ₱50 voucher if your order arrives late</li>
                          <li>₱35 off shipping from ₱0</li>
                          <li>
                            Original price:{" "}
                            <span className="line-through">₱36</span>,
                            discounted to{" "}
                            <span className="font-semibold text-blue-700">
                              ₱1
                            </span>
                          </li>
                        </ul>
                      </div>

                      {/* Exapress Air */}
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-800">
                          Express Air Local
                        </h3>
                        <p className="text-sm text-red-600">
                          Unserviceable Area
                        </p>
                      </div>

                      {/* Self Collection */}
                      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800">
                          (Shop Name) Self Pick-up
                        </h3>
                        <p className="text-sm text-gray-700">
                          The seller's pickup address is not supported.
                        </p>
                        <p className="text-sm text-gray-500">
                          Please contact seller for further assistance.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  {/* Shoppping Guarantee Section */}
                  <HoverCard>
                    <HoverCardTrigger className="flex flex-row items-center text-xs text-muted-foreground">
                      <p className="font-medium">Shopping Guarantee:</p>
                      <div className="flex items-start gap-2 ml-2">
                        <span className="text-gray-600">
                          Free Returns • Protection
                        </span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="items-center w-full max-w-3xl bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Shopping Guarantee
                      </h3>
                      <hr />

                      {/* Free & Easy Returns */}
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="text-blue-600">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3z" />
                          </svg>
                        </div>
                        {/* Text */}
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Free & Easy Returns</p>
                          <p>
                            Free Returns • Protection{" "}
                            <span className="italic text-gray-500">
                              Terms and conditions apply.
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Merchandise Protection */}
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="text-blue-600">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2z" />
                          </svg>
                        </div>
                        {/* Text */}
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Merchandise Protection</p>
                          <p>
                            Protect your items from total loss due to accidental
                            damage and liquid damage where the original item is
                            beyond repair.
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                {/* Color Selection */}
                <div className="text-xs text-muted-foreground mb-5">
                  <div className="grid grid-cols-5 gap-2">
                    <p className="font-medium text-sm mb-2">Colors</p>
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`p-1 rounded border-2 transition ${
                          selectedColor === color.name
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 ${color.class} rounded border border-gray-300 mx-auto mb-1`}
                        ></div>
                        <p className="text-xs text-center truncate">
                          {color.name}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                    <span className="text-xs font-semibold">Selected: </span>
                    <span className="text-xs">{selectedColor}</span>
                  </div>
                </div>

                {/* Sizes Selection */}
                <div className="text-muted-foreground mb-5">
                  <div className="grid grid-cols-5 gap-2">
                    <p className="text-sm mb-2">Sizes</p>
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2 py-1 rounded border-2 transition ${
                          selectedSize === size
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="w-3 h-3 flex items-center justify-center mx-auto mb-1 text-sm font-semibold">
                          {size}
                        </div>
                        <p className="text-xs text-center truncate">{`US ${size}`}</p>
                      </button>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                    <span className="text-xs font-semibold">Selected: </span>
                    <span className="text-xs">US {selectedSize}</span>
                  </div>
                </div>

                <div className="space-y-2 my-5 text-xs text-muted-foreground">
                  <div className="grid grid-cols-7 gap-2">
                    <p className="font-medium">Quantity</p>

                    <div className="flex items-center gap-1 w-fit border-2 border-gray-300 focus:border-gray-500 rounded m-2">
                      <button className="w-8 h-8 bg-gray-200 text-gray-700 hover:text-white hover:bg-gray-300 transition">
                        −
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        1
                      </span>
                      <button className="w-8 h-8 bg-gray-200 text-gray-700 hover:text-white hover:bg-gray-300 transition">
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="h-11 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100 border-2 border-blue-300 rounded hover:bg-blue-200 transition">
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <button className="h-11 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 border-2 border-blue-700 rounded hover:bg-blue-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="min-h-full text-card-foreground h-auto">
          {/* Product Details Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Tabs defaultValue="productSpecification">
                  <TabsList className="flex flex-wrap gap-2 border-b pb-2 mb-6">
                    <TabsTrigger value="productSpecification">
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="perfectFor">Perfect For</TabsTrigger>
                    <TabsTrigger value="usageGuide">Usage Guide</TabsTrigger>
                  </TabsList>

                  <TabsContent value="productSpecification">
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Product Specifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="flex gap-5 my-2">
                            <span className="text-xs text-muted-foreground text-gray-600 w-32">
                              Stock:
                            </span>
                            <span className="font-medium text-foreground">
                              IN STOCK
                            </span>
                          </div>
                          <div className="flex gap-5 my-5">
                            <span className="text-xs text-muted-foreground text-gray-600 w-32">
                              Made In:
                            </span>
                            <span className="font-medium text-foreground">
                              Vietnam
                            </span>
                          </div>
                          <div className="flex gap-5 my-5">
                            <span className="text-xs text-muted-foreground text-gray-600 w-32">
                              Brand:
                            </span>
                            <span className="font-medium text-foreground">
                              Nike
                            </span>
                          </div>
                          <div className="flex gap-5 my-5">
                            <span className="text-xs text-muted-foreground text-gray-600 w-32">
                              Weight:
                            </span>
                            <span className="font-medium text-foreground">
                              1kg
                            </span>
                          </div>
                          <div className="flex gap-5 my-5">
                            <span className="text-xs text-muted-foreground text-gray-600 w-32">
                              Height:
                            </span>
                            <span className="font-medium text-foreground">
                              23cm
                            </span>
                          </div>
                          <div className="flex gap-5 my-5">
                            <span className="text-xs text-muted-foreground text-gray-600 w-32">
                              Features:
                            </span>
                            <span className="font-medium text-foreground">
                              Breathable, Flexible, Slip Resistant
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="description">
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Product Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          The Nike Air Force 1 is a timeless sneaker first
                          released in 1982, known for its clean design,
                          versatile style, and groundbreaking Nike Air
                          cushioning technology. It remains one of the most
                          iconic shoes in both basketball and streetwear
                          culture.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Product Reviews
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">
                          Customer reviews coming soon...
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="perfectFor">
                    {product.ideal_for && product.ideal_for.length > 0 && (
                      <Card className="border-none shadow-none">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Perfect For
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                              {product.ideal_for.map((use, index) => (
                                <Badge
                                  key={index}
                                  className="h-8 w-auto bg-blue-400 text-white text-base font-semibold px-2 py-2"
                                >
                                  {use}
                                </Badge>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="usageGuide">
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-base">Usage Guide</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Care instructions: Clean with a soft damp cloth. Avoid
                          harsh chemicals. Store in a cool, dry place.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Seller Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold">
                    SHOP
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    caq_mall
                  </span>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 border-2 border-blue-600 rounded font-semibold hover:bg-blue-200 transition">
                      Chat Now
                    </button>
                    <button className="flex-1 px-4 py-2 text-gray-700 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 transition">
                      View Shop
                    </button>
                  </div>
                </div>
              </div>

              {/* Vouchers */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-sm font-semibold mb-4">Shop Vouchers</h3>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border border-blue-300 rounded-lg bg-blue-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-blue-600 font-bold text-base">
                            ₽5 OFF
                          </p>
                          <p className="text-xs text-gray-600">
                            Min. Spend ₽200
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Valid: 24.01.2026
                          </p>
                        </div>
                        <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                          Claim
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* From The Same Shope */}
      <div className="max-w-7xl mx-auto">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
            {/* From The Same Shop Section */}
            <div className="mt-8">
              <p className="text-xs text-muted-foreground flex items-center uppercase mb-5">
                From The Same Shop
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card
                    key={i}
                    className="group cursor-pointer border border-gray-200 shadow hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="relative">
                      <Badge className="absolute bg-red-300 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-tl-lg rounded-r-none border-l-red-200 shadow-sm hover:bg-orange-300">
                        -10%
                      </Badge>
                      <img
                        src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                        alt="Product"
                        className="w-full aspect-square object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                        Nike Air Force
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge className="bg-blue-100 text-blue-600 rounded-none border border-border border-blue-600 text-xs">
                          ₽5 OFF
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-600 rounded-none border border-border border-orange-500 text-xs">
                          ★ 4.8
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-blue-600">₽100</p>
                        <p className="text-xs text-gray-500">10k Sold</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <div className="max-w-7xl mx-auto">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
            {/* You May Also Like Section */}
            <div className="mt-8">
              <p className="text-xs text-muted-foreground flex items-center uppercase mb-5">
                You May Also Like
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card
                    key={i}
                    className="group cursor-pointer border border-gray-200 shadow hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="relative">
                      <Badge className="absolute bg-red-300 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-tl-lg rounded-r-none border-l-red-200 shadow-sm hover:bg-orange-300">
                        -10%
                      </Badge>
                      <img
                        src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                        alt="Product"
                        className="w-full aspect-square object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                        Nike Air Force
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge className="bg-blue-100 text-blue-600 rounded-none border border-border border-blue-600 text-xs">
                          ₽5 OFF
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-600 rounded-none border border-border border-orange-500 text-xs">
                          ★ 4.8
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-blue-600">₽100</p>
                        <p className="text-xs text-gray-500">10k Sold</p>
                      </div>
                    </div>
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
            {/* Load More */}
            <div className="mt-8 flex justify-center">
              <Card className="bg-gray-100 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition cursor-pointer">
                <div className="px-12 py-4">
                  <p className="text-sm text-gray-600 text-center">
                    Login To See More Products
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
