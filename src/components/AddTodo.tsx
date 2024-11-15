import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../redux/todoSlice";
import { saveTodo } from "../api/todoApi";

const AddTodo: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3); // Default to "Medium" priority
  const [dueDate, setDueDate] = useState("");

  const dispatch = useDispatch();

  const handleAddTodo = async () => {
    if (name.trim()) {
      const newTodo = {
        name,
        description,
        priority,
        dueDate: dueDate ? dueDate : null, // Set to null if dueDate is empty
      };

      // Dispatch to Redux to update the local state
      dispatch(addTodo(newTodo));

      // Reset the form fields
      setName("");
      setDescription("");
      setPriority(3); // Reset to "Medium" priority
      setDueDate("");

      try {
        // Save the new todo to the backend
        await saveTodo(newTodo);
      } catch (error) {
        console.error("Failed to save todo:", error);
      }
    }
  };

  return (
    <div className="relative flex flex-col px-4 py-2 border border-gray-300 rounded-md">
      <div className="flex flex-col">
        <input
          className="mb-2 font-bold text-xl border-none focus:outline-none"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task name"
        />
        <textarea
          className="mb-2 h-16 text-base border-none focus:outline-none resize-none"
          value={description}
          maxLength={150}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex flex-row items-center w-full sm:w-auto mb-2 sm:mb-0">
          <div className="w-1/2 sm:w-auto">
            <span className="text-slate-600 pl-1">Priority:</span>
            <select
              className="font-bold focus:outline-none w-full sm:w-auto"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              aria-label="Priority"
            >
              <option value={1}>Lowest</option>
              <option value={2}>Low</option>
              <option value={3}>Medium</option>
              <option value={4}>High</option>
              <option value={5}>Highest</option>
            </select>
          </div>
          <div className="w-1/2 sm:w-auto">
            <input
              className="ml-0 sm:ml-4 pl-6 w-full sm:w-auto"
              type="date"
              aria-label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={handleAddTodo}
            disabled={!name.trim()}
            className={`w-full px-4 py-2 mt-2 text-white rounded transition-colors duration-300 ${
              name.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
            }`}
          >
            Add Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodo;
