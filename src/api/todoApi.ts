import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const jwtToken = localStorage.getItem("authToken");

export async function saveTodo(todo: {
  name: string;
  description: string;
  priority: number;
  dueDate: string | null;
}) {
  return axios.post(`${API_BASE_URL}/todos`, todo, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
}

export async function completeTodo(todoId: string, completed: boolean) {
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
  return axios.delete(`${API_BASE_URL}/todos`, {
    data: { todoId },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
}
