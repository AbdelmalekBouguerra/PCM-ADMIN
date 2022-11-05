/*
 * Author : Abdelmalek BOUGUERRA
 * Author Email : abdelmalekbouguerra2000@gmail.com
 * Created : Mar 2022
 * Updated : Nov 2022
 * description : All interaction with employeur table getter and setters From database, handling
 *               POST and GET methods called by the view "employeur.hbs".
 *
 * (c) Copyright by Abdelmalek BOUGUERRA.
 *
 */

const db = require("../env/db");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Act = require("../models/act")(sequelize, DataTypes);
const STP = require("../models/tiers_payant_structure")(sequelize, DataTypes);
STP.hasMany(Act, {
  foreignKey: "tiers_payant_structure_id",
});
Act.belongsTo(STP, {
  foreignKey: "tiers_payant_structure_id",
});

const pureJson = require("../utility/pureJson");

module.exports = {
  get: (req, res) => {
    Act.findAll({
      attributes: [
        "id",
        "code",
        "tiers_payant_structure_id",
        "designation",
        "montant_global",
      ],
      include: {
        model: STP,
        attributes: [["libelle", "structure"]],
      },
    })
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
  post: (req, res) => {},
  delete: (req, res) => {},
};
