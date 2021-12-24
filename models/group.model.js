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
        /*  potentially need to have a way to store all the 
            users who are in this group to manage them leaving 
            and joining
        */ 
    })
    return Group
}

module.exports = groupModel;