import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Package, Calendar, Truck, Share2, Store, CheckCircle, Clock, XCircle, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data
const mockOrder = {
  total: 2499.99,
  first_name: "Juan",
  last_name: "Dela Cruz",
  email: "juan.delacruz@email.com",
  phone: "+63 917 123 4567",
  address: "123 Rizal Street, Barangay Santa Cruz",
  city: "Quezon City",
  postal_code: "1100",
  payment_method: "gcash",
  created_at: "2024-12-01T10:30:00",
  tracking_number: "TRK-2024-QC-789456123",
  admin_notes: "Customer requested gift wrapping. Handle with care.",
  shop_name: "TechHub Philippines",
  items: [
    {
      id: 1,
      product: {
        name: "Wireless Gaming Mouse",
        model: "GMX-Pro 2024",
        description: "High-precision wireless gaming mouse with RGB lighting, 16000 DPI sensor, and programmable buttons. Features ergonomic design for extended gaming sessions.",
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"]
      },
      quantity: 2,
      price: 1299.99,
      color: "Matte Black"
    },
    {
      id: 2,
      product: {
        name: "Mechanical Keyboard",
        model: "KB-RGB-87",
        description: "Compact 87-key mechanical keyboard with Cherry MX switches and customizable RGB backlighting.",
        images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=400"]
      },
      quantity: 1,
      price: 1200.00,
      color: "White"
    }
  ]
};

const mockTracking = [
  {
    id: 1,
    status: "delivered",
    description: "Package Delivered",
    location: "Quezon City, Metro Manila",
    timestamp: "2024-12-03T14:30:00",
    admin_notes: "Left with building security"
  },
  {
    id: 2,
    status: "in_transit",
    description: "Out for Delivery",
    location: "Quezon City Hub",
    timestamp: "2024-12-03T08:00:00"
  },
  {
    id: 3,
    status: "processing",
    description: "Package Arrived at Local Facility",
    location: "Metro Manila Sorting Center",
    timestamp: "2024-12-02T18:45:00"
  },
  {
    id: 4,
    status: "processing",
    description: "Order Shipped",
    location: "Makati Warehouse",
    timestamp: "2024-12-01T16:20:00"
  }
];

const trackingSteps = [
  { id: 1, title: "Order Placed", icon: Package, color: "bg-blue-500", status: "completed" },
  { id: 2, title: "Processing", icon: Clock, color: "bg-orange-500", status: "completed" },
  { id: 3, title: "Shipped", icon: Truck, color: "bg-purple-500", status: "active" },
  { id: 4, title: "Delivered", icon: CheckCircle, color: "bg-green-500", status: "pending" }
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(price);
};

const ExpandableDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = description.length > 100;
  
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 leading-relaxed">
        {isExpanded || !isLong ? description : `${description.slice(0, 100)}...`}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const getTrackingIcon = (status) => {
  const iconClass = "w-6 h-6";
  switch (status) {
    case "delivered":
      return <CheckCircle className={`${iconClass} text-green-500`} />;
    case "in_transit":
      return <Truck className={`${iconClass} text-blue-500`} />;
    case "processing":
      return <Clock className={`${iconClass} text-orange-500`} />;
    default:
      return <Package className={`${iconClass} text-gray-400`} />;
  }
};

export default function OrderDetails() {
  const [isTrackingOpen, setIsTrackingOpen] = useState(true);
  const order = mockOrder;
  const tracking = mockTracking;

  const handleShare = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.product.name,
        text: `Check out this ${item.product.name}!`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Order Items */}
        <Card className="shadow-lg border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="w-6 h-6 text-blue-600" />
                Order Items ({order.items.length})
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200">
                <Store className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{order.shop_name}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-gradient-to-r from-white to-blue-50/30 border-2 border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="relative w-full h-48 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex-shrink-0 bg-white rounded-lg overflow-hidden border-2 border-gray-100 group-hover:border-blue-200 transition-colors">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1">
                            {item.product.name}
                          </h3>
                          {item.product.model && (
                            <p className="text-sm text-gray-500 font-medium mb-2">
                              Model: {item.product.model}
                            </p>
                          )}
                          
                          <ExpandableDescription description={item.product.description} />
                          
                          {item.color && (
                            <div className="inline-flex items-center gap-2 mt-3 bg-gray-100 px-3 py-1 rounded-full">
                              <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-300"></div>
                              <span className="text-xs font-medium text-gray-700">
                                {item.color}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Share Button */}
                        <button
                          onClick={() => handleShare(item)}
                          className="flex-shrink-0 p-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          title="Share product"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-200">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                          <Package className="w-4 h-4" />
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold text-blue-600 text-xl sm:text-2xl">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collapsible Track Order Timeline */}
        <Card className="shadow-lg border-2 border-gray-300">
          <button
            onClick={() => setIsTrackingOpen(!isTrackingOpen)}
            className="w-full text-left"
          >
            <CardHeader className="bg-gradient-to-r from-gray-50 to-transparent hover:from-gray-100 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="w-6 h-6 text-blue-600" />
                  Track Order
                </CardTitle>
                <ChevronUp 
                  className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                    isTrackingOpen ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </div>
            </CardHeader>
          </button>
          
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isTrackingOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <CardContent className="p-6">
              <div className="space-y-8">
                {trackingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <div key={step.id} className="relative flex gap-4">
                      {/* Timeline Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-6 top-14 w-1 h-full -mb-8 ${
                            step.status === "completed"
                              ? "bg-gradient-to-b from-blue-500 to-orange-500"
                              : step.status === "active"
                                ? "bg-gradient-to-b from-orange-500 to-gray-300"
                                : "bg-gray-300"
                          }`}
                        />
                      )}

                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full ${step.color} shadow-lg flex-shrink-0 ${
                          step.status === "pending" ? "opacity-40" : "opacity-100"
                        }`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <h3
                          className={`font-bold text-xl mb-1 ${
                            step.status === "pending"
                              ? "text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            step.status === "pending"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {step.status === "completed" ? "Completed" : step.status === "active" ? "In Progress" : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Detailed Tracking Information */}
        {tracking.length > 0 && (
          <Card className="shadow-lg border-2 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Truck className="w-6 h-6 text-blue-600" />
                Detailed Tracking History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {tracking.map((event, index) => (
                  <div key={event.id} className="relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getTrackingIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                            {event.description}
                          </h4>
                          <span className="text-sm text-gray-500 font-medium flex-shrink-0">
                            {new Date(event.timestamp).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium">{event.location}</span>
                        </p>
                        {event.admin_notes && (
                          <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                            <p className="text-sm text-blue-900">
                              <strong className="font-semibold">Note:</strong> {event.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < tracking.length - 1 && (
                      <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}