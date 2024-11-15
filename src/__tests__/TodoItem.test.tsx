import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TodoItem from "../components/TodoItem";
import { mockAxiosResponse } from "../utils";
import { completeTodo, deleteTodo } from "../api/todoApi";

// Mock the modules using a factory function
jest.mock("../api/todoApi", () => {
  return {
    __esModule: true,
    completeTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };
});

const mockStore = configureStore([]);

const mockTodo = {
  todoId: "1",
  name: "Test Task",
  description: "This is a test task",
  priority: 3,
  dueDate: "2024-11-18T12:00:00Z",
  completed: false,
};

describe("TodoItem Component", () => {
  let store: any;
  let completeTodoMock: jest.MockedFunction<typeof completeTodo>;
  let deleteTodoMock: jest.MockedFunction<typeof deleteTodo>;

  beforeEach(() => {
    store = mockStore({
      todos: { todos: [mockTodo] },
    });

    jest.clearAllMocks();

    completeTodoMock = completeTodo as jest.MockedFunction<typeof completeTodo>;
    deleteTodoMock = deleteTodo as jest.MockedFunction<typeof deleteTodo>;

    completeTodoMock.mockResolvedValue(mockAxiosResponse({ success: true }));
    deleteTodoMock.mockResolvedValue(mockAxiosResponse({ success: true }));
  });

  it("renders todo item correctly", () => {
    render(
      <Provider store={store}>
        <TodoItem {...mockTodo} />
      </Provider>
    );

    expect(screen.getByText(mockTodo.name)).toBeInTheDocument();
    expect(screen.getByText(mockTodo.description)).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument(); // Priority label
    expect(screen.getByText(/Due:\s*11\/18\/2024/)).toBeInTheDocument(); // Flexible date matching
  });

  it("handles completeTodo correctly", () => {
    render(
      <Provider store={store}>
        <TodoItem {...mockTodo} />
      </Provider>
    );

    const completeButton = screen.getByRole("button", {
      name: "Mark as complete",
    });
    fireEvent.click(completeButton);

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: "todos/toggleTodo",
        payload: mockTodo.todoId,
      },
    ]);

    expect(completeTodoMock).toHaveBeenCalledWith(mockTodo.todoId, true);
  });

  it("handles deleteTodo correctly", () => {
    render(
      <Provider store={store}>
        <TodoItem {...mockTodo} />
      </Provider>
    );

    const deleteButton = screen.getByRole("button", { name: "Delete task" });
    fireEvent.click(deleteButton);

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: "todos/deleteTodoOptimistic",
        payload: mockTodo.todoId,
      },
    ]);

    expect(deleteTodoMock).toHaveBeenCalledWith(mockTodo.todoId);
  });
});
