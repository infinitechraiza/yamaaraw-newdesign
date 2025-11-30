"use client";

import { useState, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { ArrowLeft, Star } from "lucide-react";
import { Product } from "@/components/product/ProductCard";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import TopProductCard from "@/components/product/top-product-card";
import { topProductsByCategory } from "@/components/product/top-product-card";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/product/tabs";



const cctvProducts = topProductsByCategory.cctv;

// Mock product data - in a real app this would come from an API
const allProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Acer Nitro 5",
    price: 34500,
    original_price: 39000,
    rating: 4.8,
    sold: 1400,
    image:
      "https://i.pinimg.com/1200x/80/68/33/806833e9c3fa5eeaf67ed38d0c6ca59f.jpg",
    in_stock: true,
  },
  {
    id: 2,
    category_id: 2,
    name: "Pet Brush",
    price: 1200,
    original_price: 3200,
    rating: 4.9,
    sold: 700,
    image:
      "https://down-ph.img.susercontent.com/file/ph-11134207-7ra0n-mdr5hv571pae7d.webp",
    in_stock: true,
  },
  {
    id: 3,
    category_id: 15,
    name: "Nike Air Force 1 High Triple White",
    price: 6800,
    rating: 4.6,
    sold: 15200,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 4,
    category_id: 1,
    name: "Wireless Bluetooth Headphones Sony WH-CH520 with 50-Hour Battery Life and Enhanced Sound Quality",
    price: 1999,
    original_price: 3500,
    rating: 4.7,
    sold: 220,
    image:
      "https://down-ph.img.susercontent.com/file/ph-11134207-7rasf-m9tk4bka5yir1c.webp",
    in_stock: false,
  },
  {
    id: 5,
    category_id: 4,
    name: "JISULIFE Handheld Fan Pro1S FA53,Speed(1-100) justable Turbo Mini Fan,5000mAh Battery Rechargeable Personal Fan,BrownHand-held",
    price: 999,
    original_price: 1790,
    rating: 4.5,
    sold: 23,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
  {
    id: 6,
    category_id: 4,
    name: "24H Waterproof Eyeliner - Smudge-Proof, Precise Lines for Weddings & Special Occasions",
    price: 1999,
    original_price: 1999,
    rating: 3.9,
    sold: 4500,
    image:
      "https://down-ph.img.susercontent.com/file/ph-11134207-7rasj-ma9j3gxx0ijy92.webp",
    in_stock: true,
  },
  {
    id: 7,
    category_id: 1,
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
    category_id: 6,
    name: "YOYO Travel Bag Women Men Waterproof Large Capacity Sport Gym With Shoe Duffle Bags #S1343",
    price: 180,
    original_price: 700,
    rating: 4.8,
    sold: 123200,
    image:
      "https://down-ph.img.susercontent.com/file/sg-11134201-7rd6w-m6tch18gn89n95.webp",
    in_stock: true,
  },
  {
    id: 9,
    category_id: 1,
    name: "4-Grids Baby Milk Powder Dispenser Portable Food and Snack Storage Box Sealed Moisture-proof Box",
    price: 65,
    original_price: 345,
    rating: 4.9,
    sold: 333400,
    image:
      "https://down-ph.img.susercontent.com/file/sg-11134201-825b4-mgd7dlfdhrt70e.webp",
    in_stock: false,
  },
  {
    id: 10,
    category_id: 17,
    name: "Nike Air Force 1 Low Pink Foam",
    price: 650,
    original_price: 1200,
    rating: 4.6,
    sold: 11200,
    image:
      "https://down-ph.img.susercontent.com/file/sg-11134201-7ra2o-m558g7oifba6fa.webp",
    in_stock: true,
  },
];

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
      <Header />
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
      {/* Top Products Section */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white">
          <h2 className="bg-white border-b border-blue-200 text-lg font-bold text-blue-400 text-center uppercase p-5 mb-2 rounded-t-xl">
            Top Products
          </h2>
        </div>

        <Tabs defaultValue="cctv">
          <div className="bg-white mb-6 overflow-x-auto">
            <TabsList className="inline-flex w-full justify-center gap-1 e border-b-2 border-gray-200 ">
              <TabsTrigger
                value="cctv"
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-200"
              >
                CCTV Wifi
              </TabsTrigger>
              <TabsTrigger
                value="flipflop"
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-200"
              >
                Flipflop
              </TabsTrigger>
              <TabsTrigger
                value="perfume"
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-200"
              >
                Oil Based Inspired Perfume
              </TabsTrigger>
              <TabsTrigger
                value="powerbank"
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-200"
              >
                Powerbank
              </TabsTrigger>
              <TabsTrigger
                value="sandals"
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-200"
              >
                Fashionable Sandals
              </TabsTrigger>
              <TabsTrigger
                value="solar"
                className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-200"
              >
                Outdoor Solar Light
              </TabsTrigger>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-blue-500 whitespace-nowrap">
                See More ▼
              </button>
            </TabsList>
          </div>

          {Object.entries(topProductsByCategory).map(([category, products]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                  <TopProductCard
                    key={product.id}
                    product={product}
                  // onClick={() => navigate(`/product/${product.id}`)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
