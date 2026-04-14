import React, {
  createContext,
  useCallback,
  useContext,
} from "react";
import { Alert, Platform } from "react-native";
import {
  useListTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  type Task,
} from "@workspace/api-client-react";

export type { Task };

interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: { title: string; description?: string; dueDate?: string | null }, options?: { onSuccess?: () => void }) => void;
  updateTask: (id: string, updates: { title?: string; description?: string | null; dueDate?: string | null; status?: "pending" | "completed" }, options?: { onSuccess?: () => void }) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  refresh: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const notify = (title: string, message?: string) => {
  if (Platform.OS === "web") {
    // Web handles window.alert better in some environments than Alert.alert shim
    alert(message ? `${title}: ${message}` : title);
  } else {
    Alert.alert(title, message);
  }
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { data: tasks = [], isLoading, refetch } = useListTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const addTask = useCallback(
    (task: { title: string; description?: string | null; dueDate?: string | null }, options?: { onSuccess?: () => void }) => {
      createTaskMutation.mutate(
        { data: task },
        {
          onSuccess: (data) => {
            refetch();
            if (options?.onSuccess) {
              options.onSuccess();
            } else {
              notify(data.message || "done");
            }
          },
        }
      );
    },
    [createTaskMutation, refetch]
  );

  const updateTask = useCallback(
    (id: string, updates: { title?: string; description?: string | null; dueDate?: string | null; status?: "pending" | "completed" }, options?: { onSuccess?: () => void }) => {
      updateTaskMutation.mutate(
        { id, data: updates },
        {
          onSuccess: (data) => {
            refetch();
            if (options?.onSuccess) {
              options.onSuccess();
            } else {
              notify(data.message || "done");
            }
          },
        }
      );
    },
    [updateTaskMutation, refetch]
  );

  const deleteTask = useCallback(
    (id: string) => {
      deleteTaskMutation.mutate(
        { id },
        {
          onSuccess: (data) => {
            refetch();
            notify(data.message || "done");
          },
        }
      );
    },
    [deleteTaskMutation, refetch]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const newStatus = task.status === "pending" ? "completed" : "pending";
        updateTaskMutation.mutate(
          { id, data: { status: newStatus } },
          {
            onSuccess: (data) => {
              refetch();
              notify(data.message || "done");
            },
          }
        );
      }
    },
    [tasks, updateTaskMutation, refetch]
  );

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        toggleStatus,
        getTask,
        refresh: refetch,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
