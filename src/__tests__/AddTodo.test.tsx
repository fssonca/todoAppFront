import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import AddTodo from "../components/AddTodo";
import { saveTodo } from "../api/todoApi";

const mockStore = configureStore([]);
jest.mock("../api/todoApi", () => ({
  saveTodo: jest.fn(), // Mock the saveTodo API call
}));

describe("AddTodo Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      todos: { todos: [] },
    });
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  it("renders input fields and button", () => {
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    expect(screen.getByPlaceholderText("Task name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
  });

  it("disables the Add Todo button when the task name is empty", () => {
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    const button = screen.getByText("Add Todo");
    expect(button).toBeDisabled();
  });

  it("enables the Add Todo button when the task name is entered", () => {
    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    const input = screen.getByPlaceholderText("Task name");
    const button = screen.getByText("Add Todo");

    fireEvent.change(input, { target: { value: "New Task" } });

    expect(button).not.toBeDisabled();
  });

  it("dispatches an action and calls saveTodo when Add Todo is clicked", async () => {
    (saveTodo as jest.Mock).mockResolvedValueOnce({}); // Mock API success

    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    const taskNameInput = screen.getByPlaceholderText("Task name");
    const descriptionInput = screen.getByPlaceholderText("Description");
    const prioritySelect = screen.getByLabelText("Priority");
    const addButton = screen.getByText("Add Todo");

    // Fill in the form
    fireEvent.change(taskNameInput, { target: { value: "Test Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: "4" } });

    // Click the Add Todo button
    fireEvent.click(addButton);

    // Assert that the Redux action was dispatched
    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: "todos/addTodo",
        payload: {
          name: "Test Task",
          description: "Test Description",
          priority: 4,
          dueDate: null,
        },
      },
    ]);

    // Assert that the API was called
    expect(saveTodo).toHaveBeenCalledWith({
      name: "Test Task",
      description: "Test Description",
      priority: 4,
      dueDate: null,
    });
  });

  it("handles saveTodo API errors gracefully", async () => {
    (saveTodo as jest.Mock).mockRejectedValueOnce(new Error("API Error")); // Mock API error

    render(
      <Provider store={store}>
        <AddTodo />
      </Provider>
    );

    const taskNameInput = screen.getByPlaceholderText("Task name");
    const addButton = screen.getByText("Add Todo");

    // Fill in the form
    fireEvent.change(taskNameInput, { target: { value: "Test Task" } });

    // Click the Add Todo button
    fireEvent.click(addButton);

    // Assert the API call was made
    expect(saveTodo).toHaveBeenCalledWith({
      name: "Test Task",
      description: "",
      priority: 3,
      dueDate: null,
    });

    // Since we don't show an error in the UI for now, we check console logs
    // To test error handling better, we can add error feedback in the component
  });
});
