import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.css'; 
import AppLayout from "./AppLayout";
import NotFound from "./NotFound/NotFound";
import Register from "./user/Register"
import AuthGuard from "./guards/authGuard"
import {AuthProvider} from './context/AuthContext'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./user/Login";
import Home from "./Home/Home";
import Chat from "./Chat/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,

    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/chat", element: <AuthGuard><Chat/></AuthGuard>},
      { path: "*", element: <NotFound /> },
    ],
  },
]);


function App() {
  const [isLogged, setIsLogged] =useState((localStorage.getItem(`token`)) ? true : false);
  return (
      <AuthProvider value = {{isLogged, setIsLogged}}>
        <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App
