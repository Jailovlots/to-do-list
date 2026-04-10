import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  status: TaskStatus;
  createdAt: string;
}

interface TaskContextValue {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  getTask: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const STORAGE_KEY = "@todo_tasks_v1";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch {
          setTasks([]);
        }
      }
    });
  }, []);

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "status">) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      persist([newTask, ...tasks]);
    },
    [tasks, persist]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      persist(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    },
    [tasks, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist(tasks.filter((t) => t.id !== id));
    },
    [tasks, persist]
  );

  const toggleStatus = useCallback(
    (id: string) => {
      persist(
        tasks.map((t) =>
          t.id === id
            ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
            : t
        )
      );
    },
    [tasks, persist]
  );

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  );

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, toggleStatus, getTask }}
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
