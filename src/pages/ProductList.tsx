import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Product } from "../types";
import Container from "../components/layout/Container";
import ProductCard from "../components/ui/ProductCard";
import Button from "../components/ui/Button";
import { addToCart } from "../services/api";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedSizes, selectedColors, priceRange]);

  const fetchFilteredProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // Add category filter
      if (selectedCategory && selectedCategory !== "All") {
        queryParams.append("category", selectedCategory);
      }

      // Add size filter
      if (selectedSizes.length > 0) {
        queryParams.append("size", selectedSizes.join(",")); // Join sizes with commas
      }

      // Add color filter
      if (selectedColors.length > 0) {
        queryParams.append("color", selectedColors.join(",")); // Join colors with commas
      }

      // Add price range filter
      if (priceRange.min || priceRange.max) {
        queryParams.append("minPrice", priceRange.min.toString());
        queryParams.append("maxPrice", priceRange.max.toString());
      }

      // Fetch products from backend
      const data = await fetchProducts(`?${queryParams.toString()}`);
      setProducts(data);
      console.log("Filtered Products:", data); // Debugging response
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  // Demo categories, sizes, and colors
  const categories = [
    { id: 1, name: "All" },
    { id: 2, name: "Tops" },
    { id: 3, name: "Bottoms" },
    { id: 4, name: "Dresses" },
    { id: 5, name: "Accessories" },
  ];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["Black", "White", "Red", "Blue", "Green"];

  return (
    <main className="min-h-screen bg-off-white pb-16">
      <Container>
        {/* Welcome Message */}
        <div className="bg-brand-100 text-brand-800 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold">Welcome to Our Store!</h1>
          <p className="text-sm mt-2">
            Explore our wide range of products and find the perfect items for you. Use the filters to narrow down your search.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className={`lg:block ${showFilters ? "block" : "hidden"} lg:col-span-1`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-lg text-neutral-900">Filters</h2>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-neutral-500"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setPriceRange({ min: 0, max: 1000 });
                  }}
                >
                  Clear All
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={selectedCategory === category.name}
                        onChange={() => handleCategoryChange(category.name)}
                        className="h-4 w-4 rounded text-brand-500 border-neutral-300 focus:ring-brand-500"
                      />
                      <span className="ml-2 text-sm text-neutral-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-800 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <label
                      key={size}
                      className="inline-flex items-center justify-center w-10 h-10 border border-neutral-300 rounded-md hover:border-brand-500 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="sr-only"
                      />
                      <span className="text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="font-medium text-neutral-800 mb-2">Color</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleColorChange(color)}
                        className="h-4 w-4 rounded text-brand-500 border-neutral-300 focus:ring-brand-500"
                      />
                      <span className="ml-2 text-sm text-neutral-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <h2 className="text-xl font-medium text-neutral-800 mb-2">No products found</h2>
                <p className="text-neutral-600">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ProductList;