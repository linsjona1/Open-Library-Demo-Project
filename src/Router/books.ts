import { Router } from "express";
import crypto from "crypto";
import { readFile, writeFile } from "../utils/helper";
import { Book } from "../types";
import { createBookSchema } from "../schemas/bookSchema";
import { updateBookSchema } from "../schemas/bookSchema";


const router = Router();
const bookFilePath = 'src/data/books.json';
const userID = 'fake-userID'



// Adding a new book
router.post("/", async (req, res) => {
  try {

     const result = createBookSchema.safeParse(req.body);
     if (!result.success) {
      return res.status(400).json({ message: "Invalid book data", errors: result.error.issues });
     }
    const { title, author, genre, filePath } = result.data;

    // if (!title || !author || !filePath) {
    //   return res.status(400).json({ message: "title, author, and filePath are required" });
    // }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title,
      author,
      genre,
      filePath,
      userId: userID,
    };

    const books = await readFile(bookFilePath);

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
    // console.log(theBook);
        
    
    
    

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
    const result = updateBookSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid book data", errors: result.error.issues });
    }
    const { title, author, genre, filePath} = result.data;
    // const bookId = req.body.id;

    const books = await readFile(bookFilePath);
    const index = books.findIndex((b: Book) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    books[index] = {
      ...books[index],

    //   nullish coalescing operator

      title: title ?? books[index].title,
      id: id ?? books[index].id,
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
    //  if (id.length === 0){
    //   return res.status(400).json({message : "please input a valid id"})
    // }
    

    const updatedBooks = books.filter((b: Book) => b.id !== id);
    await writeFile(bookFilePath, updatedBooks);
    res.status(200).json({ message: `${deletedBook.title} by ${deletedBook.author} has been deleted` });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete book" });
  }
});

export default router;