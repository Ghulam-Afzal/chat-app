const messageRouter = require('express').Router() 
const db = require('../models')
const Messages = db.message

// returns all messages sent in a group
messageRouter.get("/getMessages/:id", async (req, res) => {
    const messages = await Messages.findAll({})

    res.json(messages)
})


module.exports = messageRouter; 