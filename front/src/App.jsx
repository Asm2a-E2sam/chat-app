import { useState } from "react";
import AppLayout from "./AppLayout";
import NotFound from "./NotFound/NotFound";
import Register from "./user/Register"
import {AuthProvider} from './context/AuthContext'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./user/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,

    children: [
      { index: true, element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      // { path: "/chat", element: <AuthGuard><Chat/></AuthGuard>},
      { path: "*", element: <NotFound /> },
    ],
  },
]);


function App() {
  const [isLogged, setIsLogged] =useState(false);
  return (
      <AuthProvider value = {{isLogged, setIsLogged}}>
        <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App
