import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleRegister = async () => {
    setIsLoading(true); // Start loading

    try {
      // Send registration data to the endpoint
      await axios.post(`${API_BASE_URL}/register-user`, { name, email });

      // Dispatch login action with name and email
      dispatch(login({ name, email }));

      // user will be redirected to a page to inform a six-digit code
      navigate("/verify-email", { state: { email } });
    } catch (error) {
      console.error("Error registering user:", error);
      // You could also show an error message to the user here
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded">
        <h2 className="mb-4 text-xl font-bold text-center">Register</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
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
          onClick={handleRegister}
          className="w-full px-4 h-10 text-white bg-green-500 rounded flex justify-center items-center"
          disabled={isLoading || !!error}
        >
          {isLoading ? <LoadingIcon className="h-6" /> : "Register"}
        </button>
      </div>
    </div>
  );
};

export default Register;
