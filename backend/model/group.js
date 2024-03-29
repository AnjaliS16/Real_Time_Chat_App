

const Sequelize = require('sequelize')
const sequelize = require('../util/database.js')


const Group = sequelize.define('group', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Group;