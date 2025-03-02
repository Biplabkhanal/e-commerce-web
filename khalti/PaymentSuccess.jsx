import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("verifying");
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({});

  useEffect(() => {
    const verifyPayment = () => {
      try {
        const params = new URLSearchParams(location.search);

        // Get details from URL
        const pidx = params.get("pidx");
        const txnId = params.get("txnId");
        const amount = params.get("amount");
        const mobile = params.get("mobile");
        const purchaseOrderId = params.get("purchase_order_id");
        const purchaseOrderName = params.get("purchase_order_name");
        const statusParam = params.get("status");

        // Get stored data
        const storedOrderId = localStorage.getItem("khaltiOrderId");
        const storedCartTotal = parseFloat(
          localStorage.getItem("cartTotal") || "0"
        );

        setPaymentDetails({
          pidx,
          txnId,
          amount: amount ? parseInt(amount) / 100 : 0, // Convert from paisa to rupees
          mobile,
          purchaseOrderId,
          purchaseOrderName,
        });

        // Simple verification based on local data
        if (
          statusParam === "Completed" &&
          purchaseOrderId === storedOrderId &&
          parseInt(amount) === Math.round(storedCartTotal * 100)
        ) {
          setStatus("success");
          // Clear cart in your app state
          // This is where you'd dispatch an action if using Redux
          // Example: dispatch(clearCart());

          // Clear localStorage data related to this order
          localStorage.removeItem("khaltiOrderId");
          localStorage.removeItem("cartItems");
          localStorage.removeItem("cartTotal");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failed");
      }
    };

    // Give a short delay to simulate verification process
    const timer = setTimeout(verifyPayment, 1500);
    return () => clearTimeout(timer);
  }, [location]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {status === "verifying" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <CircularProgress size={60} />
            <Typography variant="h5" sx={{ mt: 3 }}>
              Verifying your payment...
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              Please wait while we confirm your transaction.
            </Typography>
          </Box>
        )}

        {status === "success" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
            <Typography variant="h4" sx={{ mt: 3 }}>
              Payment Successful!
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 2, mb: 3, textAlign: "center" }}
            >
              Thank you for your purchase. Your transaction was completed
              successfully.
            </Typography>

            <Alert severity="success" sx={{ width: "100%", mb: 3 }}>
              <Typography variant="body1">
                Transaction ID: {paymentDetails.txnId}
                <br />
                Amount: NPR {paymentDetails.amount?.toFixed(2)}
                <br />
                Order ID: {paymentDetails.purchaseOrderId}
              </Typography>
            </Alert>

            <Button
              variant="contained"
              color="primary"
              onClick={handleContinueShopping}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        )}

        {status === "failed" && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <ErrorIcon color="error" sx={{ fontSize: 80 }} />
            <Typography variant="h4" sx={{ mt: 3 }}>
              Payment Failed
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 2, mb: 3, textAlign: "center" }}
            >
              We couldn't verify your payment. Please try again or contact
              support.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleContinueShopping}
              sx={{ mt: 2 }}
            >
              Return to Shop
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
