import Badge from "./Badge";
import { Card } from "./Card";

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  original_price?: number;
  rating: number;
  sold: number;
  image: string;
  in_stock: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

// Mock product data - in a real app this would come from an API
const allProducts: Product[] = [
  {
    id: 1,
    category_id: 1,
    name: "Acer Nitro 5",
    price: 34500,
    original_price: 5000,
    rating: 4.8,
    sold: 1400,
    image:
      "https://i.pinimg.com/1200x/80/68/33/806833e9c3fa5eeaf67ed38d0c6ca59f.jpg",
    in_stock: true,
  },
  {
    id: 2,
    category_id: 1,
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
    category_id: 1,
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
    category_id: 1,
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
    category_id: 1,
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
    category_id: 1,
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
    category_id: 1,
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
    category_id: 1,
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
    category_id: 1,
    name: "Nike Air Force 1 Low Pink Foam",
    price: 3900,
    rating: 4.6,
    sold: 11200,
    image:
      "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    in_stock: true,
  },
];

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100
      )
    : 0;

  return (
    <div
      onClick={() => {
        window.location.href = `/products/${product.id}`;
      }}
      className="cursor-pointer"
    >
      {" "}
      <Card className="group h-full w-full cursor-pointer border border-gray-200 shadow hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="relative">
          <Badge className="absolute bg-red-400 text-white text-xs text-red-700 text-center w-12 px-2 py-1 top-0 right-0 rounded-bl-lg rounded-r-none border-l-red-200 shadow-sm hover:bg-orange-300">
            -10%
          </Badge>
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-t-lg">
              <span className="text-white font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}{" "}
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-t-lg"
          />{" "}
          {/* Find Similar Button Overlay */}
          <div className="absolute h-full w-full  inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/products/similar/${product.id}`;
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 text-sm transition-colors duration-200"
            >
              Find Similar
            </button>
          </div>
        </div>
        <div className="p-3 flex flex-col space-y-2">
          {/* Title and Price on same line */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm text-gray-900 font-medium line-clamp-1 flex-1">
              {product.name}
            </p>
          </div>

          {/* Discount + Rating */}
          <div className="flex flex-wrap gap-1">
            <Badge className="bg-blue-100 text-blue-600 rounded-none border border-blue-600 text-xs">
              ₱{discountPercent} OFF
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-600 rounded-none border border-blue-500 text-xs">
              ★ {product.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Sold Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-blue-600">₽{product.price}</p>
            <p className="text-xs text-gray-500">
              {" "}
              {product.sold >= 1000
                ? `${Math.floor(product.sold / 1000)}k`
                : product.sold}{" "}
              Sold
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
