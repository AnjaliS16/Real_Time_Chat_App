
const Sequelize = require('sequelize')
const sequelize = require('../util/database')


const Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "text"
    }
})

module.exports = Message;