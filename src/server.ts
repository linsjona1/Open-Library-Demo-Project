import express from "express";
// import productRouter from  "./Routes/productRoutes"
import dotenv from "dotenv";


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());



// app.use("/products", productRouter)

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});



app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

