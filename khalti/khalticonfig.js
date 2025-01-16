const khaltiConfig = {
  publicKey: "t803a5e30c850480d9aa993dfb107e8f8",
  productName: "E-Commerce Purchase",
  productIdentity: "1234567890",
  productUrl: "http://localhost:3000/products",
  amount: 1000, // amount in paisa
  website: "http://localhost:3000",
  successUrl: "http://localhost:3000/success",
  failureUrl: "http://localhost:3000/failure",
  checkout: {
    method: "POST",
    params: {
      return_url: "http://localhost:3000/return",
      website_url: "http://localhost:3000",
      amount: 1000,
      purchase_order_id: "test123",
      purchase_order_name: "Test Purchase",
    },
  },
  eventHandler: {
    onSuccess: async (payload) => {
      console.log("Payment Successful! Verifying...", payload);
      try {
        const response = await axios.post(
          "https://a.khalti.com/api/v2/epayment/lookup/",
          {
            pidx: payload.pidx,
          },
          {
            headers: {
              Authorization: `key 1392d5e8156541638030d38edcfa8e17`,
            },
          }
        );
        console.log("Verification Successful!", response.data);
        alert("Payment Successful!");
      } catch (error) {
        console.error("Verification Failed:", error.response?.data);
        alert("Payment Verification Failed!");
      }
    },
    onError(error) {
      console.error("Payment Error!", error);
      alert("Payment Failed! Please try again.");
    },
  },
  paymentPreference: [
    "KHALTI",
    "EBANKING",
    "MOBILE_BANKING",
    "CONNECT_IPS",
    "SCT",
  ],
};

export default khaltiConfig;
