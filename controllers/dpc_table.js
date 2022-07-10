// call the db connection object
const db = require("../env/db");

function getDPC(ID, callback) {
  console.log("ID :", ID);
  db.query(
    "SELECT ID,NUM_DPC,(SELECT MATRICULE FROM `DEMANDEUR` AS D WHERE ID_DEMANDEUR = D.ID)" +
      "as MATRICULE_DEM,IF( ISNULL(ID_BENEFICIAIRE),'Lui-même',(SELECT LIEN_PARENTE FROM `BÉNÉFICIAIRE`" +
      "AS B WHERE ID_BENEFICIAIRE = B.ID)) as LIEN_PARENTE_BEN,STRUCTURE,ACT,STATU_DPC," +
      "IF(ID_AGENT1 = ?,'true','false') as VALIDATION FROM `DPC` WHERE ID_AGENT1 = ? " +
      "OR ISNULL(ID_AGENT1)"+
      "ORDER BY ID",
    [ID,ID],
    (err, results) => {
      if (err) console.log(err);
      else callback(results);
    }
  );
}

module.exports = {
  get: (req, res) => {
    getDPC(req.session.adminUser.ID, (results) => {
      res.json({ last_page: 1, data: results });
    });
  },
};
