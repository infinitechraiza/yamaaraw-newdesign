"use client";

import { useState, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { ArrowLeft, Star } from "lucide-react";
import ProductCard, { Product } from "@/components/product/ProductCard";
import FilterBar from "@/components/product/FilterBar";
import Badge from "@/components/product/Badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/product/Tabs";
import TopProductCard from "@/components/product/TopProductCard";

// Mock product data - in a real app this would come from an API
const allProducts: Product[] = [
  {
    id: 1,
    name: "Nike Air Force 1 Low White",
    price: 4500,
    original_price: 5000,
    rating: 4.8,
    sold: 12400,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 2,
    name: "Nike Air Force 1 Mid Black",
    price: 5200,
    original_price: 6000,
    rating: 4.9,
    sold: 8900,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 3,
    name: "Nike Air Force 1 High Triple White",
    price: 3800,
    rating: 4.6,
    sold: 15200,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 4,
    name: "Nike Air Force 1 Shadow Pale Ivory",
    price: 6500,
    original_price: 7500,
    rating: 4.7,
    sold: 6300,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: false,
  },
  {
    id: 5,
    name: "Nike Air Force 1 Low University Blue",
    price: 4200,
    rating: 4.5,
    sold: 9800,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 6,
    name: "Nike Air Force 1 07 LX UV Reactive",
    price: 7200,
    original_price: 8500,
    rating: 4.9,
    sold: 4100,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 7,
    name: "Nike Air Force 1 Low Cactus Jack",
    price: 2800,
    rating: 4.3,
    sold: 18700,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 8,
    name: "Nike Air Force 1 React White Ice",
    price: 5800,
    original_price: 6800,
    rating: 4.8,
    sold: 7200,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 9,
    name: "Nike Air Force 1 Low Off-White",
    price: 8900,
    original_price: 10000,
    rating: 5.0,
    sold: 3400,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: false,
  },
  {
    id: 10,
    name: "Nike Air Force 1 Low Pink Foam",
    price: 3900,
    rating: 4.6,
    sold: 11200,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 11,
    name: "Nike Air Force 1 Sage Low Triple White",
    price: 4600,
    original_price: 5200,
    rating: 4.7,
    sold: 8600,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 12,
    name: "Nike Air Force 1 Low Wheat Mocha",
    price: 5400,
    rating: 4.8,
    sold: 6900,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 13,
    name: "Nike Air Force 1 Low All Black",
    price: 4100,
    rating: 4.7,
    sold: 9500,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 14,
    name: "Nike Air Force 1 Low Red",
    price: 4700,
    original_price: 5500,
    rating: 4.6,
    sold: 7800,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 15,
    name: "Nike Air Force 1 Low Green",
    price: 4300,
    rating: 4.5,
    sold: 6700,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 16,
    name: "Nike Air Force 1 Low Yellow",
    price: 4400,
    rating: 4.4,
    sold: 5900,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 17,
    name: "Nike Air Force 1 Low blue",
    price: 4600,
    original_price: 5300,
    rating: 4.7,
    sold: 8100,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 18,
    name: "Nike Air Force 1 Low Purple",
    price: 4800,
    rating: 4.8,
    sold: 7400,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
];

// Top Products data by category
const topProductsByCategory = {
  cctv: [
    {
      id: 101,
      name: "1080P Camera Hidden Super Mini CCTV Wireless 140 Degree Wide",
      price: 142,
      monthly_sales: "Sold 8259",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 102,
      name: "V380 Pro BULB 2.4G/5G PTZ Camera Auto Tracking Night",
      price: 299,
      monthly_sales: "Sold 6721",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 103,
      name: "Bulb Dual Lens CCTV Camera 8MP+8MP V380 NO Wifi Neede",
      price: 365,
      monthly_sales: "Sold 5526",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 104,
      name: "TP-Link Tapo C200C Pan/Tilt Home Security Wi-Fi",
      price: 809,
      monthly_sales: "Sold 4360",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 105,
      name: "TP-Link Official Store | Tapo C200C | Indoor | Security CCTV",
      price: 840,
      monthly_sales: "Sold 3910",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 106,
      name: "V380 Pro CCTV Camera 8MP 5G",
      price: 380,
      monthly_sales: "Sold 8259",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
  ],
  flipflop: [
    {
      id: 201,
      name: "Comfortable Rubber Flipflop Sandals",
      price: 450,
      monthly_sales: "Sold 15K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 202,
      name: "Beach Style Summer Flipflop",
      price: 320,
      monthly_sales: "Sold 22K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 203,
      name: "Anti-Slip Home Flipflop Slippers",
      price: 280,
      monthly_sales: "Sold 18K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 204,
      name: "Outdoor Walking Flipflop Sandals",
      price: 520,
      monthly_sales: "Sold 12K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 205,
      name: "Stylish Colorful Flipflop Collection",
      price: 390,
      monthly_sales: "Sold 25K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 206,
      name: "Premium Leather Flipflop Sandals",
      price: 780,
      monthly_sales: "Sold 8K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
  ],
  perfume: [
    {
      id: 301,
      name: "Oil Based Inspired Perfume Long Lasting",
      price: 890,
      monthly_sales: "Monthly Sales 145K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 302,
      name: "Premium Designer Perfume Collection",
      price: 1200,
      monthly_sales: "Monthly Sales 98K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 303,
      name: "Luxury Fragrance Oil Based Perfume",
      price: 950,
      monthly_sales: "Monthly Sales 112K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 304,
      name: "Floral Scent Long Lasting Perfume",
      price: 750,
      monthly_sales: "Monthly Sales 87K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 305,
      name: "Masculine Woody Perfume Inspired",
      price: 1100,
      monthly_sales: "Monthly Sales 65K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 306,
      name: "Fresh Citrus Perfume Oil Based",
      price: 820,
      monthly_sales: "Monthly Sales 73K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
  ],
  powerbank: [
    {
      id: 401,
      name: "20000mAh Fast Charging Powerbank",
      price: 1450,
      monthly_sales: "Sold 45K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 402,
      name: "Slim Portable 10000mAh Powerbank",
      price: 890,
      monthly_sales: "Sold 62K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 403,
      name: "Solar Wireless Charging Powerbank",
      price: 2100,
      monthly_sales: "Sold 28K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 404,
      name: "Mini Compact 5000mAh Powerbank",
      price: 650,
      monthly_sales: "Sold 78K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 405,
      name: "Ultra Fast 30000mAh Powerbank",
      price: 1890,
      monthly_sales: "Sold 35K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 406,
      name: "LED Display Powerbank 15000mAh",
      price: 1250,
      monthly_sales: "Sold 41K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
  ],
  sandals: [
    {
      id: 501,
      name: "Fashionable Sandals For Women",
      price: 680,
      monthly_sales: "Sold 52K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 502,
      name: "Elegant Heel Sandals Designer",
      price: 1200,
      monthly_sales: "Sold 38K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 503,
      name: "Casual Flat Sandals Comfortable",
      price: 450,
      monthly_sales: "Sold 67K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 504,
      name: "Platform Sandals Trendy Style",
      price: 890,
      monthly_sales: "Sold 44K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 505,
      name: "Strappy High Heel Sandals",
      price: 1350,
      monthly_sales: "Sold 29K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 506,
      name: "Wedge Sandals Comfortable Walk",
      price: 950,
      monthly_sales: "Sold 48K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
  ],
  solar: [
    {
      id: 601,
      name: "Outdoor Solar Light Waterproof",
      price: 3200,
      monthly_sales: "Monthly Sales 70K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 602,
      name: "Garden Solar LED Light Set",
      price: 2800,
      monthly_sales: "Sold 55K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 603,
      name: "Motion Sensor Solar Light Security",
      price: 3500,
      monthly_sales: "Sold 42K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 604,
      name: "Decorative Solar String Lights",
      price: 1900,
      monthly_sales: "Sold 88K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 605,
      name: "Pathway Solar Stake Lights",
      price: 2400,
      monthly_sales: "Sold 61K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 606,
      name: "Bright Solar Flood Light Outdoor",
      price: 4200,
      monthly_sales: "Sold 33K+",
      image:
        "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
  ],
};

export default function SimilarProducts() {
  const { id } = useParams();
  const [currentSort, setCurrentSort] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 24;

  // Find the original product
  const originalProduct = allProducts.find((p) => p.id === Number(id));

  // Get similar products (exclude the original product)
  const similarProducts = allProducts.filter((p) => p.id !== Number(id));

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...similarProducts];

    // Apply sorting
    switch (currentSort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.sold - a.sold);
        break;
      case "latest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        // relevance - keep original order
        break;
    }

    return result;
  }, [currentSort, similarProducts]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const discountPercent = originalProduct?.original_price
    ? Math.round(
        ((originalProduct.original_price - originalProduct.price) /
          originalProduct.original_price) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => {
              window.location.href = `/`;
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Product Section */}
          <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">
                  Top Products
                </h2>
              </div>

              <Tabs defaultValue="cctv">
                <div className="mb-6 overflow-x-auto">
                  <TabsList className="inline-flex w-full justify-center gap-1 border-b-2 border-gray-200">
                    <TabsTrigger
                      value="cctv"
                      className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                    >
                      CCTV Wifi
                    </TabsTrigger>
                    <TabsTrigger
                      value="flipflop"
                      className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                    >
                      Flipflop
                    </TabsTrigger>
                    <TabsTrigger
                      value="perfume"
                      className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                    >
                      Oil Based Inspired Perfume
                    </TabsTrigger>
                    <TabsTrigger
                      value="powerbank"
                      className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                    >
                      Powerbank
                    </TabsTrigger>
                    <TabsTrigger
                      value="sandals"
                      className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                    >
                      Fashionable Sandals
                    </TabsTrigger>
                    <TabsTrigger
                      value="solar"
                      className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
                    >
                      Outdoor Solar Light
                    </TabsTrigger>
                    <button className="px-4 py-2 text-sm text-gray-600 hover:text-blue-500 whitespace-nowrap">
                      See More ▼
                    </button>
                  </TabsList>
                </div>

                {Object.entries(topProductsByCategory).map(
                  ([category, products]) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {products.map((product) => (
                          <TopProductCard
                            key={product.id}
                            product={product}
                            // onClick={() => navigate(`/product/${product.id}`)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  )
                )}
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
