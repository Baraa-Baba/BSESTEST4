import React from "react";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import ReactDOM from "react-dom/client";
import './css/index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom"; 
import Navbar from './components/navbar'
import Sell from "./routes/Sell";
import Home from "./routes/Home";
import { UserAuthContextProvider } from "./context/AuthContext";
import SignIn from "./routes/SignIn";
import Account from "./routes/Account";
import Protected from "./components/Producted";
import AboutUs from "./routes/AboutUs";
import Footer from "./components/Footer"; 
import "bootstrap/dist/css/bootstrap.min.css";
import Admin from "./routes/Admin";
import Buy from "./routes/Buy";
import BuySepecfic from "./routes/BuySepecfic";
import AdminSpecfic from "./routes/AdminSpecfic";
import SellSpecfic from "./routes/SellSpecfic";
import InstagramPost from "./components/InstagramPost";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />, 
    errorElement:<ErrorPage />,
  },
  {
    path: "about-us/",
    element: <AboutUs /> ,
  },
  {
    path: "sell/",
    element: <Protected> <Sell /></Protected>  ,
  },
  {
    path: "sign-in/",
    element:<SignIn /> ,
  },
  {
    path:'account/',
    element:<Protected><Account /> </Protected>,
  },
  {
    path:'account/sell/:productId',
    element:<Protected><SellSpecfic /> </Protected>,
  },
  {
    path:'Admin/',
    element:<Protected><Admin /> </Protected>,
  },
  {
    path:'Admin/:productId',
    element:<Protected><AdminSpecfic /> </Protected>,
  },
  {
    path:'buy/',
    element:<Buy />,
  }, 
  {
    path:'InstagramPost/',
    element:<InstagramPost />,
  }, 
  {
    path:'buy/:buyId',
    element:<BuySepecfic /> ,
  },
]); 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthContextProvider>  
      <Navbar />
    <RouterProvider router={router} /> 
    <Footer  /> 
    </UserAuthContextProvider>
  </React.StrictMode>
);