import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import  authRoutes  from "./routes/authRoutes.js";
import studentRoutes from "./routes/authStudent.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/students',studentRoutes);

app.get('/',(req,res)=>{
    res.json({message:'Student Mangement System API Running!'})
});

// // 404 handler for all other routes
// app.all('*',(req,res)=>{
//     res.status(404).json({message:'Route Not Found'})
// });

app.use((error,req,res,next)=>{
    console.error(error.stack);
    return res.status(500).json({
                success:false,
                message:"Something Went Wrong!"
            });
});

app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`);
});
