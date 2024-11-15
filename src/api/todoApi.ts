import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export async function saveTodo(todo: {
  name: string;
  description: string;
  priority: number;
  dueDate: string | null;
}) {
  const jwtToken = localStorage.getItem("authToken");

  return axios.post(`${API_BASE_URL}/todos`, todo, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
}

export async function completeTodo(todoId: string, completed: boolean) {
  const jwtToken = localStorage.getItem("authToken");

  return axios.post(
    `${API_BASE_URL}/todos/complete`,
    { todoId, completed },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function deleteTodo(todoId: string) {
  const jwtToken = localStorage.getItem("authToken");

  return axios.delete(`${API_BASE_URL}/todos`, {
    data: { todoId },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
}
