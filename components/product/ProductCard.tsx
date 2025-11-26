import Badge from "./Badge";
import { Card } from "./Card";

export interface Product {
  id: number;
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
      <Card className="group border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-t-lg">
          {discountPercent > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white z-10">
              -{discountPercent}%
            </Badge>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-t-lg">
              <span className="text-white font-semibold text-sm">
                Out of Stock
              </span>
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-t-lg"
          />
          {/* Find Similar Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end justify-center opacity-0 group-hover:opacity-100 z-20">
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
        <div className="p-3">
          <p className="text-sm text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </p>
          <div className="flex flex-wrap gap-1 mb-2">
            {discountPercent > 0 && (
              <Badge className="bg-blue-100 text-blue-600 border border-blue-600 text-xs">
                ₽{discountPercent} OFF
              </Badge>
            )}
            <Badge className="bg-yellow-100 text-yellow-600 border border-yellow-600 text-xs">
              ★ {product.rating.toFixed(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-blue-600">
                ₽{product.price}
              </p>
              {product.original_price &&
                product.original_price > product.price && (
                  <p className="text-xs text-gray-400 line-through">
                    ₽{product.original_price}
                  </p>
                )}
            </div>
            <p className="text-xs text-gray-500">
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
