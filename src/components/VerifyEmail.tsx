import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { email } = location.state || {}; // Retrieve email from state

  const navigate = useNavigate();

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Send verification code to the backend
      const response = await axios.post(`${API_BASE_URL}/verify-email`, {
        code,
        email,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("authToken", token);

        navigate("/todos");
      }
    } catch (error) {
      setError("Invalid or expired code. Please try again.");
      console.error("Error verifying code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded w-full max-w-sm">
        <h2 className="mb-4 text-xl font-bold text-center">
          Verify Your Email
        </h2>
        <p className="mb-4 text-center text-gray-600">
          Enter the 6-digit code sent to your email.
        </p>

        <input
          className="w-full p-2 mb-4 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="6-digit code"
          maxLength={6}
        />

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition disabled:bg-blue-300 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? <LoadingIcon className="h-6" /> : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
