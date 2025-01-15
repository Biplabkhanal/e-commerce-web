import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_CATEGORIES_SUCCESS,
} from "../actions/productActions";

const initialState = {
  loading: false,
  products: [],
  categories: [],
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        products: [],
        error: action.payload,
      };

    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;
