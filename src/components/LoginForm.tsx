import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/login`, { email });
      dispatch(login({ name: "User", email }));
      // user will be redirected to a page to inform a six-digit code
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      console.error("Error sending login code:", err);
    }
    finally {
      setIsLoading(false);  
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded min-w-80 ">
        <h2 className="mb-4 text-xl font-bold text-center">Login</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
     

        <button
          onClick={handleLogin}
          className="w-full px-4 h-10 text-white bg-blue-500 rounded flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <LoadingIcon className="h-6" /> : "Login"}
        </button>


      </div>
    </div>
  );
};

export default LoginForm;
