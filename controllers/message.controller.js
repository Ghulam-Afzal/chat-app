const messageRouter = require('express').Router() 
const db = require('../models')
const Messages = db.message
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')
const getTokenFrom = require("../middleware/auth.middleware")

// returns all messages sent in a group
messageRouter.post("/getMessages", async (req, res) => {
    const groupId = req.body.groupId

    const token = getTokenFrom.getTokenFrom(req);
    const decodedToken = jwt.verify(token, authConfig.SECRET);

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token is missing or is invalid" });
    }

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

    const token = getTokenFrom.getTokenFrom(req);
    const decodedToken = jwt.verify(token, authConfig.SECRET);

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token is missing or is invalid" });
    }

    const newMsg = Messages.build({
        message: message, 
        groupId: groupId,
        userId: author
  
      })
      await newMsg.save()
      
      const _newMsg = await Messages.findOne({
          where: {
            id : newMsg.id
          },
          include: [{ 
              model: db.user, 
              attributes: [ "id", "username" ] 
            },
            { 
                model: db.group, 
                attributes: [ "id", "name", "groupId"]
            }]
      })
      res.json(_newMsg)
})


module.exports = messageRouter; 