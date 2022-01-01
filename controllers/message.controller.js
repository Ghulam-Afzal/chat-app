const messageRouter = require('express').Router() 
const db = require('../models')
const Messages = db.message

// returns all messages sent in a group
messageRouter.post("/getMessages", async (req, res) => {
    const groupId = req.body.groupId

    const messages = await Messages.findAll({
        include: [ { 
            model: db.user, 
            attributes: [ "id", "username" ] 
        },
        { 
            model: db.group, 
            attributes: [ "id", "name", "groupId"]
        }],
    })

    const groupMessages = messages.filter(groupMessage => groupId === groupMessage.dataValues.groupId)
    res.json(groupMessages)
})


module.exports = messageRouter; 