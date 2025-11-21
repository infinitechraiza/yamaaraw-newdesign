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

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="bg-white h-screen text-card-foreground shadow-sm hover:shadow-lg group cursor-pointer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 space-y-4">
            <div className="space-y-9">
              {/* Main Image Container - Enhanced */}
              <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-white overflow-hidden shadow-xl m-5">
                {/* text-card-foreground flex-col gap-6 border py-6 shadow-sm bg-gradient-to-br from-slate-100 to-slate-50 
                aspect-square flex items-center justify-center overflow-hidden rounded-lg */}
                <Image
                  src={
                    product.images?.[selectedImageIndex] || "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="w-full w-[450px] text-card-foreground object-contain aspect-square shadow-sm bg-gradient-to-br from-slate-50 to-slate-50 
                  p-6 flex items-center justify-center overflow-hidden rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Navigation Arrows - Enhanced */}
                {product.images && product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg border-2 border-orange-200 hover:border-orange-300 z-10 sm:left-4"
                    >
                      <ChevronLeft className="w-4 h-4 text-orange-600 sm:w-6 sm:h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg border-2 border-orange-200 hover:border-orange-300 z-10 sm:right-4"
                    >
                      <ChevronRight className="w-4 h-4 text-orange-600 sm:w-6 sm:h-6" />
                    </Button>
                  </>
                )}

                {/* Enhanced Badges */}
                {discount > 0 && (
                  // bg-red-500 text-white text-sm px-3 py-1 font-bold border-yellow-600
                  <div className="absolute top-4 left-4 bg-red-500 border-red-600 text-white text-sm px-3 py-1 rounded-full text-base font-bold shadow-lg z-20">
                    -{discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images - Enhanced */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                        selectedImageIndex === index
                          ? "border-orange-500 shadow-lg scale-105"
                          : "border-gray-300 hover:border-orange-300 hover:shadow-md"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="h-[550px] object-contain p-2"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Tabs for Description, Reviews, Perfect For, Usage Guide */}
              <div className="relative w-full h-44 mx-5 px-5 h-screen text-card-foreground  group cursor-pointer">
                <Tabs defaultValue="description" className="mx-2 my-5">
                  <TabsList className="border-blue-200 text-blue-600 hover:bg-none border border-y border-y-blue-100 border-x-blue-200 bg-transparent">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="perfectFor">Perfect For</TabsTrigger>
                    <TabsTrigger value="usageGuide">Usage Guide</TabsTrigger>
                  </TabsList>

                  {/* Description */}
                  <TabsContent value="description">
                    {product.description}
                  </TabsContent>

                  {/* Reviews */}
                  <TabsContent value="reviews">
                    Change your Reviews here.
                  </TabsContent>

                  {/* Perfect For */}
                  <TabsContent value="perfectFor">

                    {/* Ideal For - Enhanced */}
                    {product.ideal_for && product.ideal_for.length > 0 && (
                      <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="pb-3">
                          {/* <CardTitle className="text-xl font-bold text-gray-900">
                            Perfect For
                          </CardTitle> */}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-3">
                            {product.ideal_for.map((use, index) => (
                              <Badge
                                key={index}
                                className="bg-blue-400 text-white text-base font-semibold px-4 py-2"
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
                    Change your Usage Guide here.
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* 1st Column */}
            <div className="space-y-5">
              {/* bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-orange-200 */}
              <div className="relative w-full h-full overflow-hidden p-2 sm:p-6">
                <h1 className="text-3xl font-bold text-balance">
                  {" "}
                  {product.name}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <span className="font-semibold">4.7</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    154 orders
                  </span>
                  <button className="text-xs text-destructive hover:underline">
                    Report
                  </button>
                </div>

                {/* Model, Location Manufacturer, Delivery Date */}
                <div className="grid grid-rows items-center gap-1 my-2">
                  <p className="text-xs text-muted-foreground flex items-center">
                    Made In:
                    <span className="flex items-center text-foreground mx-2 my-1">
                      Country Name
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Brand:
                    <span className="flex items-center text-foreground mx-2 my-1">
                      Brand Name
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Ships From:
                    <span className="flex items-center text-foreground mx-2 my-1">
                      Location
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    Delivery:
                    <span className="flex items-center text-foreground mx-2 my-1">
                      2 days delivery
                    </span>
                  </p>
                </div>

                {/* Title any events */}
                {/* <div className="w-full bg-destructive text-destructive-foreground p-3 rounded font-semibold flex items-center gap-2">
                  <span>🎁</span> Any Title Here
                </div>  */}

                <hr />
                {/* Selected Category */}
                <div className="space-y-3 sm:py-3 mb-2">
                  <p className="font-semibold">Colors</p>
                  <div className="grid grid-cols-5 gap-3">
                    {/* Option 1 */}
                    <button className="p-2 rounded border-2 transition border-primary bg-primary/10">
                      <div className="w-8 h-8 bg-yellow-300 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Yellow</p>
                    </button>
                    {/* Option 2 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-8 h-8 bg-green-300 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Green</p>
                    </button>
                    {/* Option 3 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-8 h-8 bg-red-300 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Red</p>
                    </button>
                    {/* Option 4 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-8 h-8 bg-blue-300 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Blue</p>
                    </button>
                    {/* Option 5 */}
                    <button className="p-2 rounded border-2 transition border-border hover:border-foreground">
                      <div className="w-8 h-8 bg-purple-300 rounded mx-auto mb-1"></div>
                      <p className="text-xs text-center truncate">Purple</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold rounded-xl">Quantity</p>
                  <div className="flex items-center gap-2 w-fit border-2 border-blue-300 focus:border-blue-500 rounded">
                    <button className="w-8 h-8 bg-blue-200 text-blue-700 hover:text-white hover:bg-blue-300 transition">
                      −
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">
                      1
                    </span>
                    <button className="w-8 h-8 bg-blue-200 text-blue-700 hover:text-white hover:bg-blue-300 transition">
                      +
                    </button>
                  </div>
                </div>

                {/* Enhanced Price Section */}
                <div className="space-y-2 sm:py-3 mb-2">
                  <p className="text-xs text-muted-foreground flex items-center">
                    Price:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      ₽{product.original_price}
                    </span>
                    <span className="text-md text-muted-foreground line-through">
                      ₽ {product.price}
                    </span>
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
                              {product.in_stock
                                ? "✓ In Stock"
                                : "✗ Out of Stock"}
                            </Badge>
                            {product.featured && (
                              <Badge className="bg-yellow-100 text-yellow-600 text-xs px-2 font-bold border-yellow-600">
                                ⭐<span> Featured</span>
                              </Badge>
                            )}
                          </div>
                        )}

                      {/* Stock Status and Featured Badge - Better positioning */}
                      <div className="flex flex-col items-start sm:items-end space-y-2"></div>
                    </span>
                  </div>
                </div>

                {/* Add To Cart and Buy Now Button */}
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <button
                      data-slot="button"
                      className="h-12 w-full inline-flex items-center text-white text-sm justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-2 font-bold border-blue-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-3" /> Add to Cart
                    </button>
                    <button
                      data-slot="button"
                      className="h-12 w-full inline-flex items-center text-white text-sm justify-center gap-2 whitespace-nowrap rounded-md bg-blue-200 px-2 font-bold border-blue-700"
                    >
                      Buy Now
                    </button>

                    <button
                      data-slot="button"
                      className="h-12 w-full inline-flex items-center text-white text-sm justify-center gap-2 whitespace-nowrap rounded-md bg-blue-200 px-2 font-bold border-blue-700"
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

      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        {/* original */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
          {/* Left Side - Images and Service Features */}
          <div className="space-y-6">
            {/* Main Image Container - Enhanced */}
            <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-orange-200">
              <Image
                src={product.images?.[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Navigation Arrows - Enhanced */}
              {product.images && product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg border-2 border-orange-200 hover:border-orange-300 z-10 sm:left-4"
                  >
                    <ChevronLeft className="w-4 h-4 text-orange-600 sm:w-6 sm:h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-lg border-2 border-orange-200 hover:border-orange-300 z-10 sm:right-4"
                  >
                    <ChevronRight className="w-4 h-4 text-orange-600 sm:w-6 sm:h-6" />
                  </Button>
                </>
              )}

              {/* Enhanced Badges */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-base font-bold shadow-lg z-20">
                  -{discount}% OFF
                </div>
              )}

              {product.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center shadow-lg z-20">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  Featured
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-orange-500 shadow-lg scale-105"
                        : "border-gray-300 hover:border-orange-300 hover:shadow-md"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info - Enhanced */}
          <div className="space-y-6">
            {/* Product Header - Enhanced */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-orange-200">
              <Badge className="bg-orange-500 text-white border-orange-600 mb-4 text-base font-semibold px-4 py-2">
                {product.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-base text-gray-600 font-medium">
                  Model:
                </span>
                <span className="text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  {product.model}
                </span>
              </div>

              {/* Enhanced Price Section */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border-2 border-orange-200 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <div className="text-2xl sm:text-2xl font-bold text-orange-600 mb-2">
                      {formatPrice(product.price)}
                    </div>
                    {product.original_price &&
                      product.original_price > product.price && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg text-gray-500 line-through font-medium">
                            {formatPrice(product.original_price)}
                          </span>
                          <Badge className="bg-red-500 text-white text-sm font-bold px-3 py-1">
                            Save{" "}
                            {formatPrice(
                              product.original_price - product.price
                            )}
                          </Badge>
                        </div>
                      )}
                  </div>

                  {/* Stock Status and Featured Badge - Better positioning */}
                  <div className="flex flex-col items-start sm:items-end space-y-2">
                    <Badge
                      className={`text-sm font-bold px-4 py-2 ${
                        product.in_stock
                          ? "bg-green-500 text-white border-green-600"
                          : "bg-red-500 text-white border-red-600"
                      }`}
                    >
                      {product.in_stock ? "✓ In Stock" : "✗ Out of Stock"}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-yellow-500 text-white text-sm px-3 py-1 font-bold border-yellow-600">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Purchase Section - Enhanced */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="quantity"
                      className="text-base font-bold text-gray-700"
                    >
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border-2 border-orange-300 rounded-lg px-4 py-3 text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button
                      disabled={!product.in_stock || addingToCart}
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg font-bold text-base sm:text-lg py-4 px-4 sm:px-6"
                    >
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      {addingToCart ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors - Enhanced */}
            {product.colors && product.colors.length > 0 && (
              <Card className="shadow-lg border-2 border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Available Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`flex items-center space-x-3 p-2 sm:p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                            selectedColorIndex === index
                              ? "border-orange-500 bg-orange-50 shadow-lg"
                              : "border-gray-300 hover:border-orange-300"
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-base font-semibold text-gray-900">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    {selectedColorIndex !== null &&
                      product.colors[selectedColorIndex] && (
                        <div className="text-base text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                          <span className="font-bold">Selected Color:</span>{" "}
                          {product.colors[selectedColorIndex].name}
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Technical Specifications - Enhanced */}
        {product.specifications && (
          <Card className="mt-12 shadow-xl border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
              <CardTitle className="text-2xl flex items-center font-bold text-gray-900">
                <Zap className="w-8 h-8 mr-3 text-orange-500" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-orange-200">
                      <th className="text-left py-3 px-4 sm:py-5 sm:px-8 font-bold text-lg text-gray-900 bg-orange-50">
                        Specification
                      </th>
                      <th className="text-left py-3 px-4 sm:py-5 sm:px-8 font-bold text-lg text-gray-900 bg-orange-50">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.specifications.dimensions && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Dimensions
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.dimensions}
                        </td>
                      </tr>
                    )}
                    {product.specifications.battery_type && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Battery Type
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.battery_type}
                        </td>
                      </tr>
                    )}
                    {product.specifications.motor_power && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Motor Power
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.motor_power}
                        </td>
                      </tr>
                    )}
                    {product.specifications.main_features && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Main Features
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.main_features}
                        </td>
                      </tr>
                    )}
                    {product.specifications.front_rear_suspension && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Suspension
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.front_rear_suspension}
                        </td>
                      </tr>
                    )}
                    {product.specifications.front_tires && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Front Tires
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.front_tires}
                        </td>
                      </tr>
                    )}
                    {product.specifications.rear_tires && (
                      <tr className="border-b border-orange-100 hover:bg-orange-50 transition-colors">
                        <td className="py-3 px-4 sm:py-5 sm:px-8 font-bold text-gray-800 text-sm sm:text-base">
                          Rear Tires
                        </td>
                        <td className="py-3 px-4 sm:py-5 sm:px-8 text-gray-900 text-sm sm:text-base font-medium">
                          {product.specifications.rear_tires}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
