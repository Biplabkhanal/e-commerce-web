import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Products from "./components/products";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import PaymentSuccess from "../khalti/PaymentSuccess";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
