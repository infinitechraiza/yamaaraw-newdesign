"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ETrikeLoader from "@/components/ui/etrike-loader";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import FilterBar from "@/components/product/FilterBar";
import FilterSidebar, { FilterState } from "@/components/product/FilterSidebar";
import ProductCard, { Product } from "@/components/product/ProductCard";
import Breadcrumb from "@/components/layout/Breadcrumb";

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

// Categories data
const categories = [
  {
    id: 1,
    name: "Laptops & Computers",
    icon: "https://cdn-icons-png.flaticon.com/512/3659/3659898.png",
  },
  {
    id: 2,
    name: "Pet Care",
    icon: "https://cdn-icons-png.flaticon.com/512/2138/2138440.png",
  },
  {
    id: 3,
    name: "Audio",
    icon: "https://cdn-icons-png.flaticon.com/512/2941/2941885.png",
  },
  {
    id: 4,
    name: "Home Appliances",
    icon: "https://cdn-icons-png.flaticon.com/512/2917/2917180.png",
  },
  {
    id: 5,
    name: "Cameras",
    icon: "https://cdn-icons-png.flaticon.com/512/3342/3342137.png",
  },
  {
    id: 6,
    name: "Sports & Travel",
    icon: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
  },
  {
    id: 7,
    name: "Home & Living",
    icon: "https://cdn-icons-png.flaticon.com/512/2917/2917242.png",
  },
  {
    id: 8,
    name: "Groceries",
    icon: "https://cdn-icons-png.flaticon.com/512/3050/3050464.png",
  },
  {
    id: 9,
    name: "Toys, Games & Collectibles",
    icon: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
  },
  {
    id: 10,
    name: "Women's Apparel",
    icon: "https://cdn-icons-png.flaticon.com/512/2609/2609358.png",
  },
  {
    id: 11,
    name: "Women's Bags",
    icon: "https://cdn-icons-png.flaticon.com/512/2609/2609358.png",
  },
  {
    id: 12,
    name: "Women Accessories",
    icon: "https://cdn-icons-png.flaticon.com/512/3050/3050155.png",
  },
  {
    id: 13,
    name: "Women's Shoes",
    icon: "https://cdn-icons-png.flaticon.com/512/2329/2329876.png",
  },
  {
    id: 14,
    name: "Men's Bags & Accessories",
    icon: "https://cdn-icons-png.flaticon.com/512/2913/2913133.png",
  },
  {
    id: 15,
    name: "Men's Shoes",
    icon: "https://cdn-icons-png.flaticon.com/512/2589/2589903.png",
  },
  {
    id: 16,
    name: "Men's Apparel",
    icon: "https://cdn-icons-png.flaticon.com/512/2609/2609358.png",
  },
  {
    id: 17,
    name: "Babies & Kids",
    icon: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
  },
];

export default function HomePage({ params }: { params: { id: string } }) {
  // Use params from Next.js, not useParams()
  const categoryId = parseInt(params.id, 10);

  const category = categories.find((c) => c.id === categoryId);

  const [currentSort, setCurrentSort] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const productsRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    categories: [],
  });
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const itemsPerPage = 24;

  // Products in this category
  const categoryProducts = allProducts.filter(
    (product) => product.category_id === categoryId
  );

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...categoryProducts];

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

    // Apply filters from FilterBar (price, rating, inStock)
    if (minPrice !== null) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter((p) => p.price <= maxPrice);
    }
    if (minRating !== null) {
      result = result.filter((p) => p.rating >= minRating);
    }
    if (inStockOnly) {
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
  }, [currentSort, categoryProducts, filters, minPrice, maxPrice, minRating, inStockOnly]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: category?.name || 'Category' }]} />
        </div>
      </div>

      {/* Category Products Section with Filters */}
      <div className="max-w-7xl mx-auto p-4" ref={productsRef}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold m-2 text-blue-600">
              {category ? category.name : "Category"}
            </h2>

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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => {
                      window.location.href = `/products/top/${product.id}`;
                    }}
                  />
                ))}
              </div>
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
