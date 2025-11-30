import { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  categories: string[];
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    categories: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    stock: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newPriceRange: [number, number] = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    const newFilters = { ...filters, priceRange: newPriceRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStockChange = (inStock: boolean) => {
    const newFilters = { ...filters, inStock };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const newFilters: FilterState = {
      priceRange: [0, 10000],
      rating: 0,
      inStock: false,
      categories: [],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
        </div>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium text-gray-900">Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Under ₽1,000', range: [0, 1000] },
                { label: '₽1,000 - ₽3,000', range: [1000, 3000] },
                { label: '₽3,000 - ₽5,000', range: [3000, 5000] },
                { label: 'Over ₽5,000', range: [5000, 10000] },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const newFilters = { ...filters, priceRange: preset.range as [number, number] };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                  className="text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left px-2 py-1 rounded transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium text-gray-900">Rating</span>
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(rating)}
                    {'☆'.repeat(5 - rating)}
                  </div>
                  <span className="text-sm text-gray-700">& up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Stock Availability */}
      <div>
        <button
          onClick={() => toggleSection('stock')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <span className="font-medium text-gray-900">Availability</span>
          {expandedSections.stock ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.stock && (
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleStockChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        )}
      </div>
    </div>
  );
}

