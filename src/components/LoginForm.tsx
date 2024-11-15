import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Validate email format
    if (emailRegex.test(emailValue)) {
      setError(""); // Clear error if email is valid
    } else {
      setError("Please enter a valid email address");
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/login`, { email });
      dispatch(login({ name: "User", email }));
      // user will be redirected to a page to inform a six-digit code
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      console.error("Error sending login code:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded min-w-80">
        <h2 className="mb-4 text-xl font-bold text-center">Login</h2>
        <input
          className={`w-full p-2 mb-2 border rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />

        <div className="mb-4 text-red-500 text-sm text-center w-full">
          {error}
        </div>

        <button
          onClick={handleLogin}
          className="w-full px-4 h-10 text-white bg-blue-500 rounded flex justify-center items-center"
          disabled={isLoading || !!error}
        >
          {isLoading ? <LoadingIcon className="h-6" /> : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
