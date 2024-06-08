const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const user = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true

  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,


  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },



});

(async () => {
  try {
    await user.sync();
    console.log('user table created successfully.');
  } catch (error) {
    console.error('Error creating user table:', error);
  }
})();

module.exports = user;