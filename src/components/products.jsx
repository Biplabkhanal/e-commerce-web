import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Container,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import {
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
} from "../redux/actions/productActions";
import { addToCart, removeFromCart } from "../redux/actions/cartAction";
import {
  Add,
  AddShoppingCart,
  Remove,
  RemoveShoppingCart,
} from "@mui/icons-material";

const Products = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [category, setCategory] = useState("all");
  const { categories } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    dispatch(fetchProductsByCategory(e.target.value));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const handleIncrement = (e, product) => {
    e.stopPropagation();
    const currentQuantity =
      cartItems.find((item) => item.id === product.id)?.quantity || 0;
    const updatedProduct = { ...product, quantity: currentQuantity + 1 };
    dispatch(addToCart(updatedProduct));
  };

  const handleDecrement = (e, product) => {
    e.stopPropagation();
    const currentQuantity =
      cartItems.find((item) => item.id === product.id)?.quantity || 0;

    if (currentQuantity > 1) {
      dispatch({
        type: "DECREMENT_QUANTITY",
        payload: {
          id: product.id,
        },
      });
    } else {
      handleRemoveFromCart(product.id);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" width="100%">
        <CircularProgress sx={{ m: 2 }} />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" width="100%">
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4 }} textAlign="center">
        Our Products
      </Typography>

      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card
                sx={{
                  height: "500px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.title}
                  sx={{
                    objectFit: "contain",
                    maxHeight: "200px",
                  }}
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: 2,
                    height: "calc(100% - 200px)",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    gutterBottom
                    sx={{ mb: 1, lineHeight: 1.1, fontSize: 20 }}
                  >
                    {product.title}
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: "auto",
                      maxHeight: "80px",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>

                    {isProductInCart(product.id) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #ddd",
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleDecrement(e, product)}
                        >
                          <Remove fontSize="small" />
                        </IconButton>

                        <Typography sx={{ px: 2 }}>
                          {cartItems.find((item) => item.id === product.id)
                            ?.quantity || 0}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={(e) => handleIncrement(e, product)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ width: "50%", mx: "auto" }}
                    onClick={() =>
                      isProductInCart(product.id)
                        ? handleRemoveFromCart(product.id)
                        : handleAddToCart({ ...product, quantity: 1 })
                    }
                    color={isProductInCart(product.id) ? "error" : "primary"}
                    startIcon={
                      isProductInCart(product.id) ? (
                        <RemoveShoppingCart />
                      ) : (
                        <AddShoppingCart />
                      )
                    }
                  >
                    {isProductInCart(product.id) ? "Remove" : "Add"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
