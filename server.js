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

const db = require('./models')
const messageRouter = require('./controllers/message.controller')
const groupRouter = require('./controllers/group.controller')
const MESSAGE = db.message

db.sequelize.sync({force: true}).then(()=> {
  console.log('Drop and resync Table')
})



// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*'
}))


app.use("/api/messages", messageRouter)
app.use("/api/groups", groupRouter)

// server a basic webpage for now  
app.use('/', (req, res) => {
  res.json( {message: 'Welcome to the chat app.'})
})

// wait for connection requests over the socket 
io.on('connection', (socket) => {
  console.log(`A new peer has connected on socket ${socket}`)

  socket.on('disconnect', (socket) => {
    console.log('A user has disconnected')
  })

  socket.on('message-send', (message) => {
    console.log(message)
    MESSAGE.create({
      user: message.author, 
      message: message.msg, 
      groupID: message.groupId
    })
  })

})

// define port number and have server listen on it
const PORT = 8080 || process.env.PORT
server.listen(PORT, () =>{
  console.log(`Server is Running on PORT ${PORT}`)
})

