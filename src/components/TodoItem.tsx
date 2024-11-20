import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  toggleTodo,
  deleteTodoOptimistic,
  setEditingStatus,
} from "../redux/todoSlice";
import { ReactComponent as EditIcon } from "../assets/edit.svg";
import { ReactComponent as CheckIcon } from "../assets/checkmark.svg";
import { ReactComponent as TrashIcon } from "../assets/delete.svg";
import { priorityConfig } from "../utils/constants";
import { TodoProps } from "../types";
import { completeTodo, deleteTodo } from "../api/todoApi";

const getPriorityLabelAndColor = (priority: number) => {
  return (
    priorityConfig[priority] || {
      label: "Unknown",
      textColor: "text-gray-500",
      borderColor: "border-gray-500",
    }
  );
};

const TodoItem: React.FC<TodoProps> = ({
  todoId,
  name,
  description,
  priority,
  dueDate,
  completed,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleComplete = () => {
    dispatch(toggleTodo(todoId));

    const newCompletedStatus = !completed;
    completeTodo(todoId, newCompletedStatus).catch((error) => {
      console.error("Failed to update todo:", error);
    });
  };

  const handleDelete = () => {
    // Optimistically update the UI
    dispatch(deleteTodoOptimistic(todoId));

    // Call the API in the background
    deleteTodo(todoId).catch((error) => {
      console.error("Failed to delete todo:", error);
    });
  };

  const handleEditToggle = () => {
    dispatch(setEditingStatus({ todoId, isEditing: true }));
  };

  const {
    label: priorityLabel,
    textColor,
    borderColor,
  } = getPriorityLabelAndColor(priority);

  return (
    <li
      className={`flex flex-col p-4 mb-2 rounded-r border-l-4 ${
        completed ? "border-gray-500 bg-gray-50" : `${borderColor} bg-white`
      }`}
      style={{
        borderTopLeftRadius: "0px",
        borderBottomLeftRadius: "0px",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3
            className={`text-lg font-bold ${
              completed ? "line-through text-gray-500" : ""
            }`}
          >
            {name}
          </h3>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full mt-2 space-x-4">
        <div className="flex items-center space-x-4">
          <span
            className={`font-bold ${completed ? "text-slate-400" : textColor}`}
          >
            {priorityLabel}
          </span>
          <span>
            Due:{" "}
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleComplete}
            className="p-2 rounded"
            aria-label="Mark as complete"
          >
            <CheckIcon className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleEditToggle}
            className="p-2 rounded"
            aria-label="Edit task"
          >
            <EditIcon className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded"
            aria-label="Delete task"
          >
            <TrashIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
