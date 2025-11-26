"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Play,
  Gift,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/product/product-grid";
import HeroImageSlider from "@/components/ui/hero-image-slider";
import TestimonialForm from "@/components/testimonial/testimonial-form";
import ETrikeLoader from "@/components/ui/etrike-loader";
import TestimonialCarousel from "@/components/testimonial/testimonial-carousel";
import { Card, CardContent } from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

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

export default function HomePage() {
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Mobile: Image First, Desktop: Text First */}
            <div className="order-2 lg:order-1 space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  🔥 Flash Sale - Up to 50% OFF
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    Electric Mobility
                  </span>
                </h1>
                <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
                  Experience premium electric vehicles designed for modern urban
                  transport, eco-conscious commuting, and sustainable living.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg font-semibold"
                >
                  <Link href="/products" className="flex items-center">
                    Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">50K+</div>
                  <div className="text-sm text-slate-300">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">100+</div>
                  <div className="text-sm text-slate-300">Service Centers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    2 Years
                  </div>
                  <div className="text-sm text-slate-300">Warranty</div>
                </div>
              </div>
            </div>

            {/* Mobile: Image First, Desktop: Image Second */}
            <div className="relative h-80 lg:h-96 order-1 lg:order-2">
              <HeroImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-white">
            <Gift className="w-6 h-6 animate-bounce" />
            <span className="font-bold text-lg">MEGA SALE</span>
            <span className="text-orange-200">•</span>
            <span>Free Shipping on Orders Over ₱50,000</span>
            <span className="text-orange-200">•</span>
            <span>2-Year Warranty Included</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto my-8">
          <div className="min-h-full text-card-foreground h-auto">
            <div className="relative grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
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
                className="w-full h-64"
              >
                <SwiperSlide>
                  <div className="bg-blue-300 flex items-center justify-center h-full">
                    Banner 1
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-blue-300 flex items-center justify-center h-full">
                    Banner 2
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-blue-300 flex items-center justify-center h-full">
                    Banner 3
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-blue-300 flex items-center justify-center h-full">
                    Banner 4
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-blue-300 flex items-center justify-center h-full">
                    Banner 5
                  </div>
                </SwiperSlide>
              </Swiper>
              <style jsx>{`
                :global(.swiper-pagination-bullet) {
                  @apply w-3 h-3 mx-5 bg-white rounded-full opacity-70;
                }
                :global(.swiper-pagination-bullet-active) {
                  @apply bg-red-500 opacity-100 scale-110;
                }
              `}</style>

              {/* Overlay chevrons */}
              <button
                className="group custom-prev absolute top-1/2 left-1 -translate-y-1/2 p-2 bg-gray/70 shadow z-20 hover:bg-gray-200"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="h-6 w-6 text-white group-hover:text-black" />
              </button>

              <button
                className="group custom-next absolute top-1/2 right-1 -translate-y-1/2 p-2 bg-gray/70 shadow z-20 hover:bg-gray-200"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="h-6 w-6 text-white group-hover:text-black" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-10 bg-white">
        <h2 className="text-xl font-semibold text-center mb-6">CATEGORIES</h2>
        <Swiper
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={6}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
          modules={[Navigation]}
        >
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="mt-2 text-sm">{item.label}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto my-8">
          <div className="min-h-full text-card-foreground h-auto">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
              {/* Product Section */}
              <div className="space-y-6">
                <div className="grid lg:grid-cols-6 gap-4 my-4">
                  <Card className="group relative bg-white flex justify-center w-auto h-auto m-auto border border-border border-gray-200 rounded-none shadow-lg transition-all duration-300 group-hover:border-5 group-hover:border-blue-400">
                    <button
                      className="relative overflow-hidden transition"
                      aria-label="View Angle 1"
                    >
                      <Badge className="absolute bg-red-300 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-tl-lg rounded-r-none border-l-red-200 shadow-sm group-hover:border-5 hover:bg-orange-300 hover:text-orange-900">
                        -10%
                      </Badge>
                      <img
                        src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                        alt="Shoe Angle 1"
                        className="flex h-56 w-full aspect-[4/3] object-cover transition"
                      />
                      <div className="mx-3 my-2">
                        <p className="line-clamp-2 text-sm text-gray-900 max-w-[320px] text-sm text-start text-foreground">
                          Nike Air Force
                        </p>
                      </div>
                      <div className="flex flex-cols gap-2 mx-3 my-3">
                        <Badge className="w-12 h-5 px-0.2 bg-blue-200 text-xs text-center border border-border border-blue-600 text-blue-600 rounded-none border border-border border-blue-600  hover:border-blue-600 shadow-sm">
                          ₽5 OFF
                        </Badge>
                        <Badge className="w-12 h-5 px-0.2 bg-blue-300 text-xs text-center border border-none rounded-none border border-border hover:border-blue-600 shadow-sm">
                          ₽5 OFF
                        </Badge>
                        <Badge className="w-12 h-5 px-0.2 bg-yellow-200 text-xs text-center text-blackborder border-border border-orange-500 rounded-none border border-border shadow-sm hover:text-yellow-200">
                          <span className="text-xs text-yellow-500 m-2">★</span>{" "}
                          4.8
                        </Badge>
                      </div>
                      <div className="flex flex-cols gap-2 mx-3 my-2">
                        <p className="text-start text-xs font-bold text-blue-600">
                          ₽ 100
                        </p>
                        <p className="text-end text-xs font-foreground">
                          10.6K Sold
                        </p>
                      </div>
                    </button>

                    <Button className="hidden group-hover:block absolute bottom-0 right-0 w-full h-auto text-white rounded-none border border-border shadow-sm group-hover:bg-blue-300 group-hover:text-blue-900">
                      <span className="text-xs text-center text-blue-500">
                        Find Similar
                      </span>
                    </Button>
                  </Card>{" "}
                  <Card className="group relative bg-white flex justify-center w-auto h-auto m-auto border border-border border-gray-200 rounded-none shadow-lg transition-all duration-300 group-hover:border-5 group-hover:border-blue-400">
                    <Link href={`/products/12`}>
                      <button
                        className="relative overflow-hidden transition"
                        aria-label="View Angle 1"
                      >
                        <Badge className="absolute bg-red-300 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-tl-lg rounded-r-none border-l-red-200 shadow-sm hover:bg-orange-300">
                          -10%
                        </Badge>
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Shoe Angle 1"
                          className="flex h-56 w-full aspect-[4/3] object-cover transition"
                        />
                        <div className="mx-3 my-2">
                          <p className="line-clamp-2 text-sm text-gray-900 max-w-[320px] text-sm text-start text-foreground">
                            Nike Air Force
                          </p>
                        </div>
                        <div className="flex flex-cols gap-2 mx-3 my-3">
                          <Badge className="w-12 h-5 px-0.2 bg-blue-200 text-xs text-center border border-border border-blue-600 text-blue-600 rounded-none border border-border border-blue-600  hover:border-blue-600 shadow-sm">
                            ₽5 OFF
                          </Badge>
                          <Badge className="w-12 h-5 px-0.2 bg-blue-300 text-xs text-center border border-none rounded-none border border-border hover:border-blue-600 shadow-sm">
                            ₽5 OFF
                          </Badge>
                          <Badge className="w-12 h-5 px-0.2 bg-yellow-200 text-xs text-center text-blackborder border-border border-orange-500 rounded-none border border-border shadow-sm hover:text-yellow-200">
                            <span className="text-xs text-yellow-500 m-2">
                              ★
                            </span>{" "}
                            4.8
                          </Badge>
                        </div>
                        <div className="flex flex-cols gap-2 mx-3 my-3">
                          <p className="text-start text-xs font-bold text-blue-600">
                            ₽ 100{" "}
                            <span className="text-xs text-gray-400 line-through">
                              {" "}
                              ₽ 100
                            </span>
                          </p>
                        </div>
                      </button>
                    </Link>

                    <Button className="hidden group-hover:block absolute bottom-0 right-0 w-full h-auto text-white rounded-none border border-border shadow-sm group-hover:bg-blue-300 group-hover:text-blue-900">
                      <span className="text-xs text-center text-blue-500">
                        Find Similar
                      </span>
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto my-8">
          <div className="min-h-full text-card-foreground h-auto">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 mx-2 my-5">
              <div className="mx-auto space-y-6">
                <Card className="bg-gray-100 w-auto h-14 pt-5 m-2 border border-border border-gray-300 rounded-none shadow-lg transition-all duration-300 hover:bg-gray-200">
                  <p className="flex justify-center  justify-center text-xs w-56 text-gray-400 mx-96 text-center">
                    Login To See More/See More Products
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

   


      <Footer />
    </div>
  );
}
