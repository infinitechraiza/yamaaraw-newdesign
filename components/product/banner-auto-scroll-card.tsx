import React, { useEffect, useRef } from 'react';

interface Product {
    id: number;
    name: string;
    image: string;
}

interface AutoScrollCardProps {
    products: Product[];
    direction?: 'left' | 'right';
}

export interface AutoScrollBanner {
    id: number;
    name: string;
    image: string;
}

export const bannerCard: AutoScrollBanner[] = [
   { id: 1, name: "Product 1", image: "https://img.freepik.com/premium-vector/modern-red-white-abstract-banner-background-template-corporate-banner-concept-red-black-grey-white-contrast-background_249611-17548.jpg?w=996" },
    { id: 2, name: "Product 2", image: "https://img.freepik.com/premium-vector/modern-red-white-abstract-banner-background-template-corporate-banner-concept-red-black-grey-white-contrast-background_249611-17494.jpg?w=2000" },
    { id: 3, name: "Product 3", image: "https://static.vecteezy.com/system/resources/previews/000/178/023/original/vector-modern-sale-and-promotion-banner-design-template.jpg" },
    { id: 4, name: "Product 4", image: "https://static.vecteezy.com/system/resources/previews/005/007/315/original/illustration-background-wallpaper-banner-template-flyer-poster-event-label-backdrop-modern-free-vector.jpg" },
    { id: 5, name: "Product 5", image: "https://img.freepik.com/premium-vector/blue-shapes-simple-wallpaper-background-free-vector_561408-737.jpg?w=740" },
    { id: 6, name: "Product 6", image: "https://img.freepik.com/free-vector/abstract-gradient-geometric-wallpaper-with-different-shapes_23-2148815956.jpg?w=740&t=st=1708753969~exp=1708754569~hmac=cd9dfb79881a977080c50a0efad0ea028037c250ffc29e03a5821a075e24826c" },
    { id: 7, name: "Product 7", image: "https://i.pinimg.com/736x/59/f1/e8/59f1e8c2a78c96bbd823bc99d04e1813.jpg" },
    { id: 8, name: "Product 8", image: "https://tse1.mm.bing.net/th/id/OIP.IflemaLJbSK21TTpkziQZgHaDt?w=626&h=313&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 9, name: "Product 9", image: "https://img.freepik.com/premium-vector/geometric-blue-dark-blue-gradient-background-vector-file_783553-294.jpg?w=740" },
    { id: 10, name: "Product 10", image: "https://tse1.mm.bing.net/th/id/OIP.bXLMv3hiA74qCJ1dAS_RUwHaEK?w=626&h=352&rs=1&pid=ImgDetMain&o=7&rm=3" },
];

const AutoScrollBannerCard: React.FC<AutoScrollCardProps> = ({ products, direction = 'right' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollPosition = direction === 'right' ? 0 : scrollContainer.scrollWidth / 2;
        scrollContainer.scrollLeft = scrollPosition;

        let animationFrameId: number;

        const scroll = () => {
            if (!scrollContainer) return;

            if (direction === 'right') {
                scrollPosition += 0.5;
                if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                    scrollPosition = 0;
                }
            } else {
                scrollPosition -= 0.5;
                if (scrollPosition <= 0) {
                    scrollPosition = scrollContainer.scrollWidth / 2;
                }
            }

            scrollContainer.scrollLeft = scrollPosition;
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [direction]);


    const duplicatedProducts = [...products, ...products];

    return (
        <div
            ref={scrollRef}
            className="flex overflow-x-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {duplicatedProducts.map((product, index) => (
                <div
                    key={`${product.id}-${index}`}
                    className="flex-shrink-0 w-[500px] h-32 bg-gray-100 rounded-none"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default AutoScrollBannerCard;
