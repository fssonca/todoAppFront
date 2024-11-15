import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

interface Todo {
  todoId: string;
  name: string;
  description: string;
  priority: number;
  dueDate: string | null;
  completed: boolean;
}

export type Filter = "all" | "pending" | "completed";

interface TodoState {
  todos: Todo[];
  filter: Filter;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  filter: "all",
  loading: false,
  error: null,
};

// Async thunk to fetch todos from the backend
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const jwtToken = localStorage.getItem("authToken");

  const response = await axios.get(`${API_BASE_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  return response.data.map((todo: any) => ({
    todoId: todo.todoId,
    name: todo.name,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate,
    completed: todo.completed,
  }));
});

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(
      state,
      action: PayloadAction<{
        name: string;
        description: string;
        priority?: number;
        dueDate?: string | null;
      }>
    ) {
      const newTodo: Todo = {
        todoId: Date.now().toString(),
        name: action.payload.name,
        description: action.payload.description,
        priority: action.payload.priority ?? 1,
        dueDate: action.payload.dueDate ?? null,
        completed: false,
      };
      state.todos.push(newTodo);
      state.todos.sort((a, b) => b.priority - a.priority);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find((todo) => todo.todoId === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodoOptimistic(state, action: PayloadAction<string>) {
      // Optimistically remove the todo from the list
      state.todos = state.todos.filter(
        (todo) => todo.todoId !== action.payload
      );
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.todos.sort((a, b) => b.priority - a.priority);
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todos";
      });
  },
});

export const { addTodo, toggleTodo, deleteTodoOptimistic, setFilter } =
  todoSlice.actions;
export default todoSlice.reducer;
