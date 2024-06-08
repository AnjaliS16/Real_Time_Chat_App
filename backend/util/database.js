const Sequelize = require('sequelize');
require('dotenv').config();
const mysql2 = require('mysql2');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql', 
    host: process.env.DB_HOST,
    dialectModule: mysql2
});

module.exports = sequelize;