const groupRouter = require('express').Router() 
const { v4: uuidv4 } = require('uuid');
const db = require('../models')
const GROUP = db.group

// routes for creating, joining, leaving and deleting a group

// get req to retrieve the channels that the user is apart of 
groupRouter.get("/getGroups", async (req, res) => {
    /*
        this function should only return the groups that the user is apart of
        but as there is no way to tell which one the user belongs to as of yet
        all the channels that are available will be returned
    */  

    // get info needed from req.body 
    const user = req.body.user

    const groups = await GROUP.findAll({})

    res.json(groups)
})


// post route forcreating the group and assinging a owner 
groupRouter.post("/createGroup", async (req, res) => {
    // info for creating the group such as owner and group name should be in the req.body
    const owner = req.body.owner
    const groupName = req.body.groupName
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
    const createdGpoup = await GROUP.build({
        name: groupName, 
        groupId: groupID, 
        numMembers: 1, 
        owner: owner
    })
    await createdGpoup.save()

    res.json(createdGpoup)

})

// user join 
groupRouter.put("/joinGroup", async (req, res) => {
    // get user and group id from req.body 
    const user = req.body.user
    const Id = req.body.id

    // add user to and increase count of members that are in the group
    const group = await GROUP.findOne({
        where: {
            groupId: Id
        }
    })

    if (!group) {
        return res.status(404).json({ error: "That server does not exist "})
    }

    await group.increment('numMembers')
    await group.reload()

    res.json(group)
})

// user leave
groupRouter.put("/leaveGroup", async (req, res) => {
    // get user and group idfrom req.body 
    const user = req.body.user
    const Id = req.body.id

    // remove user from and reduce count of members that are in the group
    const group = await GROUP.findOne({
        where: {
            groupId: Id
        }
    })

    if (!group) {
        return res.status(404).json({ error: "That server does not exist "})
    }

    await group.decrement('numMembers')
    await group.reload()

    res.json(group)
})

// deletion of a group 
groupRouter.delete("/deleteGroup", async (req, res) => {
    const ownerOfGroup = req.body.owner
    const groupid = req.body.groupId
    
    const group = await GROUP.findOne({
        where: {
            groupId: groupid
        }
    }) 

    if (group.owner !== ownerOfGroup){
        res.status(401).json({ error: "You do not own the group."}).end()
    }else {
        await GROUP.destroy({
            where: {
                groupId: groupid
            }
        })
    
        res.json({ sucess: "the group was destroyed"})
    }
})

module.exports = groupRouter