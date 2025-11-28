import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SortBarProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // New filter props
  minPrice?: number | null;
  maxPrice?: number | null;
  onPriceChange?: (min: number | null, max: number | null) => void;
  minRating?: number | null;
  onRatingChange?: (minRating: number | null) => void;
  inStockOnly?: boolean;
  onInStockChange?: (val: boolean) => void;
}

export default function SortBar({
  currentSort,
  onSortChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onInStockChange,
}: SortBarProps) {
  const [minPriceInput, setMinPriceInput] = useState<string>(minPrice != null ? String(minPrice) : '');
  const [maxPriceInput, setMaxPriceInput] = useState<string>(maxPrice != null ? String(maxPrice) : '');
  const [minRatingInput, setMinRatingInput] = useState<string>(minRating != null ? String(minRating) : '');
  const [inStockOnlyLocal, setInStockOnlyLocal] = useState<boolean>(!!inStockOnly);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPriceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync local inputs when parent props change
  useEffect(() => {
    setMinPriceInput(minPrice != null ? String(minPrice) : '');
  }, [minPrice]);
  useEffect(() => {
    setMaxPriceInput(maxPrice != null ? String(maxPrice) : '');
  }, [maxPrice]);
  useEffect(() => {
    setMinRatingInput(minRating != null ? String(minRating) : '');
  }, [minRating]);
  useEffect(() => {
    setInStockOnlyLocal(!!inStockOnly);
  }, [inStockOnly]);

  const isPriceSort = (value: string) => {
    return ['price_asc', 'price_desc'].includes(value);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Sort by</span>
        
        <div className="flex items-center gap-2">
        {/* Popular */}
        <button
          onClick={() => onSortChange('popular')}
          className={`px-4 py-2 text-sm font-medium rounded transition ${
            currentSort === 'popular'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Popular
        </button>

        {/* Latest */}
        <button
          onClick={() => onSortChange('latest')}
          className={`px-4 py-2 text-sm font-medium rounded transition ${
            currentSort === 'latest'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Latest
        </button>

        {/* Top Sales */}
        <button
          onClick={() => onSortChange('rating')}
          className={`px-4 py-2 text-sm font-medium rounded transition ${
            currentSort === 'rating'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Top Sales
        </button>

        {/* Price Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
            className={`px-4 py-2 text-sm font-medium rounded transition flex items-center gap-2 ${
              isPriceSort(currentSort)
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Price
            <ChevronDown className="w-4 h-4" />
          </button>

          {isPriceDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-[180px]">
              <button
                onClick={() => {
                  onSortChange('price_asc');
                  setIsPriceDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                  currentSort === 'price_asc' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => {
                  onSortChange('price_desc');
                  setIsPriceDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                  currentSort === 'price_desc' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                Price: High to Low
              </button>
            </div>
            
          )}
        </div>
      </div>
      </div>

      {/* Filters: Price range, Rating, In-stock */}
      <div className="flex items-center gap-3">
      
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-500 font-medium mr-2">
            {currentPage}/{totalPages}
          </span>
          
          {/* Previous Button */}
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage = 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1);
              
              // Show ellipsis
              const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

              if (showEllipsisBefore || showEllipsisAfter) {
                return (
                  <span key={page} className="flex items-center justify-center w-8 h-8 text-gray-500">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`flex items-center justify-center w-8 h-8 rounded text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

