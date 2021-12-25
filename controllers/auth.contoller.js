const userRouter = require('express').Router() 
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')

db = require("../models")
const USER = db.user

// api endpoints to signup and signin for users 
userRouter.post("/signup", async (req, res) => {
    const body = req.body 

    const user = await USER.findOne({
        where: {
            username: body.username
        }
    })
    if (user) {
        return res.status(400).json({ error: "The username is already in use."}) 
    }

    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(body.password, saltRounds)

    const newUser = await USER.build({
        username: req.body.username, 
        passwordHash: passwordHash
    })

    await newUser.save()
    const _newUser = {
        username: newUser.dataValues.username, 
        userId: newUser.dataValues.id, 
        createdAt: newUser.dataValues.createdAt
    }
    res.json(_newUser)
})

userRouter.post("/signin", async (req, res) => {
    const body = req.body 
    
    const user = await USER.findOne({
        where: {
            username: body.username
        }
    })

    if (!user){
        return res.status(404).json({ error: "User does not exist."})
    }

    const isPassWordCorrect = false ? false : await bcryptjs.compare(body.password, user.passwordHash)
    
    if (!isPassWordCorrect){
        return res.status(401).json({ error: "The password was incorrect"})
    }

    const userToTokenize = {
        username: user.username, 
        id: user.id
    }
    
    const tokenizeUser = jwt.sign(userToTokenize, authConfig.SECRET, {expiresIn: 60 * 60})
    
    res.status(200).send({tokenizeUser, username:user.username, id: user.id})
})


module.exports = userRouter