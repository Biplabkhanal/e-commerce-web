import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAGWwvRh_LTmR6LjZbM4LHKlQypOTou6wk",
  authDomain: "e-commerce-d9bac.firebaseapp.com",
  projectId: "e-commerce-d9bac",
  storageBucket: "e-commerce-d9bac.firebasestorage.app",
  messagingSenderId: "229247097839",
  appId: "1:229247097839:web:bc9e2d22c41a5197ee341a",
  measurementId: "G-98QNGWQ62Y",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
