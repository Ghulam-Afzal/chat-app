const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)


// basic route 
app.use("/", (req, res) =>{
  res.send("PAGE")
})

// define port number and have server listen on it
const PORT = 8080 || process.env.PORT
server.listen(PORT, () =>{
  console.log(`Server is Running on PORT ${PORT}`)
})

// wait for connection requests over the socket 
io.on('connection', (socket) => {
  console.log("A new peer has connected")
})
