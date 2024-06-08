import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
connectDb();
const PORT = process.env.PORT || 5000;

app.use(express.json()); //  JSON payloads
app.use(express.urlencoded({ extended: true })); //  form data payloads
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});