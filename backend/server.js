import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import path from "path"
import cors from "cors"
import { appendFile } from "fs"
const app = express()
const PORT = process.env.PORT||3000

app.use(express.json())
app.use(express.static(path.resolve('./dist')))

const whiteListOrigin = [process.env.PROD_URL, process.env.APP_BASE_URL, "htttp://localhost:3001"]

app.use(cors({origin:function(origin,next){
  if(!origin || whiteListOrigin.indexOf(origin)!== -1){
    next(null, true)
  }else{
    next(new Error("Not allowed by cors"))
  }
}}))

app.get(/.*/, function(req, res){
  res.sendFile(path.resolve("./dist/index.html"))
})



//********************* Connect to MongoDB ***********************//

// mongoose.connect(process.env.MONGO_CONNECTION)
// mongoose.connection.on("connected", () => {
//   console.log("Successfully connected to the mongo db")
// } )

//********************** listen to app ***********************//

// app.listen(PORT, () => {
//   console.table(listEndpoints(app))
//   console.log("The server is running in port", PORT)
// })

//--------------------------------------
// app.use((req, res, next)=> {
//   res.end("this is our app")
// })


// const whiteListOrigin = [process.env.PROD_URL, process.env.APP_BASE_URL, "htttp://localhost:3001"]

// app.use(cors({origin:function(origin,next){
//   if(!origin || whiteListOrigin.indexOf(origin)!== -1){
//     next(null, true)
//   }else{
//     next(new Error("Not allowed by cors"))
//   }
// }}))

// app.get("/api/task/:id",(req, res, next)=>{
//   const id = req.params.id
//   const tasks = [{
//     id,
//     title:"task - "+ id,
//     description:`task ${id} descriptions`
//   }
// ];
// res.status(200).json({tasks})
// })
// export default app
//--------------------------------------
