const groupRouter = require('express').Router() 
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')
const getTokenFrom = require("../middleware/auth.middleware")
const db = require('../models')
const GROUP = db.group
const USER = db.user

// routes for creating, joining, leaving and deleting a group

// get req to retrieve the channels that the user is apart of 
groupRouter.post("/getGroups", async (req, res) => {

    // obtain groups 
    const groups = await GROUP.findAll({
        include : [
            {
                model: db.user, 
                attributes: [ "id", "username" ]
            }
        ]
    })
    res.json(groups)
})


// post route forcreating the group and assinging a owner 
groupRouter.post("/createGroup", async (req, res) => {

    // info for creating the group such as owner and group name should be in the req.body
    const owner = req.body.owner
    const groupName = req.body.groupName
    const userId = req.body.userId

    const token = getTokenFrom.getTokenFrom(req);
    const decodedToken = jwt.verify(token, authConfig.SECRET);

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token is missing or is invalid" });
    }

    let groupID = uuidv4()

    // check if a group with this id already exists 
    const checkIfIDExists = await GROUP.findOne({
        where: {
            groupId: groupID
        }
    })
    // if it does than make a new id 
    if (checkIfIDExists){
        groupID = uuidv4()
    }

    // create the group 
    const createdGroup = await GROUP.build({
        name: groupName, 
        groupId: groupID, 
        numMembers: 1, 
        owner: owner
    })

    await createdGroup.save()
    await createdGroup.addUser(userId)

    const usr = await USER.findOne({
        where: {
            username: owner
        }
    })

    await usr.addGroup(createdGroup.id)

    res.json(createdGroup)

})

// user join 
groupRouter.put("/joinGroup", async (req, res) => {

    // get user and group id from req.body 
    const userId = req.body.userId
    const Id = req.body.id

    const token = getTokenFrom.getTokenFrom(req);
    const decodedToken = jwt.verify(token, authConfig.SECRET);

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token is missing or is invalid" });
    }

    // add user to and increase count of members that are in the group
    const group = await GROUP.findOne({
        where: {
            groupId: Id
        }
    })

    // if group does not exist return error 
    if (!group) {
        return res.status(404).json({ error: "That server does not exist "})
    }

    /* 
        check if the member is in the group already 
        if they are return error else add them to 
        the group   
    */
    const isUserAlreadyInGroup = await group.hasUser(userId)

    if (isUserAlreadyInGroup) {
        return res.status(400).json({ error: "User is already in this Group."})
    }

    await group.increment('numMembers')
    await group.addUser(userId)

    const usr = await USER.findOne({
        where: {
            id: userId
        }
    })

    await usr.addGroup(group.id)
    await group.reload()

    res.json(group)
})

// user leave
groupRouter.put("/leaveGroup", async (req, res) => {

    // get user and group idfrom req.body 
    const userId = req.body.userId
    const Id = req.body.id

    const token = getTokenFrom.getTokenFrom(req);
    const decodedToken = jwt.verify(token, authConfig.SECRET);

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token is missing or is invalid" });
    }

    // remove user from and reduce count of members that are in the group
    const group = await GROUP.findOne({
        where: {
            groupId: Id
        }
    })

    // if group does not exist return error 
    if (!group) {
        return res.status(404).json({ error: "That server does not exist" })
    }

    /* 
        check if the member is not in the group already 
        if they aren't return error else remove them to 
        the group   
    */
    const isUserAlreadyInGroup = await group.hasUser(userId)

    if (!isUserAlreadyInGroup) {
        return res.status(400).json({ error: "User is not in this Group."})
    }

    await group.decrement('numMembers')
    await group.removeUser(userId)

    const usr = await USER.findOne({
        where: {
            id: userId
        }
    })

    await usr.removeGroup(group.id)
    await group.reload()

    res.json(group)
})

// deletion of a group 
groupRouter.delete("/deleteGroup", async (req, res) => {
    const ownerOfGroup = req.body.owner
    const groupid = req.body.groupId
    

    const token = getTokenFrom.getTokenFrom(req);
    const decodedToken = jwt.verify(token, authConfig.SECRET);

    if (!token || !decodedToken.id) {
        return res.status(401).json({ error: "token is missing or is invalid" });
    }
    
    const group = await GROUP.findOne({
        where: {
            groupId: groupid
        }
    }) 

    if (!group) {
        return res.status(404).json({ error: "Group does not exist." })
    }
    const temp = await group.getUsers({
        attributes: ["id", "username"]
    })

    if (group.owner !== ownerOfGroup){
        return res.status(401).json({ error: "You do not own the group." }).end()
    }

    // loop through all the users in the group and remove them 
    for (let i = 0; i < temp.length; i++){
        await group.removeUser(i.id)
    }

    await GROUP.destroy({
        where: {
            groupId: groupid
        }
    })

    res.status(204).json({ success: "the group was destroyed" })
})

module.exports = groupRouter