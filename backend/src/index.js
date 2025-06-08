import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./lib/socket.js"
import path from "path"


dotenv.config()
const port = process.env.PORT || 5001
const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
  
}))

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

   app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  })
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

server.listen(port, ()=> {
  console.log(`server is running on port: ${port} `)
  connectDB()
})