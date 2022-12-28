import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import path from "path"
import cors from "cors"
const server = express()
const PORT = process.env.PORT||3000

server.use(express.json())
server.use(express.static(path.resolve('./dist')))


const whiteListOrigin = [process.env.PROD_URL, process.env.VUE_APP_BASE_URL, "htttp://localhost:3001"]

server.use(cors({origin:function(origin,next){
  if(!origin || whiteListOrigin.indexOf(origin)!== -1){
    next(null, true)
  }else{
    next(new Error("Not allowed by cors"))
  }
}}))

server.get(/.*/, function(req, res){
  res.sendFile(path.resolve("./dist/index.html"))
})

//********************* Connect to MongoDB ***********************//

mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to the mongo db")
} )

//********************** listen to server ***********************//

server.listen(PORT, () => {
  console.table(listEndpoints(server))
  console.log("The server is running in port", PORT)
})
