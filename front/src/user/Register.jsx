import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  let [disable, setDisable] = useState(false);
  const { isLogged, setIsLogged } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    nameError: "",
    passwordError: "",
    confirmPasswordError: "",
    emailError: "",
  });
  const emailRegex = /[a-z0-9]{5,}@[a-z]{3,}\.[a-z]{3,}/;

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
            : event.target.value.length >= 4
            ? ""
            : "Use minimum 4 characters",
      });
    } else if (event.target.name === "confirmPassword") {
      setUser({ ...user, confirmPassword: event.target.value });
      setErrors({
        ...errors,
        confirmPasswordError:
          event.target.value.length === 0
            ? "This field is Required"
            : event.target.value === user.password
            ? ""
            : "Passwords don't match",
      });
    } else if (event.target.name === "email") {
      setUser({ ...user, email: event.target.value });
      setErrors({
        ...errors,
        emailError:
          event.target.value.length === 0
            ? "This field is Required"
            : emailRegex.test(event.target.value)
            ? ""
            : "Email Not Valid",
      });
    }
  }

  useEffect(() => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      if (user.name && user.password && user.confirmPassword && user.email) {
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

    localStorage.setItem("userInfo", JSON.stringify(user));

    Swal.fire({
      icon: "success",
      title: "Account Created",
      text: "You can Log in now",
      showCancelButton: true,
      confirmButtonText: "Log in",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });

    setUser({
      nameError: "",
      PasswordError: "",
      confirmPasswordError: "",
      emailError: "",
    });
  };

  const login = () => {
    navigate("/login");
  };
  return (
    <div className="my-bg h-screen flex items-center">
      <form className="w-96 mx-auto mb-12" onSubmit={handleFormSubmit}>
        <div className="flex justify-center items-center mb-4">
          <img src="./chatting.png" alt="logo" width={55} className="pr-3" />
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
          value={user.email}
          name="email"
          onChange={(e) => validation(e)}
          onBlur={(e) => validation(e)}
          type="email"
          placeholder="email"
          className={`block w-full rounded-sm p-2 mb-2 border ${
            errors.emailError ? "border-red-500" : ""
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
        <input
          value={user.confirmPassword}
          name="confirmPassword"
          onChange={(e) => validation(e)}
          onBlur={(e) => validation(e)}
          type="password"
          placeholder="confirm password"
          className={`block w-full rounded-sm p-2 mb-2 border ${
            errors.confirmPasswordError ? "border-red-500" : ""
          }`}
        />
        <button
          className={`btn-chat text-white block w-full rounded-sm p-2 ${
            !disable ? "opacity-75" : ""
          }`}
          disabled={!disable}
        >
          Register
        </button>
        <div className="text-center mt-2">
          <div>
            Already a member?
            <button className="ml-1" onClick={login}>
              Login here
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
