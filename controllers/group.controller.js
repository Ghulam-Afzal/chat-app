const groupRouter = require('express').Router() 
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../models');
const db = require('../models')
const GROUP = db.group

// routes for creating, joining, leaving and deleting a group

// get req to retrieve the channels that the user is apart of 
groupRouter.get("/getChannels", async (req, res) => {
    /*
        this function should only return the groups that the user is aport of 
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

    const createdGpoup = await GROUP.build({
        name: groupName, 
        groupId: uuidv4(), 
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
    await group.decrement('numMembers')
    await group.reload()

    res.json(group)
})

// deletion of a group 


module.exports = groupRouter