import { Router } from "express";
import crypto from "crypto";
import { authenticate, AuthRequest } from "../middleware/auth";
import { readFile, writeFile } from "../utils/helper";
import { Book, ShelfEntry } from "../types";

const router = Router();
const bookFilePath = "src/data/books.json";
const shelfFilePath = "src/data/shelfEntries.json";

// Save a public book to your shelf
router.post("/:id/save", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const books = await readFile(bookFilePath);
    const book = books.find((b: Book) => b.id === id && b.isPublic === true);

    if (!book) {
      return res.status(404).json({ message: "Public book not found" });
    }

    const shelfEntries = await readFile(shelfFilePath);
    const alreadySaved = shelfEntries.some(
      (entry: ShelfEntry) => entry.userId === req.userId && entry.bookId === id
    );

    if (alreadySaved) {
      return res.status(409).json({ message: "Book already saved to your shelf" });
    }

    const newEntry: ShelfEntry = {
      id: crypto.randomUUID(),
      userId: req.userId as string,
      bookId: id as string,
    };

    shelfEntries.push(newEntry);
    await writeFile(shelfFilePath, shelfEntries);

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to save book" });
  }
});

// Remove a book from your shelf
router.delete("/:id/unsave", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const shelfEntries = await readFile(shelfFilePath);
    const entryExists = shelfEntries.some(
      (entry: ShelfEntry) => entry.userId === req.userId && entry.bookId === id
    );

    if (!entryExists) {
      return res.status(404).json({ message: "This book is not on your shelf" });
    }

    const updatedEntries = shelfEntries.filter(
      (entry: ShelfEntry) => !(entry.userId === req.userId && entry.bookId === id)
    );
    await writeFile(shelfFilePath, updatedEntries);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to remove book from shelf" });
  }
});

export default router;