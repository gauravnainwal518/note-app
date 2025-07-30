import { Request, Response } from "express";
import Note from "../models/note.model";

export const createNote = async (req: any, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ userId: req.user.id, title, content });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error });
  }
};

export const getNotes = async (req: any, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

export const deleteNote = async (req: any, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};
