import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTodo } from "../api/todoApi";
import { AppDispatch } from "../redux/store";
import { TodoProps } from "../types";
import { ReactComponent as LoadingIcon } from "../assets/loading.svg";
import { editTodo, setEditingStatus } from "../redux/todoSlice";

const EditTodoItem: React.FC<TodoProps> = ({
  todoId,
  name,
  description,
  priority,
  dueDate,
}) => {
  const [editedName, setEditedName] = useState(name);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedPriority, setEditedPriority] = useState(priority);
  const [editedDueDate, setEditedDueDate] = useState(dueDate || "");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const updates = {
      name: editedName,
      description: editedDescription,
      priority: editedPriority,
      dueDate: editedDueDate || null,
    };

    try {
      await updateTodo(todoId, updates);

      dispatch(
        editTodo({
          todoId,
          updates,
        })
      );

      handleEditToggle();
    } catch (error) {
      alert("Failed to update todo - please try again");
      console.error("Failed to update todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    dispatch(setEditingStatus({ todoId, isEditing: false }));
  };

  return (
    <div className="relative flex flex-col px-4 py-2 border border-gray-300 rounded-md">
      <div className="flex flex-col">
        <input
          className="mb-2 font-bold text-xl border-none focus:outline-none"
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Task name"
        />
        <textarea
          className="mb-2 h-16 text-base border-none focus:outline-none resize-none"
          value={editedDescription}
          maxLength={150}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex flex-row items-center w-full sm:w-auto mb-2 sm:mb-0">
          <div className="w-auto flex items-center">
            <span className="text-slate-600 pl-1 whitespace-nowrap pr-2">
              Priority:
            </span>
            <select
              className="font-bold focus:outline-none w-full sm:w-auto"
              value={editedPriority}
              onChange={(e) => setEditedPriority(Number(e.target.value))}
              aria-label="Priority"
            >
              <option value={1}>Lowest</option>
              <option value={2}>Low</option>
              <option value={3}>Medium</option>
              <option value={4}>High</option>
              <option value={5}>Highest</option>
            </select>
          </div>
          <div className="w-auto sm:w-auto ml-4">
            <input
              className="pl-2 h-10 border border-gray-300 rounded"
              type="date"
              aria-label="Due Date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-auto flex flex-row space-x-2">
          <button
            onClick={handleSaveChanges}
            disabled={!editedName.trim()}
            className={`flex justify-center items-center h-10 w-40 px-4 py-0 mt-1 text-white rounded transition-colors duration-300 ${
              editedName.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400"
            }`}
          >
            {isLoading ? (
              <LoadingIcon className="h-4 w-auto" />
            ) : (
              "Save Changes"
            )}
          </button>

          <button
            onClick={handleEditToggle}
            className="h-10 px-4 py-0 mt-1 text-white bg-gray-400 hover:bg-gray-500 rounded transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTodoItem;
