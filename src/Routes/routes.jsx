import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home/Home";
import Shop from "../Pages/Shop/Shop";
import AddProduct from "../Pages/Dashboard/AddProduct/AddProduct";
import ManageDiscounts from "../Pages/Dashboard/Discounts/Discounts";
import ManageUsers from "../Pages/Dashboard/ManageUsers/ManageUsers";
import ManageProducts from "../Pages/Dashboard/ManageProducts/ManageProducts";
import ManageContent from "../Pages/Dashboard/ManageContent/ManageContent";
import ManageOrders from "../Pages/Dashboard/Orders/Orders";
import Dashboard from "../Pages/Dashboard/Dashboard";

import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import Checkout from "../Pages/Checkout/Checkout";
import Cart from "../Pages/Cart/Cart";
import Categories from "../Pages/Categories/Categories";
import Profile from "../Pages/User/Profile";
import OrderHistory from "../Pages/User/OrderHistory";
import UserLayout from "../Components/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import About from "../Pages/About/About";
import TermsAndConditions from "../Pages/TermsAndConditions/TermsAndConditions";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,

    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/shop",
        element: <Shop></Shop>,
      },

      {
        path: "/shop/:id",
        element: <ProductDetails />,
      },
      { path: "/categories", element: <Categories /> },

      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "user",
        element: <UserLayout />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },

          { path: "profile", element: <Profile /> },
          { path: "order", element: <OrderHistory /> },
        ],
      },

      {
        path: "/dashboard",

        element: (
          <ProtectedRoute requiredRole="admin">
            <Dashboard></Dashboard>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="add-product" replace /> },
          {
            path: "add-product",
            element: <AddProduct />,
          },
          {
            path: "manage-discounts",
            element: <ManageDiscounts />,
          },
          {
            path: "manage-users",
            element: <ManageUsers />,
          },

          {
            path: "manage-products",
            element: <ManageProducts />,
          },
          {
            path: "manage-orders",
            element: <ManageOrders />,
          },
          {
            path: "manage-content",
            element: <ManageContent />,
          },
        ],
      },
    ],
  },
]);
