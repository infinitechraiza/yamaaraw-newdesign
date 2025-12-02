"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ETrikeLoader from "@/components/ui/etrike-loader";
import {
  getCart,
  clearCart,
  updateCartQuantity,
  removeFromCart,
  type CartItem,
} from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import { useClientToast } from "@/hooks/use-client-toast";
import { useCart } from "@/contexts/cart-context";
import CheckoutSuccessHandler from "@/components/checkout-success-handler";

import Breadcrumb from "@/components/layout/Breadcrumb";
// Component for expandable description
function ExpandableDescription({
  description,
  maxLength = 50,
}: {
  description: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description.length > maxLength;

  if (!shouldTruncate) {
    return (
      <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 leading-relaxed">
        {description}
      </p>
    );
  }

  return (
    <div className="mt-1 sm:mt-2">
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {isExpanded ? description : `${description.slice(0, maxLength)}...`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 p-0 h-auto text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent"
      >
        {isExpanded ? (
          <>
            <span>Read less</span>
            <ChevronUp className="w-3 h-3 ml-1" />
          </>
        ) : (
          <>
            <span>Read more</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Air Red Pants",
      category: "Men's Pants",
      description:
        "Air Red Pants combine bold style with breathable comfort, perfect for active days or casual outings. Crafted from lightweight, moisture-wicking fabric, they keep you cool and dry throughout any activity. The striking red and white colorway adds a sporty edge, while the tailored fit ensures freedom of movement without sacrificing silhouette. Designed with an elastic waistband and reinforced stitching, they offer durability and all-day wearability. Whether you're hitting the gym or the streets, Air Red Pants deliver performance with flair.",
      color: "Red/White",
      size: "L",
      price: 45.0,
      originalPrice: 55.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Cool Dry Fit",
      category: "Men's Top",
      description:
        "Cool Dry Fit is engineered for peak performance, blending sleek design with advanced moisture-wicking technology. Its lightweight, breathable fabric keeps you cool and dry, even during intense workouts or humid conditions. The deep blue colorway adds a touch of understated style, while the athletic cut ensures unrestricted movement. Reinforced seams and a flexible fit make it ideal for both training and everyday wear. Whether you're at the gym or on the go, Cool Dry Fit delivers comfort, durability, and effortless style.",
      color: "Dark Blue",
      size: "L",
      price: 22.0,
      originalPrice: 35.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Sportswear Heritage Windrunner",
      category: "Men's Jacket",
      description:
        "The Sportswear Heritage Windrunner blends classic design with modern performance, inspired by iconic athletic silhouettes. Made from lightweight, water-resistant fabric, it offers protection and comfort in unpredictable weather. The blue and white colorway adds a fresh, sporty vibe, while the breathable mesh lining enhances airflow during movement. Featuring a full-zip front and adjustable hood, it’s built for versatility from workouts to weekend wear. With its timeless style and functional details, the Windrunner is a staple for active lifestyles.",
      color: "Blue/White",
      size: "L",
      price: 55.0,
      originalPrice: null,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const router = useRouter();
  const toast = useClientToast();
  const { refreshCart } = useCart();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setIsGuest(true);
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartItems = await getCart();
      setCart(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to Load", "Could not load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(id);
    try {
      const success = await updateCartQuantity(id, newQuantity);
      if (success) {
        await fetchCart();
        await refreshCart();
        toast.cartUpdated("Quantity updated successfully");
      } else {
        toast.error("Update Failed", "Could not update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Update Failed", "Could not update quantity");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setUpdating(id);
    try {
      const success = await removeFromCart(id);
      if (success) {
        await fetchCart();
        await refreshCart();
        toast.success("Item Removed", "Item has been removed from your cart");
      } else {
        toast.error("Remove Failed", "Could not remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Remove Failed", "Could not remove item");
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    try {
      const success = await clearCart();
      if (success) {
        setCart([]);
        await refreshCart();
        toast.success(
          "Cart Cleared",
          "All items have been removed from your cart"
        );
      } else {
        toast.error("Clear Failed", "Could not clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Clear Failed", "Could not clear cart");
    } finally {
      setClearing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price === null || price === undefined) {
      return "₱0.00";
    }
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const calculateSafeTotal = (cart: CartItem[]) => {
    return cart.reduce((total, item) => {
      const price = Number.parseFloat(item.price?.toString() || "0") || 0;
      const quantity = Number.parseInt(item.quantity?.toString() || "0") || 0;
      const itemTotal = price * quantity;
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  const subtotal = calculateSafeTotal(cart);
  const shipping = subtotal > 50000 ? 0 : 500;
  const total = subtotal + shipping;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <CheckoutSuccessHandler />
  //       <Header />
  //       <div className="flex items-center justify-center py-20">
  //         <ETrikeLoader />
  //       </div>
  //       <Footer />
  //     </div>
  //   );
  // }

  // if (cart.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <CheckoutSuccessHandler />
  //       <Header />
  //       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  //         <div className="text-center">
  //           <div className="w-24 h-24 sm:w-32 sm:h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //             <ShoppingBag className="w-16 h-16 text-orange-500" />
  //           </div>
  //           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
  //           <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
  //           <Button
  //             onClick={() => router.push("/products")}
  //             className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-4 sm:px-8 sm:py-3"
  //           >
  //             <ShoppingCart className="w-5 h-5 mr-2" />
  //             Continue Shopping
  //           </Button>
  //         </div>
  //       </div>
  //       <Footer />
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutSuccessHandler />
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Shopping Cart
              </h1>
              <p className="text-slate-300">
                Review your items and proceed to checkout
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <ShoppingCart className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white">
        <div className="bg-white max-w-7xl mx-auto border-b border-gray-200 px-8 py-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Continue Shopping" },
            ]}
          />
        </div>
      </section>

      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Order Section */}
          <div className="lg:col-span-2 rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Order ({cartItems.length})
              </h2>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex bg-white gap-4 p-6 border-b border-gray-200 last:border-0 relative"
                >
                  {/* Checkbox + Image */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded bg-gray-100"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <h3 className="font-medium text-sm text-gray-900 mb-1">
                      {item.category}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 border-t border-border leading-relaxed">
                      <ExpandableDescription description={item.description} />
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Color: {item.color}
                    </p>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                  </div>

                  {/* Price + Quantity Controls */}
                  <div className="flex flex-col items-end justify-between ">
                    <div className="text-right">
                      <span className="text-lg font-semibold text-red-500">
                        ${item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <p className="px-3 text-sm">{item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Payment Summary
            </h2>

            <div className="mb-6">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  UNREGISTERED ACCOUNT
                </p>
                <p className="font-bold text-lg mb-4">VC315665</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Summary</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Additional Discount</span>
                <span className="font-semibold text-red-500">- $0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Fee</span>
                <span
                  className={shipping === 0 ? "text-green-600 font-medium" : ""}
                >
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">
                  Total Amount
                </span>
                <span className="font-bold text-red-500 text-lg">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
              <p className="text-red-600 text-xs font-semibold">
                SALE EXPIRING IN: 21 HOURS, 31 MINUTES
              </p>
            </div>
          </div>
          {/* Payment Summary */}
        
        </div>
      </div>

      <Footer />
    </div>
  );
}
