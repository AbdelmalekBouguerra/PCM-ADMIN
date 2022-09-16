const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const db = require("../config/sequelize");
const { DataTypes } = require("sequelize");

// =========================== importing tables ==============================
const dpc = require("../models/dpc")(db, DataTypes);
const medecin_travail_act = require("../models/medecin_travail_act")(
  db,
  DataTypes
);
const medecins_conventionnes = require("../models/medecins_conventionnes")(
  db,
  DataTypes
);
const tiers_payant_structure = require("../models/tiers_payant_structure.js")(
  db,
  DataTypes
);
const cms_act = require("../models/cms_act")(db, DataTypes);
const act = require("../models/act")(db, DataTypes);
const User = require("../models/user")(db, DataTypes);
const Beneficiare = require("../models/beneficiare")(db, DataTypes);

// DPC [n]-->[1] User relation ----------------
User.hasMany(dpc, { foreignKey: "user_id" });
dpc.belongsTo(User, { foreignKey: "user_id" });
// --------------------------------------------

// User [n] --> [1] Beneficiare relation --------------
Beneficiare.hasMany(dpc, { foreignKey: "beneficiare_id" });
dpc.belongsTo(Beneficiare, { foreignKey: "beneficiare_id" });
// ----------------------------------------------------

// ===========================================================================

module.exports = async function (req, res, next) {
  try {
    const dpcId = req.params.id;
    // first of all we check if this dpc is confirmed by all admins
    const dpcResult = await dpc.findOne({
      where: { dpc_id: dpcId },
      include: [
        {
          model: User,
          required: true,
        },
        {
          model: Beneficiare,
        },
      ],
    });
    console.log("dpc :" + JSON.stringify(dpcResult));
    if (dpcResult === null) {
      res.status(404).send({ message: "Not Found" });
      return;
    }
    if (dpcResult.agent_4_confirmation === null) {
      res.status(401).send({ message: "Confirmation Required" });
      return;
    }

    // get the dpc type to get the right template
    let templateType = dpcResult.type_demande;
    templateType = templateType.replace(/\s+/g, "");

    // get act information
    let thisAct = null;
    let thisStr = null;
    let data = null;
    if (dpcResult.type_demande === "Tiers payant") {
      thisAct = await act.findOne({
        where: { id: dpcResult.id_act },
      });
      if (thisAct === null) {
        //todo change this condition cuz whene there is no ruselt it is empty {}
        res.status(404).send({ message: "Act Not Found" });
        return;
      }

      thisStr = await tiers_payant_structure.findOne({
        where: { code: thisAct.code.substring(5, 9) },
      });

      if (thisStr === null) {
        //todo change this condition cuz whene there is no ruselt it is empty {}
        res.status(404).send({ message: "Structure Not Found" });
        return;
      }
      const montant_sh = (parseFloat(thisAct.montant_global) * 80) / 100;
      const montant_adh = parseFloat(thisAct.montant_global) - montant_sh;
      data = {
        seq: `${dpcResult.dpc_number}/2022`, //todo this should be unique by document not by dpc
        dateCreation: new Date().toLocaleDateString(), // todo chage this with col that containe the date of dpc file creatin
        willayCreation: "Boumerdes", // todo add williay in admin table
        structureMedicale: thisStr.libelle,
        structureAddresse: thisStr.adresse,
        designation: thisAct.designation,
        adhStatu: dpcResult.user.role, //todo replace this with status in user table
        adhNom: dpcResult.user.nom,
        adhPrenom: dpcResult.user.prenom,
        adhFonction: "FONCTION", //todo add fonction to user table
        adhAffection: "AFFECTION", //todo ask what is affection ??
        adhMatricule: dpcResult.user.matricule,
        beneficiaire: dpcResult.beneficiaire
          ? dpcResult.beneficiaire.lien_parante
          : "lui meme",
        beneficiaireNom: dpcResult.beneficiaire
          ? dpcResult.beneficiaire.nom
          : "",
        beneficiairePrenom: dpcResult.beneficiaire
          ? dpcResult.beneficiaire.prenom
          : "",
        montant_sh,
        montant_adh,
      };
    } else if (dpcResult.type_demande === "Médecines de soins") {
      thisAct = await medecins_conventionnes.findOne({
        where: { id: dpcResult.id_act },
      });
    } else if (dpcResult.type_demande === "Prises en charge 100 %") {
      thisAct = await medecin_travail_act.findOne({
        where: { medecin_travail_structure_id: dpcResult.id_act },
      });
    } else if (dpcResult.type_demande === "Randevou CMS") {
      res
        .status(406)
        .send({ message: "Rendevou CMS dont have a DPC document" });
    }

    // fetch dpc data

    var templateHtml = fs.readFileSync(
      path.join(process.cwd(), `/template/template${templateType}.html`),
      "utf8"
    );
    var template = handlebars.compile(templateHtml);
    var html = template(data);

    // var pdfPath = path.join("pdf", `${data.name}.pdf`);

    // var options = {
    //    format: 'A4'
    //   width: "1230px",
    //   headerTemplate: "<p></p>",
    //   footerTemplate: "<p></p>",
    //   displayHeaderFooter: false,
    //   margin: {
    //     top: "10px",
    //     bottom: "30px",
    //   },
    //   printBackground: true,
    //   path: pdfPath,
    // };
    var options = {
      format: "A4",
    };

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    var page = await browser.newPage();

    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
      waitUntil: "networkidle0",
    });

    const result = await page.pdf(options);

    await browser.close();

    var filename = `${data.adhNom}-${data.adhPrenom}-${data.seq}.pdf`;
    filename = encodeURIComponent(filename);
    res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    res.setHeader("Content-type", "application/pdf", "charset=ISO-8859-1");
    res.end(result);
  } catch (e) {
    console.log("Failed : " + e);
  }
};
