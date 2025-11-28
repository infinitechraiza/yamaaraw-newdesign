import { ReactNode, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: ReactNode[];
  itemsPerPage?: number;
  rows?: number;
  className?: string;
}

export default function Carousel({ children, itemsPerPage = 5, rows = 1, className = '' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = children.length;
  const itemsPerSlide = itemsPerPage * rows;
  const maxIndex = Math.max(0, Math.ceil(totalItems / itemsPerSlide) - 1);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const translateX = -(currentIndex * 100);

  return (
    <div className={`relative ${className}`}>
      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        disabled={currentIndex === 0}
        className="group absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg group-hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous"
      >
        <ChevronLeft className="w-3 h-3 group-hover:w-6 group-hover:h-6 text-gray-700" />
      </button>

      {/* Carousel Container */}
      <div className="overflow-hidden mx-12">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {Array.from({ length: Math.ceil(totalItems / itemsPerSlide) }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full"
            >
              <div 
                className="grid gap-1"
                style={{ 
                  gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
                }}
              >
                {children.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((child, index) => (
                  <div key={slideIndex * itemsPerSlide + index}>
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={goToNext}
        disabled={currentIndex === maxIndex}
        className="group absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg group-hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next"
      >
        <ChevronRight className="w-3 h-3 group-hover:w-6 group-hover:h-6 text-gray-700" />
      </button>
    </div>
  );
}

