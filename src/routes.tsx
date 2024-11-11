import React from "react";

// Auth Imports
import SignIn from "views/auth/SignIn";
import Register from "views/auth/Register";
import ResetPassword from "views/auth/ResetPassword";

// Admin Imports
import MainDashboard from "views/admin/dashboard";
import Profile from "views/admin/profile";
import Products from "views/admin/products";
import Categories from "views/admin/categories";
import Quotes from "views/admin/quotes";

// Icon Imports
import {
  MdCategory,
  MdHome,
  MdOutlineProductionQuantityLimits,
  MdQuestionAnswer
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const routes = [
  {
    name: "Register",
    layout: "/auth",
    path: "register",
    icon: "",
    component: <Register />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: "",
    component: <SignIn />,
  },
  {
    name: "Reset Password",
    layout: "/auth",
    path: "reset-password",
    icon: "",
    component: <ResetPassword />,
  },
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <Categories />,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "products",
    icon: <MdOutlineProductionQuantityLimits className="h-6 w-6" />,
    component: <Products />,
  },
  {
    name: "Quotations",
    layout: "/admin",
    path: "quotations",
    icon: <MdQuestionAnswer className="h-6 w-6" />,
    component: <Quotes />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <FaUserCircle className="h-6 w-6" />,
    component: <Profile />,
  },
];
export default routes;
