const messageFunction = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        message: {
            type: Sequelize.STRING, 
            allowNull: false
        }, 
    });

    return Message; 
}

module.exports = messageFunction; 