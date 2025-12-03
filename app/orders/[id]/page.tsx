"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Package,
  House,
  Truck,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  Share2,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  X,
  Trash2,
  Calendar,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { getCurrentUser } from "@/lib/auth";

import Breadcrumb from "@/components/layout/Breadcrumb";

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: number;
    product: {
      name: string;
      images: string[];
      description: string;
      model?: string;
    };
    quantity: number;
    price: number;
    color?: string;
  }>;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  tracking_number?: string;
  estimated_delivery?: string;
  order_notes?: string;
  admin_notes?: string;
}

interface TrackingEvent {
  id: number;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  admin_notes?: string;
}

// Component for expandable description
function ExpandableDescription({
  description,
  maxLength = 80,
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

export default function OrderDetailPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setShouldRender(false), 500);
    } else {
      setShouldRender(true);
      setTimeout(() => setIsOpen(true), 10);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Order Placed",
      description: "We have received your order",
      icon: Package,
      status: "completed",
      color: "bg-orange-500",
    },
    {
      id: 2,
      title: "Order Confirmed",
      description: "Your order has been confirmed",
      icon: Package,
      status: "completed",
      color: "bg-orange-500",
    },
    {
      id: 3,
      title: "Order Processed",
      description: "We are preparing your order",
      icon: CheckCircle,
      status: "active",
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "Ready to Ship",
      description: "Your order is ready",
      icon: Truck,
      status: "pending",
      color: "bg-gray-300",
    },
    {
      id: 5,
      title: "Out for Delivery",
      description: "Your order is on the way",
      icon: MapPin,
      status: "pending",
      color: "bg-gray-300",
    },
    {
      id: 6,
      title: "Order Cancelled",
      description: "We are preparing your order",
      icon: X,
      status: "cancelled",
      color: "bg-red-500",
    },
  ];

  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    fetchOrderDetail();
    fetchTrackingInfo();
  }, [orderId, router]);

  const fetchOrderDetail = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
    }
  };

  const fetchTrackingInfo = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
      const response = await fetch(`${apiUrl}/orders/${orderId}/tracking`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTracking(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = () => {
    try {
      const sessionData = localStorage.getItem("session");
      if (!sessionData) return null;
      const session = JSON.parse(sessionData);
      return session.token || null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-red-100 text-red-800 border-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrackingIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case "processing":
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
    }
  };

  const handleShare = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.product.name,
          text: item.product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Order Not Found
            </h1>
            <Button
              onClick={() => router.push("/orders")}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Order Details
              </h1>
              <p className="text-slate-300"> Order #{order.order_number}</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge
                className={`${getStatusColor(order.status)} text-sm sm:text-base lg:text-lg px-3 py-1 sm:px-4 sm:py-2`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white">
        <div className="bg-white flex flex-col items-center justify-between md:flex-row gap-4 border-b border-gray-200 px-44 py-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Orders", href: "/orders" },
              ...order.items.map((item) => ({
                label: `View Orders - ${item.product.name}`,
              })),
            ]}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Order Items */}
              <Card className="rounded-lg">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center justify-between gap-2 text-lg sm:text-xl">
                    <div className="flex items-center justify-between gap-2">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <span>Order Items ({order.items.length})</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <House className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <span>Shop Name</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg bg-white"
                      >
                        {/* Product Image */}
                        <div className="relative w-full h-48 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 mx-auto sm:mx-0">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80px, 96px"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight">
                                {item.product.name}
                              </h3>
                              {item.product.model && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.product.model}
                                </p>
                              )}

                              {/* Expandable Description */}
                              <ExpandableDescription
                                description={item.product.description}
                              />

                              {item.color && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Color: {item.color}
                                </p>
                              )}
                            </div>

                            {/* Share Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(item)}
                              className="self-start sm:self-center p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="font-bold text-blue-600 text-lg sm:text-xl">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Sample only tracking order design */}
              <div className="bg-card rounded-lg shadow-lg p-8 w-full text-card-foreground shadow-sm rounded-lg border border-2 border-gray-300">
                <button
                  onClick={handleToggle}
                  className="flex items-center justify-between w-full mb-8 text-left"
                >
                  <span className="flex items-center justify-between  text-xl font-bold text-gray-800">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                    Track Order
                  </span>
                  <div
                    className="text-gray-400 hover:text-gray-600 transition-transform duration-300"
                    style={{
                      transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </div>
                </button>

                {shouldRender && (
                  <div
                    className="relative transition-all duration-500 ease-in-out origin-top"
                    style={{
                      maxHeight: isOpen ? "1000px" : "0px",
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transform: isOpen ? "scaleY(1)" : "scaleY(0)",
                      transformOrigin: "top",
                    }}
                  >
                    {" "}
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const isLast = index === steps.length - 1;

                      return (
                        <div key={step.id} className="relative flex gap-4 pb-8">
                          {/* Timeline Line */}
                          {!isLast && (
                            <div
                              className={`absolute left-6 top-12 w-0.5 h-full ${
                                step.status === "completed"
                                  ? "bg-orange-500"
                                  : step.status === "active"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                              }`}
                            />
                          )}

                          {/* Icon Circle */}
                          <div
                            className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${step.color} flex-shrink-0`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <h3
                              className={`font-semibold text-lg ${
                                step.status === "pending"
                                  ? "text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              {step.title}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${
                                step.status === "pending"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tracking Information */}
              {tracking.length > 0 && (
                <Card className="bg-card rounded-lg shadow-lg p-8 w-full text-card-foreground shadow-sm rounded-lg border border-2 border-gray-300">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      Order Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 sm:space-y-6">
                      {tracking.map((event, index) => (
                        <div key={event.id} className="relative">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0 mt-1">
                              Asas{getTrackingIcon(event.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                  {event.description}
                                </h4>
                                <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                                  {new Date(event.timestamp).toLocaleDateString(
                                    "en-PH",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 flex-shrink-0 text-blue-400" />
                                <span>{event.location}</span>
                              </p>
                              {event.admin_notes && (
                                <p className="text-xs sm:text-sm text-blue-600 mt-2 bg-blue-50 p-2 sm:p-3 rounded-lg">
                                  <strong>Admin Note:</strong> {event.admin_notes}
                                </p>
                              )}
                            </div>
                          </div>
                          {index < tracking.length - 1 && (
                            <div className="absolute left-2 sm:left-2.5 mt-2 w-px h-6 sm:h-8 bg-gray-300"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">
                Review your order information below
              </p>
            </div>

            {/* Order Summary */}
            <Card className="lg:col-span-2 border-2 border-blue-200 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-blue-900">
                  <Package className="w-6 h-6 text-blue-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-base sm:text-lg">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.total * 0.9)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base sm:text-lg">
                    <span className="text-gray-700">Shipping Fee</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(order.total * 0.1)}
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-blue-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Full Name
                    </p>
                    <p className="font-medium text-gray-900 truncate">
                      {order.first_name} {order.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 truncate">
                      {order.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900">{order.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Delivery Address
                    </p>
                    <p className="font-medium text-gray-900 break-words leading-relaxed">
                      {order.address}
                      <br />
                      {order.city}, {order.postal_code}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Payment Method
                    </p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {order.payment_method}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Order Date
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-700 uppercase tracking-wide font-medium mb-1">
                        Tracking Number
                      </p>
                      <p className="font-mono text-sm font-bold text-blue-900 break-all">
                        {order.tracking_number}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Notes */}
            {order.admin_notes && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Admin Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 sm:p-4 rounded-lg leading-relaxed">
                    {order.admin_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
