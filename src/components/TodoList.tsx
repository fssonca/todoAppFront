import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTodosThunk, setFilter, Filter } from "../redux/todoSlice";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import FilterButtons from "./FilterButtons";
import EditTodoItem from "./EditTodoItem";

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, filter, loading, error } = useSelector(
    (state: RootState) => state.todos
  );

  // Fetch todos on component mount
  useEffect(() => {
    dispatch(fetchTodosThunk());
  }, [dispatch]);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "pending") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleFilterChange = (newFilter: Filter) => {
    dispatch(setFilter(newFilter));
  };

  return (
    <div className="flex justify-center">
      <div className="p-6 w-full max-w-7xl">
        <AddTodo />
        <FilterButtons
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />

        {loading ? (
          <div className="mt-10 w-full text-center italic text-slate-400">
            Loading tasks...
          </div>
        ) : error ? (
          <div className="mt-10 w-full text-center italic text-red-500">
            {error}
          </div>
        ) : filteredTodos.length ? (
          <ul>
            {filteredTodos.map((todo) =>
              todo.isEditing ? (
                <EditTodoItem key={todo.todoId} {...todo} />
              ) : (
                <TodoItem key={todo.todoId} {...todo} />
              )
            )}
          </ul>
        ) : (
          <div className="mt-10 w-full text-center italic text-slate-400">
            No tasks :(
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
