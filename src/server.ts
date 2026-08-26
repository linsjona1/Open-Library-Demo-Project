import express from "express";
import  booksRouter from './Router/books'
import dotenv from "dotenv";


dotenv.config({ path: "./src/.env" });
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());



app.use("/books", booksRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});





app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


