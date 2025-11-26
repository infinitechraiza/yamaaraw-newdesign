"use client";

import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart, Facebook, Twitter, Copy, Heart } from 'lucide-react';
import Badge from '@/components/product/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/product/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/product/Tabs';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/product/HoverCard';
import Carousel from '@/components/product/Carousel';
import CategoryCard from '@/components/product/CategoryCard';
import FilterSidebar, { FilterState } from '@/components/product/FilterSidebar';
import ProductCard, { Product } from '@/components/product/ProductCard';
import TopProductCard from '@/components/product/TopProductCard';
import FilterBar from '@/components/product/FilterBar';

// Mock product data
const product = {
  id: 1,
  name: 'Nike Air Force 1',
  price: 4500,
  original_price: 5000,
  in_stock: true,
  images: [
    'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg',
    'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg',
    'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg',
  ],
  ideal_for: ['Casual Wear', 'Sports', 'Street Style'],
};

// Mock products for filtering demo
const mockProducts: Product[] = [
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
];

// Categories data
const categories = [
  { name: 'Home Entertainment', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { name: 'Babies & Kids', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: 'Home & Living', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917242.png' },
  { name: 'Groceries', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050464.png' },
  { name: 'Toys, Games & Collectibles', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: "Women's Bags", icon: 'https://cdn-icons-png.flaticon.com/512/2609/2609358.png' },
  { name: 'Women Accessories', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png' },
  { name: "Women's Shoes", icon: 'https://cdn-icons-png.flaticon.com/512/2329/2329876.png' },
  { name: 'Pet Care', icon: 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png' },
  { name: 'Audio', icon: 'https://cdn-icons-png.flaticon.com/512/2941/2941885.png' },
  { name: 'Home Appliances', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917180.png' },
  { name: 'Laptops & Computers', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { name: 'Cameras', icon: 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png' },
  { name: 'Sports & Travel', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: "Men's Bags & Accessories", icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png' },
  { name: "Men's Shoes", icon: 'https://cdn-icons-png.flaticon.com/512/2589/2589903.png' },
  { name: 'Motors', icon: 'https://cdn-icons-png.flaticon.com/512/3097/3097039.png' },
  { name: 'Hobbies & Stationery', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: 'Gaming', icon: 'https://cdn-icons-png.flaticon.com/512/686/686589.png' },
  { name: 'Home Entertainment', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { name: 'Babies & Kids', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: 'Home & Living', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917242.png' },
  { name: 'Groceries', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050464.png' },
  { name: 'Toys, Games & Collectibles', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: "Women's Bags", icon: 'https://cdn-icons-png.flaticon.com/512/2609/2609358.png' },
  { name: 'Women Accessories', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png' },
  { name: "Women's Shoes", icon: 'https://cdn-icons-png.flaticon.com/512/2329/2329876.png' },
  { name: 'Pet Care', icon: 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png' },
  { name: 'Audio', icon: 'https://cdn-icons-png.flaticon.com/512/2941/2941885.png' },
  { name: 'Home Appliances', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917180.png' },
  { name: 'Laptops & Computers', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { name: 'Cameras', icon: 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png' },
  { name: 'Sports & Travel', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: "Men's Bags & Accessories", icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png' },
  { name: "Men's Shoes", icon: 'https://cdn-icons-png.flaticon.com/512/2589/2589903.png' },
  { name: 'Motors', icon: 'https://cdn-icons-png.flaticon.com/512/3097/3097039.png' },
  { name: 'Hobbies & Stationery', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: 'Gaming', icon: 'https://cdn-icons-png.flaticon.com/512/686/686589.png' },
  { name: 'Home Entertainment', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { name: 'Babies & Kids', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: 'Home & Living', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917242.png' },
  { name: 'Groceries', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050464.png' },
  { name: 'Toys, Games & Collectibles', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: "Women's Bags", icon: 'https://cdn-icons-png.flaticon.com/512/2609/2609358.png' },
  { name: 'Women Accessories', icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050155.png' },
  { name: "Women's Shoes", icon: 'https://cdn-icons-png.flaticon.com/512/2329/2329876.png' },
  { name: 'Pet Care', icon: 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png' },
  { name: 'Audio', icon: 'https://cdn-icons-png.flaticon.com/512/2941/2941885.png' },
  { name: 'Home Appliances', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917180.png' },
  { name: 'Laptops & Computers', icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
  { name: 'Cameras', icon: 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png' },
  { name: 'Sports & Travel', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: "Men's Bags & Accessories", icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png' },
  { name: "Men's Shoes", icon: 'https://cdn-icons-png.flaticon.com/512/2589/2589903.png' },
  { name: 'Motors', icon: 'https://cdn-icons-png.flaticon.com/512/3097/3097039.png' },
  { name: 'Hobbies & Stationery', icon: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  { name: 'Gaming', icon: 'https://cdn-icons-png.flaticon.com/512/686/686589.png' },
];

// Top Products data by category
const topProductsByCategory = {
  'cctv': [
    { id: 101, name: '1080P Camera Hidden Super Mini CCTV Wireless 140 Degree Wide', price: 142, monthly_sales: 'Sold 8259', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 102, name: 'V380 Pro BULB 2.4G/5G PTZ Camera Auto Tracking Night', price: 299, monthly_sales: 'Sold 6721', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 103, name: 'Bulb Dual Lens CCTV Camera 8MP+8MP V380 NO Wifi Neede', price: 365, monthly_sales: 'Sold 5526', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 104, name: 'TP-Link Tapo C200C Pan/Tilt Home Security Wi-Fi', price: 809, monthly_sales: 'Sold 4360', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 105, name: 'TP-Link Official Store | Tapo C200C | Indoor | Security CCTV', price: 840, monthly_sales: 'Sold 3910', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 106, name: 'V380 Pro CCTV Camera 8MP 5G', price: 380, monthly_sales: 'Sold 8259', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
  ],
  'flipflop': [
    { id: 201, name: 'Comfortable Rubber Flipflop Sandals', price: 450, monthly_sales: 'Sold 15K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 202, name: 'Beach Style Summer Flipflop', price: 320, monthly_sales: 'Sold 22K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 203, name: 'Anti-Slip Home Flipflop Slippers', price: 280, monthly_sales: 'Sold 18K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 204, name: 'Outdoor Walking Flipflop Sandals', price: 520, monthly_sales: 'Sold 12K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 205, name: 'Stylish Colorful Flipflop Collection', price: 390, monthly_sales: 'Sold 25K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 206, name: 'Premium Leather Flipflop Sandals', price: 780, monthly_sales: 'Sold 8K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
  ],
  'perfume': [
    { id: 301, name: 'Oil Based Inspired Perfume Long Lasting', price: 890, monthly_sales: 'Monthly Sales 145K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 302, name: 'Premium Designer Perfume Collection', price: 1200, monthly_sales: 'Monthly Sales 98K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 303, name: 'Luxury Fragrance Oil Based Perfume', price: 950, monthly_sales: 'Monthly Sales 112K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 304, name: 'Floral Scent Long Lasting Perfume', price: 750, monthly_sales: 'Monthly Sales 87K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 305, name: 'Masculine Woody Perfume Inspired', price: 1100, monthly_sales: 'Monthly Sales 65K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 306, name: 'Fresh Citrus Perfume Oil Based', price: 820, monthly_sales: 'Monthly Sales 73K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
  ],
  'powerbank': [
    { id: 401, name: '20000mAh Fast Charging Powerbank', price: 1450, monthly_sales: 'Sold 45K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 402, name: 'Slim Portable 10000mAh Powerbank', price: 890, monthly_sales: 'Sold 62K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 403, name: 'Solar Wireless Charging Powerbank', price: 2100, monthly_sales: 'Sold 28K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 404, name: 'Mini Compact 5000mAh Powerbank', price: 650, monthly_sales: 'Sold 78K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 405, name: 'Ultra Fast 30000mAh Powerbank', price: 1890, monthly_sales: 'Sold 35K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 406, name: 'LED Display Powerbank 15000mAh', price: 1250, monthly_sales: 'Sold 41K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
  ],
  'sandals': [
    { id: 501, name: 'Fashionable Sandals For Women', price: 680, monthly_sales: 'Sold 52K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 502, name: 'Elegant Heel Sandals Designer', price: 1200, monthly_sales: 'Sold 38K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 503, name: 'Casual Flat Sandals Comfortable', price: 450, monthly_sales: 'Sold 67K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 504, name: 'Platform Sandals Trendy Style', price: 890, monthly_sales: 'Sold 44K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 505, name: 'Strappy High Heel Sandals', price: 1350, monthly_sales: 'Sold 29K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 506, name: 'Wedge Sandals Comfortable Walk', price: 950, monthly_sales: 'Sold 48K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
  ],
  'solar': [
    { id: 601, name: 'Outdoor Solar Light Waterproof', price: 3200, monthly_sales: 'Monthly Sales 70K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 602, name: 'Garden Solar LED Light Set', price: 2800, monthly_sales: 'Sold 55K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 603, name: 'Motion Sensor Solar Light Security', price: 3500, monthly_sales: 'Sold 42K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 604, name: 'Decorative Solar String Lights', price: 1900, monthly_sales: 'Sold 88K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 605, name: 'Pathway Solar Stake Lights', price: 2400, monthly_sales: 'Sold 61K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
    { id: 606, name: 'Bright Solar Flood Light Outdoor', price: 4200, monthly_sales: 'Sold 33K+', image: 'https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg' },
  ],
};

export default function Home() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('White');
  const [currentSort, setCurrentSort] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    categories: [],
  });
  const productsRef = useRef<HTMLDivElement>(null);
  
  const itemsPerPage = 12;

  const colors = [
    { name: 'White', class: 'bg-white' },
    { name: 'Black', class: 'bg-black' },
    { name: 'Red', class: 'bg-red-700' },
    { name: 'Blue', class: 'bg-blue-700' },
  ];

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...mockProducts];

    // Apply filters
    result = result.filter((product) => {
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
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
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCategoryClick = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Products Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Top Products</h2>
          </div>
          
          <Tabs defaultValue="cctv">
            <div className="mb-6 overflow-x-auto">
              <TabsList className="inline-flex w-full justify-center gap-1 border-b-2 border-gray-200">
                <TabsTrigger value="cctv" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  CCTV Wifi
                </TabsTrigger>
                <TabsTrigger value="flipflop" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  Flipflop
                </TabsTrigger>
                <TabsTrigger value="perfume" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  Oil Based Inspired Perfume
                </TabsTrigger>
                <TabsTrigger value="powerbank" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  Powerbank
                </TabsTrigger>
                <TabsTrigger value="sandals" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  Fashionable Sandals
                </TabsTrigger>
                <TabsTrigger value="solar" className="px-4 py-2 text-sm whitespace-nowrap data-[state=active]:text-orange-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                  Outdoor Solar Light
                </TabsTrigger>
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-orange-500 whitespace-nowrap">
                  See More ▼
                </button>
              </TabsList>
            </div>

            {Object.entries(topProductsByCategory).map(([category, products]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {products.map((product) => (
                    <TopProductCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">CATEGORIES</h2>
          <Carousel itemsPerPage={10} rows={2}>
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                name={category.name}
                icon={category.icon}
                onClick={handleCategoryClick}
              />
            ))}
          </Carousel>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Container */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Thumbnails - Hidden on mobile, shown on lg+ */}
                <aside className="hidden lg:block lg:col-span-2">
                  <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <button
                        key={i}
                        className="group overflow-hidden rounded-md border-2 border-gray-200 transition hover:border-blue-500"
                        aria-label={`View Angle ${i}`}
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt={`Shoe Angle ${i}`}
                          className="aspect-square w-full object-cover transition group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                </aside>

                {/* Hero image */}
                <div className="lg:col-span-10">
                  <div className="overflow-hidden rounded-xl border-2 border-gray-200">
                    <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500">
                      Top-down view
                    </div>
                    <img
                      src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                      alt="Nike Air Force shoe top-down view"
                      className="w-full aspect-square lg:aspect-video object-cover"
                    />
                  </div>
                </div>

                {/* Mobile Thumbnails - Horizontal scroll */}
                <div className="lg:hidden col-span-1 overflow-x-auto">
                  <div className="flex gap-2 pb-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <button
                        key={i}
                        className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md border-2 border-gray-200 hover:border-blue-500"
                      >
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt={`Thumbnail ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share and Favorite */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Share:</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <Twitter className="w-5 h-5 text-sky-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                      <Copy className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm hover:text-red-600 transition">
                  <Heart className="w-5 h-5" />
                  <span className="hidden sm:inline">Favorite (44.1K)</span>
                  <span className="sm:hidden">(44.1K)</span>
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-100 text-red-600 border border-red-300">
                Save ₽{product.original_price - product.price}
              </Badge>
              <Badge className="bg-green-100 text-green-600 border border-green-300">
                ✓ In Stock
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-600 border border-yellow-300">
                ⭐ Featured
              </Badge>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-4 pb-4 border-b mb-4">
                <div className="flex items-center gap-1">
                  <span className="font-medium underline">5.0</span>
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium underline">4.2k</span> Ratings
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium underline">10k+</span> Sold
                </div>
                <a href="#" className="text-sm text-blue-600 hover:underline ml-auto">
                  Report
                </a>
              </div>

              {/* Price */}
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  ₽{product.price}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₽{product.original_price}
                </span>
              </div>

              {/* Vouchers */}
              <HoverCard>
                <HoverCardTrigger className="block mb-4 cursor-pointer">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Shop Vouchers:</span>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500 text-white text-xs">₽5 OFF</Badge>
                      <Badge className="bg-blue-500 text-white text-xs">₽5 OFF</Badge>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h3 className="font-semibold mb-3">Shop Vouchers</h3>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 border border-blue-200 rounded-lg bg-blue-50 p-3">
                        <img
                          src="https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg"
                          alt="Voucher"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 text-xs">
                          <p className="font-semibold text-blue-600">₽5 OFF</p>
                          <p className="text-gray-600">Min. spend ₽200</p>
                          <p className="text-gray-500">Valid: 24.01.2026</p>
                        </div>
                        <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                          Claim
                        </button>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* Shipping */}
              <HoverCard>
                <HoverCardTrigger className="block mb-4 cursor-pointer">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="font-medium text-gray-700">Shipping:</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Get by 25 - 26 Nov</p>
                      <p className="text-xs text-gray-600">Get ₽50 voucher if late</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h3 className="font-semibold mb-3">Shipping Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="border border-blue-200 rounded-lg bg-blue-50 p-3">
                      <h4 className="font-semibold text-blue-700 mb-2">Standard Local</h4>
                      <ul className="text-xs space-y-1 text-gray-700">
                        <li>• Get by 25 - 26 Nov</li>
                        <li>• ₽50 voucher if late</li>
                        <li>• Only ₽1 (from ₽36)</li>
                      </ul>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* Shopping Guarantee */}
              <HoverCard>
                <HoverCardTrigger className="block mb-4 cursor-pointer">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Guarantee:</span>
                    <span className="text-gray-600">Free Returns • Protection</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h3 className="font-semibold mb-3">Shopping Guarantee</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium mb-1">Free & Easy Returns</p>
                      <p className="text-xs text-gray-600">Returns are free with no seller contact needed.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Merchandise Protection</p>
                      <p className="text-xs text-gray-600">Protection from accidental damage.</p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              {/* Color Selection */}
              <div className="mb-4">
                <p className="font-medium text-sm mb-2">Colors</p>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`p-2 rounded border-2 transition ${
                        selectedColor === color.name
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className={`w-6 h-6 ${color.class} rounded border border-gray-300 mx-auto mb-1`}></div>
                      <p className="text-xs text-center truncate">{color.name}</p>
                    </button>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                  <span className="text-xs font-semibold">Selected: </span>
                  <span className="text-xs">{selectedColor}</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <p className="font-medium text-sm mb-2">Quantity</p>
                <div className="flex items-center gap-2 w-fit border-2 border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-bold"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="h-11 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100 border-2 border-blue-300 rounded hover:bg-blue-200 transition">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button className="h-11 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 border-2 border-blue-700 rounded hover:bg-blue-700 transition">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Tabs defaultValue="productSpecification">
                <TabsList className="flex flex-wrap gap-2 border-b pb-2 mb-6">
                  <TabsTrigger value="productSpecification">Specifications</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="perfectFor">Perfect For</TabsTrigger>
                  <TabsTrigger value="usageGuide">Usage Guide</TabsTrigger>
                </TabsList>

                <TabsContent value="productSpecification">
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-base">Product Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-32">Stock:</span>
                          <span className="font-medium">IN STOCK</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-32">Made In:</span>
                          <span className="font-medium">Vietnam</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-32">Brand:</span>
                          <span className="font-medium">Nike</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-32">Weight:</span>
                          <span className="font-medium">1kg</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-gray-600 w-32">Features:</span>
                          <span className="font-medium">Breathable, Flexible, Slip Resistant</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="description">
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-base">Product Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        The Nike Air Force 1 is a timeless sneaker first released in 1982, known for its clean design,
                        versatile style, and groundbreaking Nike Air cushioning technology. It remains one of the most
                        iconic shoes in both basketball and streetwear culture.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-base">Product Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">Customer reviews coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="perfectFor">
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-base">Perfect For</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {product.ideal_for.map((use, index) => (
                          <Badge key={index} className="bg-blue-500 text-white font-semibold px-3 py-2">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="usageGuide">
                  <Card className="border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-base">Usage Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Care instructions: Clean with a soft damp cloth. Avoid harsh chemicals. Store in a cool, dry place.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Seller Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold">
                  SHOP
                </div>
                <span className="text-sm font-semibold text-gray-900">caq_mall</span>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 border-2 border-blue-600 rounded font-semibold hover:bg-blue-200 transition">
                    Chat Now
                  </button>
                  <button className="flex-1 px-4 py-2 text-gray-700 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 transition">
                    View Shop
                  </button>
                </div>
              </div>High Performance
            </div>

            {/* Vouchers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-semibold mb-4">Shop Vouchers</h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-blue-300 rounded-lg bg-blue-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-blue-600 font-bold text-base">₽5 OFF</p>
                        <p className="text-xs text-gray-600">Min. Spend ₽200</p>
                        <p className="text-xs text-gray-500 mt-1">Valid: 24.01.2026</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                        Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section with Filters */}
        <div className="mt-8" ref={productsRef}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Products</h2>
            <p className="text-sm text-gray-600">{filteredAndSortedProducts.length} items</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar
                onFilterChange={setFilters}
              />
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No products found</p>
                  <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-gray-600 uppercase mb-4">From The Same Shop</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockProducts.slice(0, 6).map((product) => (
              <ProductCard key={`shop-${product.id}`} product={product} onClick={() => navigate(`/product/${product.id}`)} />
            ))}
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-gray-600 uppercase mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockProducts.slice(6, 12).map((product) => (
              <ProductCard key={`also-${product.id}`} product={product} onClick={() => navigate(`/product/${product.id}`)} />
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="mt-8 flex justify-center">
          <Card className="bg-gray-100 border border-gray-300 rounded-lg shadow hover:bg-gray-200 transition cursor-pointer">
            <div className="px-12 py-4">
              <p className="text-sm text-gray-600 text-center">Login To See More Products</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


