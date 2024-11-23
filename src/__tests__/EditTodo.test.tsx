import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditTodoItem from "../components/EditTodoItem";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { updateTodo } from "../api/todoApi";
import { editTodo, setEditingStatus } from "../redux/todoSlice";

// Mock the updateTodo API call
jest.mock("../api/todoApi", () => ({
  updateTodo: jest.fn(),
}));

const mockStore = configureStore([]);

describe("EditTodoItem Component", () => {
  let store: any;

  const initialTodo = {
    todoId: "1",
    name: "Test Task",
    description: "Test Description",
    priority: 3,
    dueDate: "2024-12-01",
    completed: false,
  };

  beforeEach(() => {
    store = mockStore({
      todos: { todos: [initialTodo] },
    });

    store.dispatch = jest.fn();
    jest.clearAllMocks();
  });

  it("renders input fields with initial values", () => {
    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();

    const prioritySelect = screen.getByLabelText(
      "Priority"
    ) as HTMLSelectElement;
    expect(prioritySelect.value).toBe("3");

    expect(screen.getByDisplayValue("2024-12-01")).toBeInTheDocument();
  });

  it("updates state when input values change", () => {
    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText(
      "Task name"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Description"
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      "Priority"
    ) as HTMLSelectElement;
    const dueDateInput = screen.getByLabelText("Due Date") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Updated Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: "5" } });
    fireEvent.change(dueDateInput, { target: { value: "2024-12-31" } });

    expect(nameInput.value).toBe("Updated Task");
    expect(descriptionInput.value).toBe("Updated Description");
    expect(prioritySelect.value).toBe("5");
    expect(dueDateInput.value).toBe("2024-12-31");
  });

  it("disables the Save Changes button when the task name is empty", () => {
    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText(
      "Task name"
    ) as HTMLInputElement;
    const saveButton = screen.getByText("Save Changes") as HTMLButtonElement;

    // Initially, the button should be enabled
    expect(saveButton).not.toBeDisabled();

    // Clear the task name
    fireEvent.change(nameInput, { target: { value: "" } });

    // The button should now be disabled
    expect(saveButton).toBeDisabled();
  });

  it("calls updateTodo and dispatches actions when Save Changes is clicked", async () => {
    // Mock the API call to resolve successfully
    (updateTodo as jest.Mock).mockResolvedValueOnce({});

    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    const nameInput = screen.getByPlaceholderText(
      "Task name"
    ) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(
      "Description"
    ) as HTMLTextAreaElement;
    const prioritySelect = screen.getByLabelText(
      "Priority"
    ) as HTMLSelectElement;
    const dueDateInput = screen.getByLabelText("Due Date") as HTMLInputElement;
    const saveButton = screen.getByText("Save Changes") as HTMLButtonElement;

    // Change input values
    fireEvent.change(nameInput, { target: { value: "Updated Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated Description" },
    });
    fireEvent.change(prioritySelect, { target: { value: "5" } });
    fireEvent.change(dueDateInput, { target: { value: "2024-12-31" } });

    // Click the Save Changes button
    fireEvent.click(saveButton);

    // Wait for the async actions to complete
    await waitFor(() => expect(updateTodo).toHaveBeenCalled());

    // Assert that updateTodo was called with the correct arguments
    expect(updateTodo).toHaveBeenCalledWith("1", {
      name: "Updated Task",
      description: "Updated Description",
      priority: 5,
      dueDate: "2024-12-31",
    });

    // Assert that the Redux actions were dispatched
    expect(store.dispatch).toHaveBeenCalledWith(
      editTodo({
        todoId: "1",
        updates: {
          name: "Updated Task",
          description: "Updated Description",
          priority: 5,
          dueDate: "2024-12-31",
        },
      })
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      setEditingStatus({ todoId: "1", isEditing: false })
    );
  });

  it("shows loading indicator when isLoading is true", async () => {
    // Mock the API call to resolve after some delay
    (updateTodo as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    const saveButton = screen.getByRole("button", { name: /save changes/i });

    // Click the Save Changes button
    fireEvent.click(saveButton);

    // The button should now display the loading indicator
    expect(saveButton.textContent).not.toBe("Save Changes");

    // Wait for the API call to complete
    await waitFor(() => expect(updateTodo).toHaveBeenCalled());

    // Wait for the button to display "Save Changes" again
    await waitFor(() => {
      const updatedSaveButton = screen.getByRole("button", {
        name: /save changes/i,
      });
      expect(updatedSaveButton.textContent).toBe("Save Changes");
    });
  });

  it("calls handleEditToggle when Cancel is clicked", () => {
    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    const cancelButton = screen.getByText("Cancel") as HTMLButtonElement;

    // Click the Cancel button
    fireEvent.click(cancelButton);

    // Assert that setEditingStatus action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(
      setEditingStatus({ todoId: "1", isEditing: false })
    );
  });

  it("handles updateTodo API errors gracefully", async () => {
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();
    window.alert = jest.fn();

    (updateTodo as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(
      <Provider store={store}>
        <EditTodoItem {...initialTodo} />
      </Provider>
    );

    const saveButton = screen.getByText("Save Changes") as HTMLButtonElement;

    // Click the Save Changes button
    fireEvent.click(saveButton);

    // Wait for the async actions to complete
    await waitFor(() => expect(updateTodo).toHaveBeenCalled());

    // Assert that alert was called
    expect(window.alert).toHaveBeenCalledWith(
      "Failed to update todo - please try again"
    );

    // Assert that the error was logged
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Failed to update todo:",
      expect.any(Error)
    );

    consoleErrorMock.mockRestore();
  });
});
