const groupModel = (sequelize, Sequelize) => {
    const Group = sequelize.define('group', {
        name: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        groupId: {
            type: Sequelize.UUID, 
            allowNull: false
        }, 
        numMembers: {
            type: Sequelize.INTEGER, 
        }, 
        owner: {
            type: Sequelize.STRING, 
            allowNull: false
        }
    })
    return Group
}

module.exports = groupModel;