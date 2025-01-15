import axios from "axios";

const BASE_URL = "https://fakestoreapi.com";

// Action types
export const FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS";
export const SORT_PRODUCTS = "SORT_PRODUCTS";

// Fetch all products
export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const response = await axios.get("/api/products");
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch products",
    });
  }
};

// Fetch products by category
export const fetchProductsByCategory = (category) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const url =
      category === "all"
        ? `${BASE_URL}/products`
        : `${BASE_URL}/products/category/${category}`;
    const response = await axios.get(url);
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch products",
    });
  }
};

// Fetch categories
export const fetchCategories = () => async (dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/categories`);
    dispatch({
      type: FETCH_CATEGORIES_SUCCESS,
      payload: ["all", ...response.data],
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};
