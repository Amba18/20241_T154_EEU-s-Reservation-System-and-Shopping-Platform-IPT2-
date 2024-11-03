import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import cathsRoute from "./routes/caths.js"
import productsRoute from "./routes/products.js"
import cookieParser from "cookie-parser"
import User from "./models/User.js"
import cors from "cors"

const app=express()
dotenv.config()
const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow credentials to be included
  };

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
    res.send("Hello boi")
})

//middlewares
app.use(cors(corsOptions));
app.use(cookieParser())
app.post("/signup",(req,res)=>{
    User.create(req.body)
    .then(User =>res.json(User))
    .catch(err =>res.json(err))

})
app.use(express.json())
app.use("/login",(req,res)=>{
    const{username,password}=req.body;
    User.findOne({username:username})
    .then(user=>{
        if(user){
            if(user.password===password){
                res.json("login success")
            }else{
                user.json("Password is incorrect")
            }
        }else{
            res.json("user does not exist")
        }
    })
})
app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/caths",cathsRoute);
app.use("/api/products",productsRoute);

app.use((err,req,res,next)=>{
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong"
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