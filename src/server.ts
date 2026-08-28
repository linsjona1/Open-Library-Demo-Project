import express from "express";
import  booksRouter from './Router/books'
import dotenv from "dotenv";
import { adminMiddleware } from "./Router/middleware";


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());



app.use("/books", booksRouter);

// Sserver Health
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// admin routh
app.use('/admin', adminMiddleware)
app.get('/admin', (req, res ) =>{
  res.status(200).json({Message: "Welcome Admin"})
})




app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


