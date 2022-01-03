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
        // limit: 10, 
        order: [["createdAt", "ASC"]]
    })

    const groupMessages = messages.filter(groupMessage => groupId === groupMessage.dataValues.groupId)
    res.json(groupMessages)
})

messageRouter.post("/newMessage", async (req, res) => {
    const author = req.body.authorId
    const message = req.body.message
    const groupId = req.body.groupId

    const msg = Messages.build({
        message: message, 
        groupId: groupId,
        userId: author
  
      })
      await msg.save()
      res.json(msg)
})


module.exports = messageRouter; 