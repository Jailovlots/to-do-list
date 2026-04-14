import React, {
  createContext,
  useCallback,
  useContext,
} from "react";
import { Alert, Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  getListTasksQueryKey,
  type Task,
} from "@workspace/api-client-react";

export type { Task };

interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: { title: string; description?: string; dueDate?: string | null }, options?: { onSuccess?: () => void }) => void;
  updateTask: (id: string, updates: { title?: string; description?: string | null; dueDate?: string | null; status?: "pending" | "completed" }, options?: { onSuccess?: () => void }) => void;
  deleteTask: (id: string, options?: { onSuccess?: () => void }) => void;
  toggleStatus: (id: string, options?: { onSuccess?: () => void }) => void;
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
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading, refetch } = useListTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const sync = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
  }, [queryClient]);

  const addTask = useCallback(
    (task: { title: string; description?: string | null; dueDate?: string | null }, options?: { onSuccess?: () => void }) => {
      createTaskMutation.mutate(
        { data: task },
        {
          onSuccess: () => {
            sync();
            if (options?.onSuccess) {
              options.onSuccess();
            } else {
              notify("Success", "Task created successfully");
            }
          },
          onError: (error) => {
            notify("Error", error.message || "Failed to create task");
          },
        }
      );
    },
    [createTaskMutation, sync]
  );

  const updateTask = useCallback(
    (id: string, updates: { title?: string; description?: string | null; dueDate?: string | null; status?: "pending" | "completed" }, options?: { onSuccess?: () => void }) => {
      updateTaskMutation.mutate(
        { id, data: updates },
        {
          onSuccess: () => {
            sync();
            if (options?.onSuccess) {
              options.onSuccess();
            } else {
              notify("Success", "Changes saved");
            }
          },
          onError: (error) => {
            notify("Error", error.message || "Failed to update task");
          },
        }
      );
    },
    [updateTaskMutation, sync]
  );

  const deleteTask = useCallback(
    (id: string, options?: { onSuccess?: () => void }) => {
      deleteTaskMutation.mutate(
        { id },
        {
          onSuccess: () => {
            sync();
            if (options?.onSuccess) {
              options.onSuccess();
            } else {
              notify("Success", "Task deleted");
            }
          },
          onError: (error) => {
            notify("Error", error.message || "Failed to delete task");
          },
        }
      );
    },
    [deleteTaskMutation, sync]
  );

  const toggleStatus = useCallback(
    (id: string, options?: { onSuccess?: () => void }) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const newStatus = task.status === "pending" ? "completed" : "pending";
        updateTaskMutation.mutate(
          { id, data: { status: newStatus } },
          {
            onSuccess: () => {
              sync();
              if (options?.onSuccess) {
                options.onSuccess();
              } else {
                notify("Success", `Task marked as ${newStatus}`);
              }
            },
            onError: (error) => {
              notify("Error", error.message || "Failed to update status");
            },
          }
        );
      }
    },
    [tasks, updateTaskMutation, sync]
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
