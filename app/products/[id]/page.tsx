"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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

  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

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
        <div className="min-h-full bg-background text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mx-2 my-5">
            {/* 1st Column */}
            <div className="space-y-6 col-span-2">
              {/* Main Image Container - Enhanced */}
              <div className="relative overflow-hidden mx-5 my-8">
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-12 h-full">
                  {/* Thumbnails */}
                  <aside className="order-2 lg:order-1 lg:col-span-2 h-full">
                    <div className="grid grid-cols-7 gap-5 lg:grid-cols-1 h-full">
                      {/* Repeated Thumbnails */}
                      <button
                        className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                        aria-label="View Angle 1"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 1"
                          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </button>
                      <button
                        className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                        aria-label="View Angle 2"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 2"
                          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </button>
                      <button
                        className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                        aria-label="View Angle 3"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 3"
                          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </button>
                      <button
                        className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                        aria-label="View Angle 4"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 4"
                          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </button>
                      <button
                        className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                        aria-label="View Angle 5"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 5"
                          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </button>
                      <button
                        className="group overflow-hidden rounded-md border border-gray-200 transition hover:shadow-sm"
                        aria-label="View Angle 6"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 6"
                          className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                        />
                      </button>
                    </div>
                  </aside>

                  {/* Hero image */}
                  <div className="order-1 lg:order-2 lg:col-span-10 group cursor-pointer">
                    <div className="overflow-hidden lg:h-full w-auto rounded-xl border border-gray-200">
                      <div className="bg-gray-50 p-3 text-xs text-gray-500">
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
                </div>
                <div className="space-y-2 flex items-center justify-between my-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Share:
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-muted rounded-full transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-facebook w-5 h-5 text-blue-600"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-muted rounded-full transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-twitter w-5 h-5 text-sky-500"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-muted rounded-full transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-copy w-5 h-5"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-sm hover:text-destructive transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-heart w-5 h-5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                    <span>Favorite (44.1K)</span>
                  </button>
                </div>
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
                <h1 className="text-2xl font-bold text-balance">
                  {" "}
                  {product.name}
                </h1>

                <div className="flex items-center justify-between w-full max-w-xl py-3">
                  <div className="flex items-center gap-3">
                    {/* Rating and Stats */}
                    <div className="flex items-center mr-5">
                      {/* Stars and Score */}
                      <p className="font-medium underline"> 5.0 </p>
                      {/* Ratings */}
                      <div className="flex text-yellow-400">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center mr-5">
                      <div className="flex justify-between gap-2 text-sm text-gray-600">
                        <p className="font-medium underline">4.2k</p>

                        <span> Ratings </span>
                      </div>
                    </div>

                    {/* Sold */}
                    <div className="flex items-center mr-5">
                      <div className="flex justify-between gap-2 text-sm text-gray-600">
                        <p className="font-medium underline">10k+</p>

                        <span> Sold </span>
                      </div>
                    </div>
                  </div>

                  {/* Report Link */}
                  <a href="#" className="text-sm text-blue-600 hover:underline">
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
                        {/* safety/security logo */}
                        <svg
                          className="w-4 h-4 text-blue-600 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a1 1 0 01.894.553l7 14A1 1 0 0117 18H3a1 1 0 01-.894-1.447l7-14A1 1 0 0110 2z" />
                        </svg>
                        <span>
                          Free & Easy Returns · Merchandise Protection
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
                            Returns are completely free, with no need to contact
                            sellers.{" "}
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

                {/* Select Category */}
                <div className="space-y-2 my-3 text-xs text-muted-foreground">
                  <div className="grid grid-cols-5 gap-2">
                    <p className="font-medium">Colors</p>

                    {/* Option 1 */}
                    <button className="p-2 rounded border-2 transition border-primary bg-primary/10">
                      <div className="w-5 h-5 bg-white rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">White</p>
                    </button>
                    {/* Option 2 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-5 h-5 bg-black rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Black</p>
                    </button>
                    {/* Option 3 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-5 h-5 bg-red-700 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Red</p>
                    </button>
                    {/* Option 4 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-5 h-5 bg-blue-700 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Blue</p>
                    </button>
                  </div>
                  <div className="text-base text-gray-700 bg-blue-50 p-2 border border-blue-200">
                    <span className="text-sm font-bold">Selected Color:</span>
                    <span className="text-xs text-foreground mx-2 my-1">
                      White
                    </span>
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

                {/* Add To Cart and Buy Now Button */}
                <div className="space-y-2 my-5">
                  <div className="grid grid-cols-2">
                    <button
                      data-slot="button"
                      className="h-10 w-44 inline-flex items-center text-white text-xs justify-center gap-2 whitespace-nowrap rounded-md bg-blue-200 font-bold border-2 border-blue-300 focus:border-blue-500"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                    <button
                      data-slot="button"
                      className="h-10 w-44 inline-flex items-center text-white text-xs justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 border-2 border-blue-300 focus:border-blue-700"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mx-2 my-5">
            {/* 1st Column */}
            <div className="bg-background space-y-6 col-span-2">
              {/* Tabs */}
              <div className="relative w-auto h-auto sm:h-80 lg:h-96 overflow-hidden  h-auto col-span-2">
                {/* Tabs for Description, Reviews, Perfect For, Usage Guide */}
                <Tabs
                  defaultValue="productSpecification"
                  className="h-full w-full space-y-2 my-3"
                >
                  <TabsList className="flex flex-start border-blue-200 text-blue-600 hover:bg-none border border-top border-y-blue-100 border-x-blue-200 bg-transparent mb-3">
                    <TabsTrigger value="productSpecification">
                      Product Specification
                    </TabsTrigger>{" "}
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reviews">Product Reviews</TabsTrigger>
                    <TabsTrigger value="perfectFor">Perfect For</TabsTrigger>
                    <TabsTrigger value="usageGuide">Usage Guide</TabsTrigger>
                  </TabsList>

                  {/* Product Specification */}
                  <TabsContent
                    value="productSpecification"
                    className="flex border-border"
                  >
                    <Card className="border-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center font-bold text-gray-900">
                          Product Specifications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Model, Location Manufacturer, Delivery Date */}

                        <div className="flex f-full grid grid-rows items-center gap-5 my-2">
                          <p className="text-xs text-muted-foreground flex items-center">
                            Stock:
                            <span className="flex items-center text-foreground mx-2">
                              IN STOCK
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            Made In:
                            <span className="flex items-center text-foreground mx-2">
                              Country Name
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            Brand:
                            <span className="flex items-center text-foreground mx-2">
                              Brand Name
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            Weight
                            <span className="flex items-center text-foreground mx-2">
                              1kl
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            Height
                            <span className="flex items-center text-foreground mx-2">
                              23cm
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            Feature
                            <span className="flex items-center text-foreground mx-2">
                              Breathable, Flexible, Slip Resistant
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            Country of Origin
                            <span className="flex items-center text-foreground mx-2">
                              Location
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Description */}
                  <TabsContent value="description">
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center font-bold text-gray-900">
                          Product Description
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Model, Location Manufacturer, Delivery Date */}
                        <p className="flex items-center text-foreground mx-2 text-sm py-3">
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

                  {/* Reviews */}
                  <TabsContent value="reviews">
                    <Card className="border-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center font-bold text-gray-900">
                          Product Reviews
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Model, Location Manufacturer, Delivery Date */}
                        <p className="flex items-center text-foreground mx-2 text-sm py-3">
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

                  {/* Perfect For */}
                  <TabsContent value="perfectFor">
                    {/* Ideal For - Enhanced */}
                    {product.ideal_for && product.ideal_for.length > 0 && (
                      <Card className="border-none shadow-none">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center font-bold text-gray-900">
                            Product Reviews
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-3">
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

                  {/* Usage Guide */}
                  <TabsContent value="usageGuide">
                    {/* Ideal For - Enhanced */}
                    {product.ideal_for && product.ideal_for.length > 0 && (
                      <Card className="border-none shadow-none">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center font-bold text-gray-900">
                            Usage Guide
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {/* Model, Location Manufacturer, Delivery Date */}
                          <p className="flex items-center text-foreground mx-2 text-sm py-3">
                            The Nike Air Force 1 is a timeless sneaker first
                            released in 1982, known for its clean design,
                            versatile style, and groundbreaking Nike Air
                            cushioning technology. It remains one of the most
                            iconic shoes in both basketball and streetwear
                            culture.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* 2nd Column */}
            <div className="space-y-6 col-span-1">
              <div className="bg-background relative w-auto h-auto overflow-hidden">
                <div className="flex flex-col items-center justify-between w-full h-auto max-w-md bg-white rounded-lg px-5 py-5 shadow-sm">
                  {/* Seller Info */}
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
                      SHOP
                    </div>
                    {/* Seller Name */}
                    <span className="text-sm font-medium text-gray-800">
                      caq_mall
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 m-5">
                    <button className="w-32 h-10 mb-4 px-2 py-1.5 bg-blue-100 text-blue-600 border-2 border-blue-700 rounded-sm">
                      Chat Now
                    </button>

                    <button className="w-32 h-10 mb-4 px-2 py-2.5 text-sm font-medium text-gray-700 border border-gray-300  rounded-sm hover:bg-gray-100 flex">
                      More Sellers
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-background relative w-auto h-auto overflow-hidden">
                <div className="max-w-xl w-full bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Shop Vouchers
                  </h3>

                  {/* Voucher Card */}
                  <div className="grid grid-cols-[1fr_auto] items-center border border-blue-500 rounded-lg bg-blue-50 px-4 py-3">
                    <div className="text-sm text-gray-800">
                      <p className="text-blue-600 font-bold text-lg">₱5 OFF</p>
                      <p className="text-xs text-gray-600">Min. Spend ₱200</p>
                      <p className="text-xs text-gray-600 truncate">
                        Second Order Voucher
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Valid Till: 24.01.2026
                      </p>
                    </div>
                    <button className="ml-4 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                      Claim
                    </button>
                  </div>

                  {/* Voucher Card */}
                  <div className="grid grid-cols-[1fr_auto] items-center border border-blue-500 rounded-lg bg-blue-50 px-4 py-3">
                    <div className="text-sm text-gray-800">
                      <p className="text-blue-600 font-bold text-lg">₱5 OFF</p>
                      <p className="text-xs text-gray-600">Min. Spend ₱200</p>
                      <p className="text-xs text-gray-600 truncate">
                        Shop Welcome Voucher
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Valid Till: 24.01.2026
                      </p>
                    </div>
                    <button className="ml-4 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
