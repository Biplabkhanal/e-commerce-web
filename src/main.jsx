import React from "react";
import ReactDOM from "react-dom/client"; // Use the `client` entry point in React 18
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";

// Replace ReactDOM.render with ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
