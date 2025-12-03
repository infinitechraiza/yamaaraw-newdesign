"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ETrikeLoader from "@/components/ui/etrike-loader";
import TopProductCard from "@/components/product/top-product-card";
import Carousel from "@/components/product/Carousel";
import CategoryCard, {
  categoriesCard,
} from "@/components/product/category-card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { FilterState } from "@/components/product/filter-sidebar";
import ProductCard, { allProducts } from "@/components/product/product-card";
import AutoScrollProductCard, {
  row1Products,
  row2Products,
  row3Products,
} from "@/components/product/product-auto-scroll-card";
import AutoScrollBannerCard, {
  bannerCard,
} from "@/components/product/banner-auto-scroll-card";


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

export default function HomePage({ params }: { params: { id: string } }) {
  // start with 1 row visible
  const [visibleRows, setVisibleRows] = useState(1);

  // each row = 5 products (since md:grid-cols-5)
  const productsPerRow = 3;
  const visibleCount = visibleRows * productsPerRow;

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
    ],
  };

  const categories = categoriesCard;

  // Use params from Next.js, not useParams()
  const categoryId = parseInt(params.id, 10);

  const category = categories.find((c) => c.id === categoryId);

  const filteredProducts = allProducts.filter(
    (product) => product.category_id === categoryId
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("White");
  const [currentSort, setCurrentSort] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    categories: [],
  });

  const itemsPerPage = 12;

  const colors = [
    { name: "White", class: "bg-white" },
    { name: "Black", class: "bg-black" },
    { name: "Red", class: "bg-red-700" },
    { name: "green", class: "bg-green-700" },
  ];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply filters
    result = result.filter((product) => {
      // Price range filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.in_stock) {
        return false;
      }

      return true;
    });

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
  }, [filters, currentSort]);

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Detect client-side session presence
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem("session");
      setIsLoggedIn(!!sessionData);
    } catch (e) {
      setIsLoggedIn(false);
    }
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

  const productsRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCategoryClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // moving image in hero section

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
  const productRows = [
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      image: "https://via.placeholder.com/150",
    })),
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 11,
      name: `Product ${i + 11}`,
      image: "https://via.placeholder.com/150",
    })),
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 21,
      name: `Product ${i + 21}`,
      image: "https://via.placeholder.com/150",
    })),
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section>
        <div className="relative w-full h-full">
          <Swiper
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
            className="w-full h-64 md:h-96 lg:h-[500px]"
          >
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=500&fit=crop"
                  alt="Electronics Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-white text-4xl font-bold">
                    Electronics & Tech
                  </h2>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop"
                  alt="Home & Furniture Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-white text-4xl font-bold">
                    Home & Living
                  </h2>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&h=500&fit=crop"
                  alt="Food & Groceries Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-white text-4xl font-bold">
                    Fresh Food & Groceries
                  </h2>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1522706604291-210a56c3b376?w=1200&h=500&fit=crop"
                  alt="Sports & Fitness Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-white text-4xl font-bold">
                    Sports & Fitness
                  </h2>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=500&fit=crop"
                  alt="Books & Education Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-white text-4xl font-bold">
                    Books & Education
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>

          {/* Custom Pagination Styles */}
          <style jsx global>{`
            .swiper-pagination-bullet {
              width: 12px;
              height: 12px;
              margin: 0 5px;
              background-color: white;
              border-radius: 9999px;
              opacity: 0.7;
              transform: scale(1.2); /* bigger by default */
              transition:
                transform 0.3s ease,
                opacity 0.3s ease;
            }

            .swiper-pagination-bullet-active {
              background-color: #5168c2ff;
              opacity: 1;
              transform: scale(0.8); /* smaller when active */
            }
          `}</style>

          {/* Navigation Buttons */}
          <button
            className="group custom-prev absolute top-1/2 left-2 -translate-y-1/2 p-2 bg-gray-700/70 rounded shadow-lg z-20 hover:bg-gray-200 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white group-hover:text-black" />
          </button>

          <button
            className="group custom-next absolute top-1/2 right-2 -translate-y-1/2 p-2 bg-gray-700/70 rounded shadow-lg z-20 hover:bg-gray-200 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-white group-hover:text-black" />
          </button>
        </div>
      </section>

      {/* Banner For Promos/Announcements */}
      <section>
        <div className=" mx-auto">
          <AutoScrollBannerCard direction="left" products={bannerCard} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto my-8">
          <h2 className="bg-white border-b border-gray-200 text-lg font-bold text-gray-500 text-center uppercase p-5 mb-2 rounded-t-xl">
            Categories
          </h2>

          <Carousel itemsPerPage={8} rows={2} className="m-5">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                name={category.name}
                icon={category.icon}
                onClick={() => {
                  window.location.href = `/categories/${category.id}`;
                }}
              />
            ))}
          </Carousel>
        </div>
      </section>
      {/* Product Section */}
      <section className="relative py-2 bg-gradient-to-br from-slate-200 via-blue-100 to-orange-100 text-white overflow-hidden">
        {/* Blurred Background Rows */}
        <AutoScrollProductCard direction="right" products={row1Products} />
        <AutoScrollProductCard direction="left" products={row2Products} />
        <AutoScrollProductCard direction="right" products={row3Products} />
      </section>
      {/* Top Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto my-8">
          <h2 className="bg-white border-b border-gray-200 text-lg font-bold text-gray-500 text-center uppercase p-5 mb-2 rounded-t-xl">
            Top Products
          </h2>
          <Carousel itemsPerPage={1} rows={1}>
            {Object.entries(topProductsByCategory).map(
              ([categoryName, products]) => (
                <div key={categoryName} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                      <TopProductCard
                        key={product.id}
                        product={product}
                        onClick={() => {
                          window.location.href = `/products/top/${product.id}`;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </Carousel>
        </div>
      </section>
      {/* Daily Discover Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto my-8">
          <h2 className="bg-white border-b border-gray-200 text-lg font-bold text-gray-500 text-center uppercase p-5 mb-2 rounded-t-xl">
            Daily Discover
          </h2>

          <div className="min-h-full text-card-foreground h-auto">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 my-5">
              {allProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {allProducts.slice(0, visibleCount).map((product) => (
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
                  <p className="text-gray-500 text-lg mb-2">
                    No products found
                  </p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* To See More Product Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto my-8">
          {/* Login / See More card: shows appropriate action based on login state */}
          <div className="mt-8 w-full flex justify-center">
            <div className="w-44 max-w-3xl rounded-lg text-white ">
              {isLoggedIn === null ? (
                <p>Loading...</p>
              ) : isLoggedIn ? (
                visibleCount < allProducts.length && (
                  <button
                    onClick={() => setVisibleRows((prev) => prev + 1)}
                    className="w-44 max-w-3xl rounded-lg p-4 bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                  >
                    See More
                  </button>
                )
              ) : (
                <Link
                  href="/login"
                  className="w-44 max-w-3xl rounded-lg p-4 bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                >
                  Login To See More
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
