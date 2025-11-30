import Badge from "./Badge";

export interface TopProduct {
  id: number;
  name: string;
  price: number;
  monthly_sales: string;
  image: string;
}

// Top Products data by category
export const topProductsByCategory = {
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
    }, {
      id: 107,
      name: "Wireless Smart CCTV Camera with Motion Detection",
      price: 420,
      monthly_sales: "Sold 3780",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 108,
      name: "Outdoor Waterproof CCTV Camera 1080P Night Vision",
      price: 560,
      monthly_sales: "Sold 4890",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 109,
      name: "Mini Spy Camera with Audio Recording",
      price: 310,
      monthly_sales: "Sold 6120",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 110,
      name: "360° Panoramic CCTV Bulb Camera",
      price: 450,
      monthly_sales: "Sold 7320",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 111,
      name: "Dual Antenna Wi-Fi CCTV Camera HD",
      price: 395,
      monthly_sales: "Sold 4980",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 112,
      name: "TP-Link Tapo C310 Outdoor Security Camera",
      price: 899,
      monthly_sales: "Sold 3420",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 113,
      name: "V380 Pro Dome Camera 5MP",
      price: 470,
      monthly_sales: "Sold 2890",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 114,
      name: "Solar Powered Wireless CCTV Camera",
      price: 990,
      monthly_sales: "Sold 2150",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 115,
      name: "Indoor Smart CCTV Camera with App Control",
      price: 360,
      monthly_sales: "Sold 6720",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 116,
      name: "Night Vision CCTV Camera with Infrared Sensor",
      price: 520,
      monthly_sales: "Sold 4380",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 117,
      name: "Compact Wireless CCTV for Home Use",
      price: 285,
      monthly_sales: "Sold 5890",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 118,
      name: "HD CCTV Camera with Cloud Storage",
      price: 610,
      monthly_sales: "Sold 3210",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 119,
      name: "V380 Pro Bullet Camera 2K Resolution",
      price: 730,
      monthly_sales: "Sold 2780",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
    },
    {
      id: 120,
      name: "Smart CCTV Camera with Facial Recognition",
      price: 1050,
      monthly_sales: "Sold 1980",
      image: "https://i.pinimg.com/736x/3d/f5/d8/3df5d840b4106aea13c62471a11e15f7.jpg",
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

interface TopProductCardProps {
  product: TopProduct;
  onClick?: () => void;
}

export default function TopProductCard({
  product,
  onClick,
}: TopProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group w-full max-w-xs"
    >
      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md transition-all hover:-translate-y-1">
        <Badge className="absolute top-3 left-3 bg-blue-300 text-white text-xs font-semibold px-2 py-1 rounded">
          TOP
        </Badge>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 space-y-3">
          <div className="bg-gray-50 text-blue-500 text-center text-sm font-medium py-2 rounded">
            {product.monthly_sales}
          </div>
          <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed">
            {product.name}
          </p>
        </div>
      </div>
    </div>
  );
}

