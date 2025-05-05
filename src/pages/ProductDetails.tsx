import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, addToCart } from "../services/api";
import { Product } from "../types";
import { StarIcon, HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProductById(id!);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product._id, quantity);
      alert(`${product.name} has been added to your cart!`);
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert("Failed to add product to cart. Please try again after Login.");
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically call an API to update wishlist status
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
          <p className="text-gray-600 mt-2">The requested product does not exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Product Image Gallery */}
            <div className="md:w-1/2 p-6">
              <div className="relative group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-lg transition duration-300 group-hover:scale-105"
                />
                <button
                  onClick={toggleWishlist}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                  )}
                </button>
              </div>
              {/* Thumbnail gallery would go here */}
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill={i < 4 ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500 ml-2">(24 reviews)</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-brand-600">₹{product.price}</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Product Variants would go here */}

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center px-3 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 border border-brand-600 text-brand-600 px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Product Details */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-900">{product.category || 'Clothing'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="text-sm font-medium text-gray-900">Cotton</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Care Instructions</p>
                    <p className="text-sm font-medium text-gray-900">Machine wash cold</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="text-sm font-medium text-gray-900">{product._id.substring(0, 8)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          {/* Reviews would be mapped here */}
          <div className="border-t border-gray-200 pt-6">
            <button className="text-brand-600 hover:text-brand-700 font-medium">
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
