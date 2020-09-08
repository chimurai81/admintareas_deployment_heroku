const Sequelize = require('sequelize'); //importamos sequelize luego de instalarlo 
//por medio de npm con el comando "npm i mysql2 sequelize"
require('dotenv').config({path: 'variables.env'}) //sirve para poder usar las variables glogables

const sequelize = new Sequelize(process.env.BD_NOMBRE /*nombre DB */, process.env.BD_USER /*User DB */, process.env.BD_PASS /*passs */, {
  host: process.env.DB_HOST, //host
  port: process.env.DB_PORT, //puerto
  dialect: 'mysql', //tipo de DB
  //reservado de sequelize
  define: {
      timestamps: false 
  },
//reservado de sequelize
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

module.exports = sequelize