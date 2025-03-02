import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Divider, List, ListItem, ListItemText, Popover } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  createKhaltiPaymentUrl,
  generateOrderId,
} from "../../khalti/khalticonfig";

const Navbar = () => {
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Orders", path: "/orders" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleMenuClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleKhaltiCheckout = () => {
    setIsProcessing(true);

    try {
      // Generate a unique purchase order ID
      const purchaseOrderId = generateOrderId();

      // Prepare data for Khalti payment URL
      const paymentData = {
        return_url: `${window.location.origin}/payment-success`,
        website_url: window.location.origin,
        amount: Math.round(cartTotal * 100), // Convert to paisa and ensure it's an integer
        purchase_order_id: purchaseOrderId,
        purchase_order_name: "Ecommerce Purchase",
        customer_info: {
          name: user?.name || "Guest Customer",
          email: user?.email || "",
          phone: user?.phone || "",
        },
        product_details: cartItems.map((item) => ({
          identity: item.id,
          name: item.title,
          total_price: Math.round(item.price * item.quantity * 100), // in paisa
          quantity: item.quantity,
          unit_price: Math.round(item.price * 100), // in paisa
        })),
      };

      // Create the payment URL
      const paymentUrl = createKhaltiPaymentUrl(paymentData);

      // Save cart info to localStorage for verification later
      localStorage.setItem("khaltiOrderId", purchaseOrderId);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("cartTotal", cartTotal);

      // Redirect to Khalti payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      alert("Payment initiation failed. Please try again.");
      setIsProcessing(false);
    }
  };
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          E-Commerce
        </Typography>

        {/* Links for larger screens */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {menuItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.path}
              sx={{ color: "white", marginLeft: 2 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Shopping Cart Icon */}
        <IconButton color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={cartItemsCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        <Popover
          open={Boolean(cartAnchorEl)}
          anchorEl={cartAnchorEl}
          onClose={handleCartClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <List sx={{ width: 350, maxHeight: 450, overflow: "auto" }}>
            {cartItems.length === 0 ? (
              <ListItem>
                <ListItemText primary="Your cart is empty" />
              </ListItem>
            ) : (
              <>
                {cartItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.title}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography color="success.light">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
                <Divider />
                <ListItem>
                  <ListItemText primary="Total" />
                  <Typography variant="h6" color="primary">
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handleKhaltiCheckout}
                    disabled={isProcessing || cartItems.length === 0}
                  >
                    {isProcessing ? "Processing..." : "Checkout with Khalti"}
                  </Button>
                </ListItem>
              </>
            )}
          </List>
        </Popover>

        {/* User Profile Menu */}
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {user ? (
            <>
              <MenuItem
                onClick={handleMenuClose}
                component={Link}
                to="/profile"
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleMenuClose} component={Link} to="/login">
              Login
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
