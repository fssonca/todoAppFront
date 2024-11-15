import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          className="w-full p-2 mb-4 border rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button
          onClick={handleRegister}
          className="w-full px-4 h-10 text-white bg-green-500 rounded flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <LoadingIcon className="h-6" /> : "Register"}
        </button>
      </div>
    </div>
  );
};

export default Register;
