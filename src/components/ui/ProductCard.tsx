import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import Button from './Button';
import { cn } from '../../utils/cn';
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => Promise<void>;
  className?: string;
}

const placeholderImages = [
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3389419/pexels-photo-3389419.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/9558577/pexels-photo-9558577.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/11731428/pexels-photo-11731428.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, className }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`); // Navigate to the product details page
  };

  return (
    <div
      onClick={handleCardClick} // Make the card clickable
      className={cn(
        "group relative overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
        className
      )}
    >
      <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden bg-neutral-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-[300px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-neutral-900 mb-1">{product.name}</h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-brand-600 font-semibold">₹{product.price || "89.99"}</span>
          <Button
            variant="primary"
            size="sm"
            icon={<ShoppingBag size={16} />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              onAddToCart(product._id);
            }}
            className="opacity-90 hover:opacity-100"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;