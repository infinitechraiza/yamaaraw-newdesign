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

export interface AutoScrollProduct {
    id: number;
    name: string;
    image: string;
}

export const row1Products: AutoScrollProduct[] = [
    { id: 1, name: "Product 1", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
    { id: 2, name: "Product 2", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop" },
    { id: 3, name: "Product 3", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop" },
    { id: 4, name: "Product 4", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop" },
    { id: 5, name: "Product 5", image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&h=400&fit=crop" },
    { id: 6, name: "Product 6", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop" },
    { id: 7, name: "Product 7", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
];

export const row2Products: AutoScrollProduct[] = [
    { id: 8, name: "Product 8", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop" },
    { id: 9, name: "Product 9", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop" },
    { id: 10, name: "Product 10", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop" },
    { id: 11, name: "Product 11", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop" },
    { id: 12, name: "Product 12", image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=400&fit=crop" },
    { id: 13, name: "Product 13", image: "https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=400&h=400&fit=crop" },
    { id: 14, name: "Product 14", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop" },
];

export const row3Products: Product[] = [
    { id: 15, name: "Product 15", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop" },
    { id: 16, name: "Product 16", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop" },
    { id: 17, name: "Product 17", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop" },
    { id: 18, name: "Product 18", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop" },
    { id: 19, name: "Product 19", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop" },
    { id: 20, name: "Product 20", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop" },
    { id: 21, name: "Product 21", image: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&h=400&fit=crop" },
];

const AutoScrollCard: React.FC<AutoScrollCardProps> = ({ products, direction = 'right' }) => {
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
            className="flex gap-4 overflow-x-hidden py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {duplicatedProducts.map((product, index) => (
                <div
                    key={`${product.id}-${index}`}
                    className="flex-shrink-0 w-44 h-44 bg-gray-100 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
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

export default AutoScrollCard;
