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

// call the db connection object
const db = require("../env/db");
const {DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");
const STP = require("../models/tiers_payant_structure")(sequelize, DataTypes);
const pureJson = require("../utility/pureJson");

module.exports = {
    get: (req, res) => {
        STP.findAll()
            .then((result) => res.status(200).json(result))
            .catch((err) => res.status(500).json(err));
    },
    post: (req, res) => {
    },
    delete: (req, res) => {
    },
};
