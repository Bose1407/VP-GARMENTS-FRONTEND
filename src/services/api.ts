import axios from "axios";
import { Product, CartItem } from "../types";

const API = axios.create({ baseURL: "https://vp-garments-production.up.railway.app/api/v2" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchProducts = async (queryParams: string = ""): Promise<Product[]> => {
  try {
    const response = await API.get(`/products${queryParams}`);
    
    // Check if the response status is in the range of 200-299
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error fetching products: ${response.status} ${response.statusText}`);
    }

    // Return the data directly from the Axios response
    const data = response.data;
    console.log("Fetched Products:", data); // Debugging response
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem[]> => {
  const { data } = await API.post("/cart", { productId, quantity });
  return data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const { data } = await API.get("/cart");
  console.log("API Response:", data.data.products); // Log the full API response
  return data.data.products; // Extract the products array
};

export const deleteCartItem = async (productId: string): Promise<CartItem[]> => {
  const { data } = await API.delete("/cart/item", { data: { productId } });
  return data;
};



// Create a new product (admin only)
export const createProduct = async (product: Product): Promise<Product> => {
  const { data } = await API.post("/products", product);
  return data;
};

// Update an existing product by ID (admin only)
export const updateProduct = async (id: string, product: Product): Promise<Product> => {
  const { data } = await API.put(`/products/${id}`, product);
  return data;
};

// Delete a product by ID (admin only)
export const deleteProduct = async (id: string): Promise<void> => {
  await API.delete(`/products/${id}`);
};
