import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link,
  Paper,
  CircularProgress,
} from "@mui/material";
import { auth } from "../../firebase/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 400);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        if (password.length < 6) {
          setError("Password should be at least 6 characters");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage("Account created successfully! Please login.");
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Auth error:", error.code);
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please sign up.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/email-already-in-use":
          setError("This email is already registered. Please login.");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password. Please check your credentials.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address format.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError(`Authentication error: ${error.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        {successMessage && (
          <Typography
            sx={{
              mt: 1,
              mb: 2,
              padding: 1,
              borderRadius: 1,
              backgroundColor: "success.light",
              color: "success.dark",
              width: "100%",
              textAlign: "center",
            }}
          >
            {successMessage}
          </Typography>
        )}
        {error && (
          <Typography
            color="error"
            sx={{
              mt: 1,
              mb: 2,
              padding: 1,
              borderRadius: 1,
              backgroundColor: "error.light",
              color: "error.dark",
              width: "100%",
              textAlign: "center",
            }}
          >
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            required
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {!isLogin && (
            <TextField
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "scale(1.02)",
                transition: "all 0.2s ease-in-out",
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Please wait...
              </Box>
            ) : isLogin ? (
              "LOG IN"
            ) : (
              "SIGN UP"
            )}
          </Button>
          <Box textAlign="center">
            {isLogin ? (
              <Typography variant="body1" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component="button"
                  onClick={() => {
                    setIsLogin(false);
                    clearForm();
                  }}
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.dark",
                      textDecoration: "none",
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Already have an account?{" "}
                <Link
                  component="button"
                  onClick={() => {
                    setIsLogin(true);
                    clearForm();
                  }}
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.dark",
                      textDecoration: "none",
                    },
                  }}
                >
                  Log In
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
