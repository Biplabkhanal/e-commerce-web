import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  TextField,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchProducts } from "../redux/actions/productActions";

const LoadingSkeleton = () => (
  <Grid container spacing={4}>
    {[1, 2, 3].map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item}>
        <Card sx={{ height: 300 }}>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ p: 2 }}>
            <Skeleton width="60%" height={30} />
            <Skeleton width="40%" />
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map((product) => ({
        id: product.id,
        name: product.title,
        image: product.image,
        itemCount: Math.floor(Math.random() * 100) + 50,
        category: product.category,
      }));
      setRandomProducts(selected);
    }
  }, [products]);
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "300px",
            height: "300px",
            right: "-50px",
            top: "-50px",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
        />
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  color="white"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Elegant Style Hub
                </Typography>
                <Typography variant="h5" color="white" paragraph>
                  Your destination for premium fashion and accessories
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      bgcolor: "white",
                      color: "#2196F3",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                      },
                    }}
                  >
                    Shop Now
                  </Button>
                </motion.div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3"
                alt="Fashion"
                style={{
                  width: "100%",
                  maxWidth: 600,
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Box sx={{ py: 12 }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              textAlign="center"
              gutterBottom
              sx={{ mb: 6 }}
            >
              Trending Categories
            </Typography>
            <Grid container spacing={4}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    p: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error" textAlign="center" width="100%">
                  {error}
                </Typography>
              ) : (
                randomProducts.map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={category.id}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        sx={{
                          height: 300,
                          position: "relative",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}
                      >
                        <Box
                          component="img"
                          src={category.image}
                          alt={category.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 3,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                          }}
                        >
                          <Typography variant="h5" color="white">
                            {category.name}
                          </Typography>
                          <Typography variant="body2" color="white">
                            {category.itemCount} Items
                          </Typography>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Newsletter */}
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" textAlign="center" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="body1" textAlign="center" paragraph>
              Subscribe to our newsletter for exclusive offers and updates
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter your email"
                sx={{ bgcolor: "white" }}
              />
              <Button variant="contained" size="large">
                Subscribe
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default Home;
