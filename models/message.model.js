const messageFunction = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        userId: {
            type: Sequelize.STRING, 
            allowNull: false
        }, 
        message: {
            type: Sequelize.STRING, 
            allowNull: false
        }, 
        groupID: {
            type: Sequelize.STRING, 
            allowNull: false
        }
    });

    return Message; 
}

module.exports = messageFunction; 