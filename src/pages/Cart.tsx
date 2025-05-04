import React, { useEffect, useState } from "react";
import { fetchCart, deleteCartItem, addToCart } from "../services/api";
import { CartItem } from "../types";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number | string }>({}); // Track quantities for each product

  useEffect(() => {
    const getCart = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCart();
        if (!data) {
          console.error("No data received from API");
          return;
        }
        setCart(data);

        // Initialize quantities state
        const initialQuantities: { [key: string]: number | string } = {};
        data.forEach((item) => {
          initialQuantities[item.productId._id] = item.quantity;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setIsLoading(false);
      }
    };
    getCart();
  }, []);

  const handleDelete = async (productId: string) => {
    try {
      await deleteCartItem(productId);
      setCart(cart.filter((item) => item.productId._id !== productId));
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };

  const handleUpdate = async (productId: string) => {
    try {
      const quantity = quantities[productId];
      if (quantity === "" || quantity <= 0) {
        alert("Quantity must be greater than 0.");
        return;
      }

      // Update the quantity in the backend
      await addToCart(productId, quantity as number);

      // Update the cart state to reflect the new quantity
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: quantity as number } // Update the quantity for the matching product
            : item
        )
      );

      alert("Cart updated successfully!");
    } catch (err) {
      console.error("Error updating cart item:", err);
      alert("Failed to update cart. Please try again.");
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.productId.price || 89.99) * item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-off-white py-16">
        <Container>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-off-white py-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-2">Your Shopping Cart</h1>
          <p className="text-neutral-600">
            {cart.length === 0
              ? "Your cart is currently empty."
              : `You have ${cart.length} item${cart.length !== 1 ? "s" : ""} in your cart.`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-neutral-100 p-4 rounded-full mb-4">
              <ShoppingBag size={40} className="text-neutral-500" />
            </div>
            <h2 className="text-xl font-medium text-neutral-800 mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products">
              <Button variant="primary" icon={<ArrowLeft size={16} />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-200">
                  {cart.map((item) => (
                    <div key={item.productId._id} className="p-6 flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-24 bg-neutral-100 rounded-md overflow-hidden">
                        <img
                          src={item.productId.imageUrl}
                          alt={item.productId.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <h3 className="text-lg font-medium text-neutral-900">{item.productId.name}</h3>
                          <p className="font-medium text-brand-600">
                            {formatCurrency(item.productId.price || 89.99)}
                          </p>
                        </div>

                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{item.productId.description}</p>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="1"
                              value={quantities[item.productId._id] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setQuantities({
                                  ...quantities,
                                  [item.productId._id]: value === "" ? "" : parseInt(value, 10), // Allow empty value
                                });
                              }}
                              className="w-16 px-3 py-1 border border-neutral-300 rounded-md text-center"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdate(item.productId._id)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-neutral-500 hover:text-error-600"
                              icon={<Trash2 size={16} />}
                              onClick={() => handleDelete(item.productId._id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="text-neutral-900 font-medium">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-neutral-900 font-medium">{formatCurrency(10)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tax</span>
                    <span className="text-neutral-900 font-medium">{formatCurrency(calculateSubtotal() * 0.1)}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between">
                    <span className="font-medium text-neutral-900">Total</span>
                    <span className="font-bold text-neutral-900">
                      {formatCurrency(calculateSubtotal() + 10 + calculateSubtotal() * 0.1)}
                    </span>
                  </div>
                </div>

                <Button variant="primary" className="w-full">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default Cart;