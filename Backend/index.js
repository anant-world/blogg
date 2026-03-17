import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/db.js';
import userRoutes from './routes/user.route.js';
import blogRoutes from './routes/blog.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

dotenv.config()
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173", // allow Vite dev server
  credentials: true, // if you're using cookies/auth
}));
 // handle preflight

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/blog",blogRoutes)



app.listen (PORT, () => {
    connectDB();
    console.log(`Server is running on port http://localhost:${PORT}`);
})
