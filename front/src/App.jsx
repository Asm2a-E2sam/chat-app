import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import AppLayout from "./AppLayout";
import NotFound from "./NotFound/NotFound";
import Register from "./user/Register";
import AuthGuard from "./guards/authGuard";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./user/Login";
import Home from "./Home/Home";
import Chat from "./Chat/Chat";
import axios from "axios";
import { UserContextProvider } from "./context/LoginUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,

    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/chat",
        element: (
          // <AuthGuard>
            <Chat />
          // </AuthGuard>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
  );
}

export default App;
