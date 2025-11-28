"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "react-router";
import { ArrowLeft, Star } from "lucide-react";
import ProductCard, { Product } from "@/components/product/ProductCard";
import FilterBar from "@/components/product/FilterBar";
import FilterSidebar, { FilterState } from "@/components/product/FilterSidebar";
import Badge from "@/components/product/Badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Breadcrumb from "@/components/layout/Breadcrumb";

import allProducts from "./productsData";

export default function SimilarProducts() {
  const { id } = useParams();
  const [currentSort, setCurrentSort] = useState("relevance");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    categories: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 24;

  // Find the original product
  const originalProduct = allProducts.find((p) => p.id === Number(id));

  // Get similar products (exclude the original product)
  const similarProducts = allProducts.filter((p) => p.id !== Number(id));

  // Filter and sort products (uses filters from the left sidebar)
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...similarProducts];

    // Apply price range filter from FilterSidebar
    if (filters.priceRange[0] > 0) {
      result = result.filter((p) => p.price >= filters.priceRange[0]);
    }
    if (filters.priceRange[1] < 10000) {
      result = result.filter((p) => p.price <= filters.priceRange[1]);
    }

    // Apply rating filter from FilterSidebar
    if (filters.rating > 0) {
      result = result.filter((p) => p.rating >= filters.rating);
    }

    // Apply in-stock filter from FilterSidebar
    if (filters.inStock) {
      result = result.filter((p) => p.in_stock === true);
    }

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
  }, [currentSort, similarProducts, filters]);

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const sessionData = localStorage.getItem("session");
      setIsLoggedIn(!!sessionData);
    } catch (e) {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: originalProduct?.name || 'Products' }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Filter Sidebar */}
          <div className="lg:col-span-3">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Main Content - Left Side */}
          <div className="lg:col-span-9 flex flex-col items-center w-full">
            {/* Featured Product */}
            {originalProduct && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8 w-full max-w-4xl">
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
                All Products
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
                <div className="w-full flex justify-center">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl">
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
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">
                    No similar products found
                  </p>
                </div>
              )}
            </div>
              {/* Login / See More card: shows appropriate action based on login state */}
              <div className="mt-8 w-full flex justify-center">
                <div className="w-full max-w-3xl rounded-lg p-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white border border-transparent shadow-md">
                  {isLoggedIn ? (
                    <Link href="/products" className="block text-center text-sm md:text-base font-medium">
                      See More
                    </Link>
                  ) : (
                    <Link href="/login" className="block text-center text-sm md:text-base font-medium">
                      Login To See More
                    </Link>
                  )}
                </div>
              </div>
          </div>

         
        </div>
      </div>

      <Footer />
    </div>
  );
}
