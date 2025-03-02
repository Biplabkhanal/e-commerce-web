import axios from "axios";

// Generate a unique order ID
export const generateOrderId = () => {
  return `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Create the payment URL
export const createKhaltiPaymentUrl = (paymentData) => {
  // Base URL - use dev for testing, change to production URL later
  const baseUrl = "https://dev.khalti.com/payment/form/";

  // Required parameters
  const params = new URLSearchParams({
    public_key: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
    amount: paymentData.amount,
    purchase_order_id: paymentData.purchase_order_id,
    purchase_order_name: paymentData.purchase_order_name,
    return_url: paymentData.return_url,
    website_url: paymentData.website_url,
  });

  // Add customer info if available
  if (paymentData.customer_info) {
    params.append("customer_info", JSON.stringify(paymentData.customer_info));
  }

  // Add product details if available
  if (paymentData.product_details) {
    params.append(
      "product_details",
      JSON.stringify(paymentData.product_details)
    );
  }

  return `${baseUrl}?${params.toString()}`;
};
