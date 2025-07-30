import { Router } from "express";
import { createNote, getNotes, deleteNote } from "../controllers/note.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
