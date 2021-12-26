const messageRouter = require('express').Router() 
const db = require('../models')
const Messages = db.message

// returns all messages sent in a group
messageRouter.get("/getMessages", async (req, res) => {
    const groupId = req.body.groupId

    const messages = await Messages.findAll({
        where: {
            groupId: groupId
        }, 
        include: [ { 
            model: db.user, 
            attributes: [ "id", "username" ] 
        },
        { 
            model: db.group, 
            attributes: [ "id", "name", "groupId"]
        } ]
    })

    res.json(messages)
})


module.exports = messageRouter; 