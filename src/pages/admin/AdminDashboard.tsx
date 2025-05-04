import React, { useEffect, useState } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../services/api";
import { Product } from "../../types";
import AdminNavbar from "../../components/AdminNavbar";
import { PlusCircle, Edit2, Trash2, Upload, AlertCircle } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    category: "",
    price: 0,
    size: [],
    color: "",
    description: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Vp-Garments");

    try {
      setUploading(true);
      const response = await fetch("https://api.cloudinary.com/v1_1/dsfgzwnvq/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }));
      
      const notification = document.createElement("div");
      notification.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
      notification.textContent = "Image uploaded successfully!";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (err) {
      console.error("Error uploading image:", err);
      const notification = document.createElement("div");
      notification.className = "fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg";
      notification.textContent = "Failed to upload image. Please try again.";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(formData._id, formData);
        const notification = document.createElement("div");
        notification.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
        notification.textContent = "Product updated successfully!";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        await createProduct(formData);
        const notification = document.createElement("div");
        notification.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
        notification.textContent = "Product created successfully!";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
      
      setFormData({
        _id: "",
        name: "",
        category: "",
        price: 0,
        size: [],
        description: "",
        imageUrl: "",
      });
      setIsEditing(false);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      const notification = document.createElement("div");
      notification.className = "fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg";
      notification.textContent = "Operation failed. Please try again.";
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        const notification = document.createElement("div");
        notification.className = "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg";
        notification.textContent = "Product deleted successfully!";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        const notification = document.createElement("div");
        notification.className = "fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg";
        notification.textContent = "Failed to delete product. Please try again.";
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="mt-1 text-neutral-600">Manage your product inventory</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">
              Total Products: {products.length}
            </span>
          </div>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">₹</span>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Available Sizes
              </label>
              <input
                type="text"
                name="size"
                placeholder="S, M, L, XL"
                value={formData.size.join(",")}
                onChange={(e) => setFormData({ ...formData, size: e.target.value.split(",") })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                required
              />
            </div>
          </div>
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Color
            </label>
            <input
              type="text"
              name="color"
              placeholder="Enter product color (e.g., red, blue)"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
              required
            />
          </div>
  
            {/* Color */}
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg hover:border-brand-500 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                <div className="flex text-sm text-neutral-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {uploading && (
              <div className="mt-2 flex items-center text-sm text-brand-600">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading image...
              </div>
            )}
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  _id: "",
                  name: "",
                  category: "",
                  price: 0,
                  size: [],
                  description: "",
                  imageUrl: "",
                });
                setIsEditing(false);
              }}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                {isEditing ? (
                    <>
                    <Edit2 size={16} className="mr-2" />
                    Update Product
                    </>
                ) : (
                    <>
                    <PlusCircle size={16} className="mr-2" />
                    Add Product
                    </>
                )}
            </button>

          </div>
        </form>

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="text-lg font-medium text-neutral-900">Product List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-neutral-200 flex items-center justify-center">
                            <AlertCircle size={20} className="text-neutral-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                          <div className="text-sm text-neutral-500">{product.size.join(", ")}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {product.color || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-amber-600 hover:text-amber-700 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;