"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
import TopProductCard from "@/components/product/TopProductCard";
import Carousel from "@/components/product/Carousel";
import CategoryCard from "@/components/product/CategoryCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import FilterBar from "@/components/product/FilterBar";
import FilterSidebar, { FilterState } from "@/components/product/FilterSidebar";
import ProductCard, { Product } from "@/components/product/ProductCard";

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
    { name: "Blue", class: "bg-blue-700" },
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-red-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="min-h-full text-card-foreground h-auto">
          <div className="relative grid grid-cols-1 lg:grid-cols-1 gap-3">
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
        </div>{" "}
        <div className="bg-gradient-to-r from-blue-600 to-red-600 flex items-center justify-center space-x-4 text-white py-4">
          <Gift className="w-6 h-6 animate-bounce" />
          <span className="font-bold text-lg">MEGA SALE</span>
          <span className="text-blue-200">•</span>
          <span>Free Shipping on Orders Over ₱50,000</span>
          <span className="text-blue-200">•</span>
          <span>2-Year Warranty Included</span>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-blue-400 uppercase p-5 mb-2 border-b-2 border-blue-500">
            Categories
          </h2>

          <Carousel itemsPerPage={10} rows={1}>
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
      </div>

      {/* Top Products Section */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-blue-400 uppercase p-5 mb-2 border-b-2 border-blue-500">
            Top Products
          </h2>
          <Carousel itemsPerPage={1} rows={1}>
            {Object.entries(topProductsByCategory).map(
              ([categoryName, products]) => (
                <div key={categoryName} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      </div>

      {/* Daily Discover Section */}

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white">
          <h2 className="text-lg text-center font-bold text-blue-400 uppercase p-5 mb-2 border-b-2 border-blue-500 uppercase">
            Daily Discover
          </h2>
        </div>

        <div className="min-h-full text-card-foreground h-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 my-5">
            {/* You May Also Like Section */}
            {allProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {allProducts.map((product) => (
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

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto my-8">
          {/* Login / See More card: shows appropriate action based on login state */}
          <div className="mt-8 w-full flex justify-center">
            <div className="w-full max-w-3xl rounded-lg p-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white border border-transparent shadow-md">
              {isLoggedIn ? (
                <Link
                  href="/products"
                  className="block text-center text-sm md:text-base font-medium"
                >
                  See More
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-center text-sm md:text-base font-medium"
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
