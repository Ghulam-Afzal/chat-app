const userModel = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        username: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        passwordHash: {
            type: Sequelize.STRING, 
            allowNull: false
        },
    })

    return User 
}

module.exports = userModel;