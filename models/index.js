const config = require('../config/db.config.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    config.DB, 
    config.USER, 
    config.PASSWORD,
    {
        host: config.HOST, 
        dialect: config.dialect, 
        operatorAliases: false,

        pool: {
            max: config.pool.max, 
            min: config.pool.min, 
            acquire: config.pool.acquire, 
            idle: config.pool.idle
        }
    }
)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize); 
db.group = require("../models/group.model")(sequelize, Sequelize); 

// associations

// 1:M
db.message.belongsTo(db.group, {
    foreignKey: {
        name: "groupId", 
        feild: "group_id"
    }
})

db.message.belongsTo(db.user, {
    foreignKey: {
        name:"userId", 
        feild: "user_id"
    }
})

// N:M 
db.group.belongsToMany(db.user, {
    through: "group_member", 
    foreignKey: {
        name: "groupId", 
        feild: "group_id"
    }
})

db.user.belongsToMany(db.group, {
    through: "channel_member", 
    foreignKey: {
        name: "userId", 
        feild: "user_id"
    }
})

module.exports = db; 