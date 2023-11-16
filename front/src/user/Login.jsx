import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../axiosConfig/TalkWaveDB";
import Swal from "sweetalert2";

export default function Login() {
    const navigate = useNavigate();
    let [disable, setDisable] = useState(false);
    const { isLogged, setIsLogged } = useContext(AuthContext);
    const [user, setUser] = useState({
      name: "",
      password: ""
    });
    const [errors, setErrors] = useState({
      nameError: "",
      passwordError: ""
    });

    function validation(event) {
      //title
      if (event.target.name === "name") {
        setUser({ ...user, name: event.target.value });
        setErrors({
          ...errors,
          nameError:
            event.target.value.length === 0 ? "This field is Required" : "",
        });
      } else if (event.target.name === "password") {
        setUser({ ...user, password: event.target.value });
        setErrors({
          ...errors,
          passwordError:
            event.target.value.length === 0
              ? "This field is Required"
              : ""
        });
      }
    }
  
    useEffect(() => {
      const hasErrors = Object.values(errors).some((error) => error !== "");
      if (!hasErrors) {
        if (user.name && user.password ) {
          setDisable(true);
        } else {
          setDisable(false);
        }
      } else {
        setDisable(false);
      }
    }, [errors, user]);
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      let loginUser ={ username: user.name, password: user.password };
      // console.log(user);
      await axiosInstance.post(`users/login`, loginUser)
        .then((res) => {
          setIsLogged(true)
          loginUser = {...loginUser, email : res.data.user.email}
          localStorage.setItem("userInfo", JSON.stringify(loginUser));
          localStorage.setItem("token", JSON.stringify(res.data.token));
          navigate('/chat')
        })
        .catch((err) => {
          console.error(err);
        });
  
      
    //   Swal.fire({
    //     icon: "success",
    //     title: "Account Created",
    //     text: "You can Log in now",
    //     showCancelButton: true,
    //     confirmButtonText: "Log in",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       navigate("/login");
    //     }
    //   });
      
      setUser({
        name: "",
        password: ""
      });
      setErrors({
        nameError:"",
        passwordError:""
      })
    };
  
  const register=()=>{
    navigate("/register")
  }
  return (
    <div className="my-bg h-screen flex items-center">
      <form className="w-96 mx-auto mb-12" onSubmit={handleFormSubmit}>
        <div className="flex justify-center items-center mb-4">
            <img src="./chatting.png" alt="logo" width={55} className="pr-3"/>
            <h1 className="chatting">TalkWave</h1>
        </div>  
        <input
          value={user.name}
          name="name"
          type="text"
          placeholder="username"
          onChange={(e) => validation(e)}
          onBlur={(e) => validation(e)}
          className={`block w-full rounded-sm p-2 mb-2 border ${
            errors.nameError ? "border-red-500" : ""
          }`}
        />
        <input
          value={user.password}
          name="password"
          onChange={(e) => validation(e)}
          onBlur={(e) => validation(e)}
          type="password"
          placeholder="password"
          className={`block w-full rounded-sm p-2 mb-2 border ${
            errors.passwordError ? "border-red-500" : ""
          }`}
        />
        <button className={`btn-chat text-white block w-full rounded-sm p-2 ${
                  !disable ? "opacity-75" : ""
                }`}
                disabled={!disable}>
          Log in
        </button>
        <div className="text-center mt-2">
          <div>
          Dont have an account?
            <button
              className="ml-1"
              onClick={register}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
