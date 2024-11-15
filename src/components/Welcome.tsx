import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Welcome to Todo App
        </h1>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
