import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

function getAuthHeaders() {
  const jwtToken = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
  };
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: getAuthHeaders(),
});

// interceptor to handle responses
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
