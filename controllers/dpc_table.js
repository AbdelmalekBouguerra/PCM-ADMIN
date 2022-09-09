const db = require("../config/sequelize");

exports.get = async (req, res, next) => {
  db.query(
    `SELECT * 
    FROM dpc 
    INNER JOIN user 
    ON dpc.user_id = user.user_id`
  )
    .then((results) => {
      const data = results[0].map((result) => {});
      res.status(200).json({ message: "SUCCESSFUL", data });
    })
    .catch((err) => res.status(500).json({ message: "ERROR", err }));
};
