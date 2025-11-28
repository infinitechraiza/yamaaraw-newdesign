"use client";

import { useState, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { ArrowLeft, Star } from "lucide-react";
import ProductCard, { Product } from "@/components/product/ProductCard";
import FilterBar from "@/components/product/FilterBar";
import Badge from "@/components/product/Badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
    category_id: 3,
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
    category_id: 15,
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
    category_id: 17,
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
    category_id: 15,
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
          <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: originalProduct?.name || 'Products' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-9">
            {/* Featured Product */}
            {originalProduct && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Product Image */}
                  <div className="md:col-span-3">
                    <div className="relative">
                      {discountPercent > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
                          -{discountPercent}%
                        </Badge>
                      )}
                      <img
                        src={originalProduct.image}
                        alt={originalProduct.name}
                        className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="md:col-span-9 flex flex-col justify-between">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {originalProduct.name}
                      </h1>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-500 font-semibold">
                            {originalProduct.rating.toFixed(1)}
                          </span>
                          <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {originalProduct.rating.toFixed(1)} out of 5
                        </span>
                        <span className="text-sm text-gray-600">
                          ({Math.floor(originalProduct.sold / 100)} Ratings)
                        </span>
                        <span className="text-sm text-gray-600">
                          {originalProduct.sold >= 1000
                            ? `${Math.floor(originalProduct.sold / 1000)}k`
                            : originalProduct.sold}{" "}
                          Sold Monthly
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {originalProduct.original_price &&
                          originalProduct.original_price >
                            originalProduct.price && (
                            <span className="text-gray-400 line-through text-lg">
                              ₽{originalProduct.original_price}
                            </span>
                          )}
                        {originalProduct.original_price &&
                          originalProduct.original_price >
                            originalProduct.price && (
                            <span className="text-gray-400 line-through text-lg">
                              ₽{originalProduct.original_price + 200}
                            </span>
                          )}
                        <span className="text-blue-500 text-3xl font-bold">
                          ₽{originalProduct.price}
                        </span>
                        <span className="text-blue-500 text-lg">
                          - ₽
                          {originalProduct.price +
                            Math.floor(originalProduct.price * 0.3)}
                        </span>
                      </div>
                    </div>

                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200 w-fit">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Products Section */}
            <div ref={productsRef}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Similar Products
              </h2>

              {/* Sort Bar with Pagination */}
              <FilterBar
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />

              {/* Products Grid */}
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => {
                        // When clicking a similar product, navigate to its similar products page
                        // navigate(`/similar/${product.id}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">
                    No similar products found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shop Identity - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  H
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    hotlistings_ph
                  </h3>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    ● Verified
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Products</span>
                  <span className="text-sm font-semibold text-gray-900">
                    61.1K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ratings</span>
                  <span className="text-sm font-semibold text-gray-900">
                    N/A
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    98%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-sm font-semibold text-gray-900">
                    2 years ago
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200">
                  Chat Now
                </button>
                <button className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold border-2 border-gray-300 rounded-md transition-colors duration-200">
                  View Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
