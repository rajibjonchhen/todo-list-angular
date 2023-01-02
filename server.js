import express  from 'express'
import serveStatic  from 'serve-static'
import path,{dirname}  from 'path'
const port = process.env.PORT || 8080;

const server = express();

server.use(express.static(path.resolve(dirname('/dist'))))
server.get(/.*/, function(req, res){
  res.sendFile(path.resolve(dirname("/dist/index.html")))
})

server.listen(port);

console.log(`server is running on port - ${port}`)

// import http from 'http'
// import app from "./backend/server.js"


// const PORT = process.env.PORT || 3000
// const server = http.createServer(app)


// server.listen(PORT)
