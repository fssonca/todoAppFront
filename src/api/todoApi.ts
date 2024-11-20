import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to dynamically add the JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem("authToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, simply return it
    return response;
  },
  (error) => {
    // If a response error occurs
    if (error.response && error.response.status === 401) {
      // Clear the token if it exists
      localStorage.removeItem("authToken");

      // Redirect the user to the login/register page
      window.location.href = "/";
    }
    // Reject the promise with the error object
    return Promise.reject(error);
  }
);

export async function fetchTodos() {
  return axiosInstance.get("/todos");
}

export async function saveTodo(todo: {
  name: string;
  description: string;
  priority: number;
  dueDate: string | null;
}) {
  return axiosInstance.post("/todos", todo);
}

export async function completeTodo(todoId: string, completed: boolean) {
  return axiosInstance.post("/todos/complete", { todoId, completed });
}

export async function deleteTodo(todoId: string) {
  return axiosInstance.delete("/todos", {
    data: { todoId },
  });
}

export async function updateTodo(
  todoId: string,
  updates: {
    name?: string;
    description?: string;
    priority?: number;
    dueDate?: string | null;
    completed?: boolean;
  }
) {
  return axiosInstance.patch(`/todos/${todoId}`, updates);
}
