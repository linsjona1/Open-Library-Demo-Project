import express from "express";
import  booksRouter from './Router/books'
import dotenv from "dotenv";
import { adminMiddleware } from "./Router/middleware";


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());



app.use("/books", booksRouter);

// Server Health
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// HomePage
app.get('/', (req, res)=>{
  res.status(200).send('<h1> Welcome </h1>')
})

// admin routh
app.use('/admin', adminMiddleware)
app.get('/admin', (req, res ) =>{
  res.status(200).json({Message: "Welcome Admin"})
})




app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


