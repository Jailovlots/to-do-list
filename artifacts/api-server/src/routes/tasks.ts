import { Router } from "express";
import { db, tasks } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";


const router = Router();

// List all tasks
router.get("/", async (req, res) => {
  try {
    const allTasks = await db.select().from(tasks).orderBy(tasks.createdAt);
    return res.json(allTasks);
  } catch (error) {
    logger.error({ error }, "Failed to fetch tasks");
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning();

    return res.status(201).json({ ...newTask, message: "done" });
  } catch (error) {
    logger.error({ error }, "Failed to create task");
    return res.status(500).json({ error: "Failed to create task" });
  }
});

// Update a task
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const [updatedTask] = await db
      .update(tasks)
      .set({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({ ...updatedTask, message: "done" });
  } catch (error) {
    logger.error({ error }, "Failed to update task");
    return res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();

    if (result.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.json({ message: "done" });
  } catch (error) {
    logger.error({ error }, "Failed to delete task");
    return res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
