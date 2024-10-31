import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import cathsRoute from "./routes/caths.js"
import productsRoute from "./routes/products.js"
import cookieParser from "cookie-parser"

const app=express()
dotenv.config()

const connect = async() =>{
    
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB")
    }catch(error){

        throw error;
    }
};

mongoose.connection.on("disconnected",()=>{
    console.log("Mongodb disconnected")
});

mongoose.connection.on("connected",()=>{
    console.log("Mongodb connected!")
});

app.get("/",(req,res)=>{
    res.send("Hello yawa ka")
})

//middlewares

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/caths",cathsRoute);
app.use("/api/products",productsRoute);

app.use((err,req,res,next)=>{
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Somthing went wrong"
  return res.status(errorStatus).json({
    success:false,
    status:errorStatus,
    message:errorMessage,
    stack:err.stack
  })
})

app.listen(7700,()=>{
    connect()
    console.log("Connected to backend")
});