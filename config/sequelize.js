/* Importation du module Sequelize. */
const { Sequelize } = require("sequelize");
/* Affectation de la valeur de la variable d'environnement à la variable config. */
require("dotenv").config();
const config = process.env;

/* Création d'une nouvelle connection de Sequelize. */
module.exports = new Sequelize(
  config.MYSQL_DB,
  config.MYSQL_USER,
  config.MYSQL_PASSWORD,
  {
    host: config.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  }
);
