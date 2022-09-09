const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "User",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      son: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      matricule: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: "matricule_UNIQUE",
      },
      role: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: "user",
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      actif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "matricule_UNIQUE",
          unique: true,
          using: "BTREE",
          fields: [{ name: "matricule" }],
        },
      ],
    }
  );
};
