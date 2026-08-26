import { Router } from "express";
import crypto from "crypto";
import { readFile, writeFile } from "../utils/helper";
import { Book } from "../types";


const router = Router();
const bookFilePath = 'src/data/books.json';
const userID = 'fake-userID'



// Adding a new book
router.post("/", async (req, res) => {
  try {
    const { title, author, genre, filePath } = req.body;

    if (!title || !author || !filePath) {
      return res.status(400).json({ message: "title, author, and filePath are required" });
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title,
      author,
      genre,
      filePath,
      userId: userID,
    };

    const books = await readFile(bookFilePath);

    console.log(books)
    books.push(newBook);
    
    await writeFile(bookFilePath, books);

    res.status(201).json(newBook);

  } catch (error) {
    res.status(500).json({ message: "Failed to add book" });
  }
});


// Getting all books
router.get("/", async (req, res) => {
  try {
    const books = await readFile(bookFilePath);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to load books" });
  }
});


//Getting a single book
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await readFile(bookFilePath);
    const theBook= books.find((b: Book) => b.id === id);  // How to find

    if (!theBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(theBook);
  } catch (error) {
    res.status(500).json({ message: "Failed to load book" });
  }
});


// To  edit or modify a book
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, filePath } = req.body;

    const books = await readFile(bookFilePath);
    const index = books.findIndex((b: Book) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[index] = {
      ...books[index],

    //   nullish coalescing operator
      title: title ?? books[index].title,
      author: author ?? books[index].author,
      genre: genre ?? books[index].genre,
      filePath: filePath ?? books[index].filePath,
    };

    await writeFile (bookFilePath, books);
    res.status(200).json(books[index]);
  } catch (error) {
    res.status(500).json({ message: "Failed to update book" });
  }
});


// Deleting a book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await readFile(bookFilePath);
    const bookExists = books.some((b: Book) => b.id === id);
    const deletedBook = books.find((b:Book)=> b.id === id);

    if (!bookExists) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBooks = books.filter((b: Book) => b.id !== id);
    await writeFile(bookFilePath, updatedBooks);
    res.status(200).json({ message: `${deletedBook.title} by ${deletedBook.author} has been deleted` });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete book" });
  }
});

export default router;