const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors:{
    origin: '*'
  }
})

const db = require('./models')
const MESSAGE = db.message

db.sequelize.sync({force: true}).then(()=> {
  console.log('Drop and resync Table')
  initial()
})


// add a test message to test inser and reterival from the db
function initial() {
  MESSAGE.create({
    userId: "DJSFLK78sDFF8", 
    message: 'this is test message', 
    groupID: "JH6786SDFKJ"
  })
}


// server a basic webpage for now  
app.use('/', (req, res) => {
  res.json( {message: 'Welcome to the chat app.'})
})


app.use(cors({
  origin: '*'
}))

// wait for connection requests over the socket 
io.on('connection', (socket) => {
  console.log(`A new peer has connected on socket ${socket}`)

  socket.on('disconnect', (socket) => {
    console.log('A user has disconnected')
  })

  socket.on('message-send', (message) => {
    console.log(message)
  })

})

// define port number and have server listen on it
const PORT = 8080 || process.env.PORT
server.listen(PORT, () =>{
  console.log(`Server is Running on PORT ${PORT}`)
})

