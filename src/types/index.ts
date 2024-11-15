export interface TodoProps {
  todoId: string;
  name: string;
  description: string;
  priority: number;
  dueDate: string | null;
  completed: boolean;
}
