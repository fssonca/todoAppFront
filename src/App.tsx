import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

import Welcome from "./components/Welcome";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import TodoList from "./components/TodoList";
import VerifyEmail from "./components/VerifyEmail";

const App: React.FC = () => {
  // Access the authentication state from the Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Route */}
        <Route
          path="/todos"
          element={
            isAuthenticated ? (
              <TodoList />
            ) : (
              // Redirect to login if not authenticated
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
