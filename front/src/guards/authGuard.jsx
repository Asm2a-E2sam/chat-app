import React from 'react'
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NotFound from '../NotFound/NotFound';
import { UserContext } from '../context/LoginUser';

export default function AuthGuard({ children }) {
    const { isLogged } = useContext(UserContext);
    console.log(isLogged);
    const navigate = useNavigate();
    if (isLogged) {
        return children
    } else {
        <NotFound/>
        Swal.fire({
            icon: "warning",
            title: "You Must Log in first",
            showCancelButton: true,
            confirmButtonText: "Log in",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }else{
              navigate("/");
            }
          });
        }

}
