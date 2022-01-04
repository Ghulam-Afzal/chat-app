const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors:{
    origin: '*'
  }
})


const middleware = require("./middleware/middleware");
const db = require('./models')
const messageRouter = require('./controllers/message.controller')
const groupRouter = require('./controllers/group.controller')
const userRouter = require("./controllers/auth.contoller")

db.sequelize.sync().then(()=> {
  console.log('Drop and resync Table')
})

app.use(cors({
  origin: '*'
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware.requestLogger);

app.use("/api/messages", messageRouter)
app.use("/api/groups", groupRouter)
app.use("/api/auth", userRouter)
app.use('/', (req, res) => {
  res.json( {message: 'Welcome to the chat app.'})
})

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// wait for connection requests over the socket 
io.on('connection', (socket) => {
  console.log(`A new peer has connected on socket ${socket}`)

  socket.on("join-room", (room) => {
    socket.join(room)
    console.log(socket.rooms)
  })

  socket.on("leave-room", (room) => {
    socket.leave(room)
    console.log(socket.rooms)
  })

  socket.on('disconnect', (socket) => {
    console.log('A user has disconnected')
  })

  socket.on('message-send', (message) => {
    console.log(`this is socket emit ${message}`)
    socket.broadcast.emit("s-message", message)
  })

})

// define port number and have server listen on it
const PORT = 8080 || process.env.PORT
server.listen(PORT, () =>{
  console.log(`Server is Running on PORT ${PORT}`)
})

