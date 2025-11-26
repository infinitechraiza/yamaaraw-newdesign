"use client";
import { useState, useMemo, useEffect, useRef } from "react";

import { useParams } from "react-router";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ETrikeLoader from "@/components/ui/etrike-loader";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FilterBar from "@/components/product/FilterBar";
import FilterSidebar, { FilterState } from "@/components/product/FilterSidebar";
import ProductCard, { Product } from "@/components/product/ProductCard";
import { ArrowLeft } from "lucide-react";

interface FeaturedProduct {
  id: number;
  name: string;
  model: string;
  category: string;
  price: number;
  original_price?: number;
  images: string[];
  featured: boolean;
  in_stock: boolean;
  description: string;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  title: string;
  message: string;
  created_at: string;
  product?: {
    name: string;
    model: string;
  };
}
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

export default function HomePage() {
  const { id } = useParams();
  const [currentSort, setCurrentSort] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    categories: [],
  });
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

  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    []
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch featured products and testimonials in parallel
      const [productsResponse, testimonialsResponse] = await Promise.all([
        fetch("/api/getfeatured"),
        fetch(
          `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/testimonials?featured=true`
        ),
      ]);

      console.log("Products response status:", productsResponse.status);
      console.log("Testimonials response status:", testimonialsResponse.status);

      if (productsResponse.ok) {
        const productsResult = await productsResponse.json();
        console.log("Products result:", productsResult);

        if (productsResult.success) {
          setFeaturedProducts(productsResult.data || []);
        }
      } else {
        console.error("Failed to fetch products:", productsResponse.status);
      }

      if (testimonialsResponse.ok) {
        const testimonialsResult = await testimonialsResponse.json();
        console.log("Testimonials result:", testimonialsResult);

        if (testimonialsResult.success) {
          // Get the first 3 testimonials for homepage display
          setTestimonials(testimonialsResult.data?.data?.slice(0, 3) || []);
        }
      } else {
        console.error(
          "Failed to fetch testimonials:",
          testimonialsResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Categories
  const items = [
    {
      label: "Sweatshirt",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Tripod",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Beach",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Sippy Cup",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Power Drill",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Toy",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Backpack",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Sunglasses",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Dress",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Vase",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Lipstick",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Green Dress",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Laptop",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Camera",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Watch",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Shoe",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
    {
      label: "Beanie",
      img: "https://i.pinimg.com/736x/3e/b0/95/3eb0951cd994932c11d281c352a2e0d0.jpg",
    },
  ];

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

      {/* Category Products Section with Filters */}
      <div className="max-w-7xl mx-auto p-4" ref={productsRef}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">All Products</h2>
          <p className="text-sm text-gray-600">
            {filteredAndSortedProducts.length} items
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar onFilterChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Bar with Pagination */}
            <FilterBar
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => {
                        window.location.href = `/products/`;
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
