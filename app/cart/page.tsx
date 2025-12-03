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
  House,
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
  maxLength = 30,
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
      shopId: 1,
      shopName: "My Shop",
      name: "Air Red Pants",
      category: "Athletic Wear",
      description:
        "Premium quality athletic pants designed for maximum comfort and performance. Features moisture-wicking fabric and ergonomic fit for all-day wear.",
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
      shopId: 1,
      shopName: "My Shop",
      name: "Cool Dry Fit",
      category: "T-Shirts",
      description:
        "Breathable dry-fit t-shirt perfect for workouts and casual wear. Advanced cooling technology keeps you fresh throughout the day.",
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
      shopId: 1,
      shopName: "My Shop",
      name: "Sportswear Heritage Windrunner",
      category: "Jackets",
      description:
        "Classic windrunner jacket with heritage styling. Water-resistant material provides protection from the elements while maintaining breathability.",
      color: "Blue/White",
      size: "L",
      price: 55.0,
      originalPrice: null,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      shopId: 2,
      shopName: "Sports Store",
      name: "Running Shoes",
      category: "Footwear",
      description:
        "High-performance running shoes with advanced cushioning technology.",
      color: "Black/Orange",
      size: "10",
      price: 89.0,
      originalPrice: 120.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    },
    {
      id: 5,
      shopId: 2,
      shopName: "Sports Store",
      name: "Athletic Socks",
      category: "Accessories",
      description:
        "Comfortable athletic socks with moisture-wicking properties.",
      color: "White",
      size: "M",
      price: 12.0,
      originalPrice: null,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&h=200&fit=crop",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedShops, setSelectedShops] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Group items by shop
  const shops = cartItems.reduce(
    (acc, item) => {
      if (!acc[item.shopId]) {
        acc[item.shopId] = {
          id: item.shopId,
          name: item.shopName,
          items: [],
        };
      }
      acc[item.shopId].items.push(item);
      return acc;
    },
    {} as Record<number, { id: number; name: string; items: typeof cartItems }>
  );

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
    setSelectedItems((selected) => selected.filter((itemId) => itemId !== id));
  };

  const toggleSelect = (id: number) => {
    setSelectedItems((selected = []) =>
      selected.includes(id)
        ? selected.filter((itemId) => itemId !== id)
        : [...selected, id]
    );
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems((selected) =>
      selected.includes(id)
        ? selected.filter((itemId) => itemId !== id)
        : [...selected, id]
    );
  };
  const toggleSelectShop = (shopId: number) => {
    const shopItems = shops[shopId].items.map((item) => item.id);
    const allSelected = shopItems.every((id) => selectedItems.includes(id));

    if (allSelected) {
      // Deselect all items from this shop
      setSelectedItems((selected) =>
        selected.filter((id) => !shopItems.includes(id))
      );
      setSelectedShops((selected) => selected.filter((id) => id !== shopId));
    } else {
      // Select all items from this shop
      const newSelected = [...new Set([...selectedItems, ...shopItems])];
      setSelectedItems(newSelected);
      setSelectedShops((selected) => [...new Set([...selected, shopId])]);
    }
  };

  const isShopSelected = (shopId: number) => {
    const shopItems = shops[shopId].items.map((item) => item.id);
    return (
      shopItems.length > 0 &&
      shopItems.every((id) => selectedItems.includes(id))
    );
  };

  // Calculate totals for selected items only
  const selectedTotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedCount = selectedItems.length;

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
      setSelectedShops([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
      setSelectedShops(Object.values(shops).map((shop) => shop.id));
    }
  };

  const isAllSelected =
    selectedItems.length === cartItems.length && cartItems.length > 0;

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
      { threshold: 1 }
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
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Header Section */}
          <div className="bg-white shadow rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr className="text-gray-700 font-semibold">
                  <th className="w-[640px] px-4 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 accent-blue-500 cursor-pointer"
                      />
                      <span>Product</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Unit Price</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Total Price</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Shops and Products */}
          {Object.values(shops).map((shop) => (
            <div key={shop.id} className="space-y-0">
              {/* Shop Header */}
              <div className="bg-white flex items-center gap-2 shadow h-12 px-6 rounded-t">
                <input
                  type="checkbox"
                  checked={isShopSelected(shop.id)}
                  onChange={() => toggleSelectShop(shop.id)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <House className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg font-semibold text-gray-800">
                  {shop.name}
                </span>
              </div>

              {/* Products Section */}
              <div className="bg-white rounded-b shadow">
                <table className="min-w-full text-sm">
                  <tbody>
                    {shop.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="pl-4 py-4">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelectItem(item.id)}
                              className="w-5 h-5 accent-blue-500 cursor-pointer mt-1"
                            />
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded bg-gray-100 flex-shrink-0"
                            />
                            <div className="flex-1 w-full">
                              <h3 className="font-bold text-base text-gray-900 mb-1">
                                {item.name}
                              </h3>
                              <p className="font-medium text-xs text-gray-600 mb-1">
                                {item.category}
                              </p>
                              <ExpandableDescription
                                description={item.description}
                              />
                              <p className="text-xs text-gray-500">
                                Color: {item.color}
                              </p>
                              <p className="text-xs text-gray-500">
                                Size: {item.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-s py-4 align-top">
                          <span className="text-base font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <div className="text-xs text-gray-400 line-through">
                              ${item.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center border border-gray-300 rounded w-fit">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className="text-base font-bold text-red-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center align-top">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Footer Summary */}
          <div className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium">
                Select All ({selectedCount})
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="text-xl font-bold text-red-500">
                  ${selectedTotal.toFixed(2)}
                </span>
              </div>
              <button
                disabled={selectedCount === 0}
                className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Checkout ({selectedCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
