"use client";
import { useState, useMemo, useRef } from 'react';
import Badge from "@/components/product/Badge";
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Star } from 'lucide-react';
import ProductCard, { Product } from '@/components/product/ProductCard';
import FilterBar from "@/components/product/FilterBar";


// Mock product data - in a real app this would come from an API
const allProducts: Product[] = [
  { id: 1, name: 'Nike Air Force 1 Low White', price: 4500, original_price: 5000, rating: 4.8, sold: 12400, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 2, name: 'Nike Air Force 1 Mid Black', price: 5200, original_price: 6000, rating: 4.9, sold: 8900, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 3, name: 'Nike Air Force 1 High Triple White', price: 3800, rating: 4.6, sold: 15200, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 4, name: 'Nike Air Force 1 Shadow Pale Ivory', price: 6500, original_price: 7500, rating: 4.7, sold: 6300, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: false },
  { id: 5, name: 'Nike Air Force 1 Low University Blue', price: 4200, rating: 4.5, sold: 9800, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 6, name: 'Nike Air Force 1 07 LX UV Reactive', price: 7200, original_price: 8500, rating: 4.9, sold: 4100, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 7, name: 'Nike Air Force 1 Low Cactus Jack', price: 2800, rating: 4.3, sold: 18700, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 8, name: 'Nike Air Force 1 React White Ice', price: 5800, original_price: 6800, rating: 4.8, sold: 7200, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 9, name: 'Nike Air Force 1 Low Off-White', price: 8900, original_price: 10000, rating: 5.0, sold: 3400, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: false },
  { id: 10, name: 'Nike Air Force 1 Low Pink Foam', price: 3900, rating: 4.6, sold: 11200, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 11, name: 'Nike Air Force 1 Sage Low Triple White', price: 4600, original_price: 5200, rating: 4.7, sold: 8600, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 12, name: 'Nike Air Force 1 Low Wheat Mocha', price: 5400, rating: 4.8, sold: 6900, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 13, name: 'Nike Air Force 1 Low All Black', price: 4100, rating: 4.7, sold: 9500, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 14, name: 'Nike Air Force 1 Low Red', price: 4700, original_price: 5500, rating: 4.6, sold: 7800, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 15, name: 'Nike Air Force 1 Low Green', price: 4300, rating: 4.5, sold: 6700, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 16, name: 'Nike Air Force 1 Low Yellow', price: 4400, rating: 4.4, sold: 5900, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 17, name: 'Nike Air Force 1 Low Orange', price: 4600, original_price: 5300, rating: 4.7, sold: 8100, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
  { id: 18, name: 'Nike Air Force 1 Low Purple', price: 4800, rating: 4.8, sold: 7400, image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg', in_stock: true },
];

export default function SimilarProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSort, setCurrentSort] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 24;

  // Find the original product
  const originalProduct = allProducts.find(p => p.id === Number(id));

  // Get similar products (exclude the original product)
  const similarProducts = allProducts.filter(p => p.id !== Number(id));

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...similarProducts];

    // Apply sorting
    switch (currentSort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.sold - a.sold);
        break;
      case 'latest':
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
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const discountPercent = originalProduct?.original_price
    ? Math.round(((originalProduct.original_price - originalProduct.price) / originalProduct.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
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
                          <span className="text-orange-500 font-semibold">{originalProduct.rating.toFixed(1)}</span>
                          <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {originalProduct.rating.toFixed(1)} out of 5
                        </span>
                        <span className="text-sm text-gray-600">
                          ({Math.floor(originalProduct.sold / 100)} Ratings)
                        </span>
                        <span className="text-sm text-gray-600">
                          {originalProduct.sold >= 1000 ? `${Math.floor(originalProduct.sold / 1000)}k` : originalProduct.sold} Sold Monthly
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {originalProduct.original_price && originalProduct.original_price > originalProduct.price && (
                          <span className="text-gray-400 line-through text-lg">
                            ₽{originalProduct.original_price}
                          </span>
                        )}
                        {originalProduct.original_price && originalProduct.original_price > originalProduct.price && (
                          <span className="text-gray-400 line-through text-lg">
                            ₽{originalProduct.original_price + 200}
                          </span>
                        )}
                        <span className="text-orange-500 text-3xl font-bold">
                          ₽{originalProduct.price}
                        </span>
                        <span className="text-orange-500 text-lg">
                          - ₽{originalProduct.price + Math.floor(originalProduct.price * 0.3)}
                        </span>
                      </div>
                    </div>

                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200 w-fit">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Similar Products Section */}
            <div ref={productsRef}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>

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
                        navigate(`/similar/${product.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No similar products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Shop Identity - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
                  H
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">hotlistings_ph</h3>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">● Verified</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Products</span>
                  <span className="text-sm font-semibold text-gray-900">61.1K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ratings</span>
                  <span className="text-sm font-semibold text-gray-900">N/A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-semibold text-gray-900">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-sm font-semibold text-gray-900">2 years ago</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors duration-200">
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
    </div>
  );
}

