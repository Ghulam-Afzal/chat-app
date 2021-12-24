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

module.exports = db; 