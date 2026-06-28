import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

const app = express();
await connectDB();

const PORT = process.env.PORT;

//Middlewares
app.use(cors());
app.use(express.json());

//Routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
