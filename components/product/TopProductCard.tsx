import Badge from './Badge';

export interface TopProduct {
  id: number;
  name: string;
  price: number;
  monthly_sales: string;
  image: string;
}

interface TopProductCardProps {
  product: TopProduct;
  onClick?: () => void;
}

export default function TopProductCard({ product, onClick }: TopProductCardProps) {
  return (
    <div onClick={onClick} className="cursor-pointer group">
      <div className="group relative bg-white border border-gray-200 overflow-hidden shadow shadow hover:shadow-lg transition-all hover:-translate-y-1">
        <Badge className="absolute top-2 left-2 bg-blue-300 text-white font-bold text-xs z-10">
          TOP
        </Badge>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 aspect-square object-cover"
        />
        <div className="p-1">
          <div className="bg-blue-300 text-white text-center text-xs font-medium py-1.5 rounded-none mb-2">
            {product.monthly_sales}
          </div>
          <p className="text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">{product.name}</p>
        </div>
      </div>
    </div>
  );
}

2