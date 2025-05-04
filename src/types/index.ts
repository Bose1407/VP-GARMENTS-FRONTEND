import axios from "axios";
import { Product, CartItem } from "../types";
import React from "react";
import { Link } from "react-router-dom";

const API = axios.create({ baseURL: "http://localhost:5000/api/v2" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await API.get("/products");
  return data;
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem[]> => {
  const { data } = await API.post("/cart", { productId, quantity });
  return data;
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const { data } = await API.get("/cart");
  return data;
};

export const deleteCartItem = async (productId: string): Promise<CartItem[]> => {
  const { data } = await API.delete("/cart/item", { data: { productId } });
  return data;
};

export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  size: string[];
  description: string;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product; // Populated product details
}