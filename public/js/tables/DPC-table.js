let idRejctionDemande;
const URL = "http://localhost:3050";
// unable tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

//Generate doc icon
var docIcon = function (cell, formatterParams) {
  //plain text value'
  return (
    '<button type="button" class="btn btn-inverse-primary btn-icon">' +
    '<i class="mdi mdi mdi-file" style="margin-right: 0px;"></i>' +
    "</button>"
  );
};

var success = function (cell, formatterParams) {
  //plain text value
  return `
    <button type="button" class="btn btn-inverse-success btn-icon" 
    data-id="${cell.getRow().getData().dpc_id}" onclick="confirmation(this)">
    <i class="mdi mdi mdi-check" style="margin-right: 0px;"></i></button>
    <button type="button" class="btn btn-inverse-danger btn-icon"
    data-id="${cell.getRow().getData().dpc_id}" onclick="rejectionModel(this)"
     style="margin-left: 10px;">
    <i class="mdi mdi mdi-close" style="margin-right: 0px;"></i></button>
  `;
};

var dpcFile = (cell, formatterParams) => {
  console.log("chef :", cell.getRow().getData().agent_4_confirmation);
  if (cell.getRow().getData().agent_4_confirmation == 1) {
    return `<button type="button" class="btn btn-inverse-success btn-icon"
    data-id="${cell.getRow().getData().dpc_id}" onclick="createDPC(this)">
    <i class="mdi mdi mdi-file-check" style="margin-right: 0px;"></i></button>`;
  } else {
    return `<span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="You cant create untile role 4 confirmed">
    <button type="button" class="btn btn-inverse-danger btn-icon">
    <i class="mdi mdi mdi-file-check" style="margin-right: 0px;pointer-events: none;" type="button" disabled></i></button>
    </span>`;
  }
};
// initialize table
var table = new Tabulator("#DPC-table", {
  height: "500px",
  ajaxURL: URL + "/DPCtable", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  layout: "fitColumns",
  // progressiveLoad: "scroll",
  autoColumns: false, //create columns from data field names
  history: true,
  placeholder: "No Data Set",
  index: "id_dpc",
  // columnDefaults: {
  /* tooltip: function (e, cell, onRendered) {
      //e - mouseover event
      //cell - cell component
      //onRendered - onRendered callback registration function

      var el = document.createElement("div");
      el.style.backgroundColor = "red";
      el.innerText = cell.getColumn().getField() + " - " + cell.getValue(); //return cells "field - value";

      return el;
    },*/
  // },
  columns: [
    { title: "Id", field: "dpc_id", width: 48, sorter: "number" },
    {
      title: "Demandeur",
      field: "son",
      width: 116,
      sorter: "string",
      tooltip: function (e, cell, onRendered) {
        //e - mouseover event
        //cell - cell component
        //onRendered - onRendered callback registration function

        var el = document.createElement("div");
        el.style.backgroundColor = "darkgray";
        el.style.fontSize = "14px";
        el.innerHTML = `
        <div style="display: grid;grid-template-columns: max-content max-content;	margin: 10px;">
          <span>Nom : </span>
          <span>${cell.getRow().getData().nom} </span>
          <span>Prenom : </span>
          <span>${cell.getRow().getData().prenom} </span>
          <span>Role :  </span>
          <span>${cell.getRow().getData().role} </span>
          <span style="margin-right: 10px;">matricule : </span>
          <span>${cell.getRow().getData().matricule} </span>
          <span>Tele :  </span>
          <span>${cell.getRow().getData().tele || "-"} </span>
          <span>Email :  </span>
          <span>${cell.getRow().getData().email || "-"} </span>
        </div>
        `;
        return el;
      },
    },
    {
      title: "Structure",
      field: "employeur",
      width: 146,
      sorter: "string",
    },
    {
      title: "Act",
      field: "id_act",
      width: 146,
      sorter: "string",
    },
    {
      title: "Agent d'accueil",
      field: "agent_1_confirmation",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Responsable 1",
      field: "agent_2_confirmation",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Responsable 2",
      field: "agent_3_confirmation",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "Chef region",
      field: "agent_4_confirmation",
      hozAlign: "center",
      width: 77,
      formatter: "tickCross",
    },
    {
      title: "pièce jointe",
      formatter: docIcon,
      width: 118,
      hozAlign: "center",
      cellClick: function (e, cell) {
        window.open(
          "http://localhost:3031/dpcFiles/" +
            cell.getRow().getData().dpc_number,
          "_blank"
        );
      },
    },
    {
      formatter: success,
      title: "Action",
      width: 138,
      hozAlign: "center",
    },
    {
      formatter: dpcFile,
      title: "DPC",
      width: 138,
      hozAlign: "center",
    },
  ],
});

// var tableAll = new Tabulator("#DPC-table-all", {
//   height: "500px",
//   ajaxURL: "http://localhost:3050/DPCAlltable", //ajax URL
//   ajaxConfig: "GET", //ajax HTTP request type
//   layout: "fitColumns",
//   progressiveLoad: "scroll",
//   autoColumns: false, //create columns from data field names
//   history: true,
//   placeholder: "No Data Set",
//   index: "ID",
//   columns: [
//     { title: "Id", field: "ID", width: 48, sorter: "number" },
//     {
//       title: "Demandeur",
//       field: "MATRICULE_DEM",
//       width: 116,
//       sorter: "string",
//     },
//     {
//       title: "Lien de parente du Ben",
//       field: "LIEN_PARENTE_BEN",
//       width: 157,
//       sorter: "string",
//     },
//     {
//       title: "Structure",
//       field: "STRUCTURE",
//       width: 146,
//       sorter: "string",
//     },
//     {
//       title: "Act",
//       field: "ACT",
//       width: 146,
//       sorter: "string",
//     },
//     {
//       title: "pièce jointe",
//       formatter: docIcon,
//       width: 118,
//       hozAlign: "center",
//       cellClick: function (e, cell) {
//         window.open(
//           "https://localhost:3031/demande/" + cell.getRow().getData().NUM_DPC,
//           "_blank"
//         );
//       },
//     },
//     {
//       title: "Statut",
//       field: "STATU_DPC",
//       width: 145,
//       sorter: "string",
//     },
//   ],
// });

// /*
//   Création d'un tableau avec l'id `DPC-table-rejected` qui contiene les demande rejetées
//   d'apres le route 'https://localhost:3030/DPCAlltable
// */
// var tableRejected = new Tabulator("#DPC-table-rejected", {
//   height: "500px",
//   ajaxURL: "http://localhost:3050/DPCRejectedtable", //ajax URL
//   ajaxConfig: "GET", //ajax HTTP request type
//   layout: "fitColumns",
//   progressiveLoad: "scroll",
//   autoColumns: false, //create columns from data field names
//   history: true,
//   placeholder: "No Data Set",
//   index: "ID",
//   columns: [
//     { title: "Id", field: "results.dpc_id", width: 48, sorter: "number" },
//     {
//       title: "Demandeur",
//       field: "MATRICULE_DEM",
//       width: 116,
//       sorter: "string",
//     },
//     {
//       title: "Lien de parente du Ben",
//       field: "LIEN_PARENTE_BEN",
//       width: 157,
//       sorter: "string",
//     },
//     {
//       title: "Structure",
//       field: "STRUCTURE",
//       width: 146,
//       sorter: "string",
//     },
//     {
//       title: "Act",
//       field: "ACT",
//       width: 146,
//       sorter: "string",
//     },
//     {
//       title: "pièce jointe",
//       formatter: docIcon,
//       width: 118,
//       hozAlign: "center",
//       cellClick: function (e, cell) {
//         window.open(
//           "https://localhost:3031/demande/" + cell.getRow().getData().NUM_DPC,
//           "_blank"
//         );
//       },
//     },
//     {
//       title: "motif de rejet",
//       field: "REJECTION",
//       width: 300,
//       hozAlign: "center",
//       headerHozAlign: "center",
//       sorter: "string",
//     },
//   ],
// });

/**
 * It takes an element as an argument, gets the id of the element, sends it to the backend, and then
 * updates the table
 *
 * Args:
 *   ele: the element that was clicked
 */
function confirmation(ele) {
  var id = { id: ele.dataset.id };
  console.log("id: " + JSON.stringify(id));
  // console.log("input : ", input.value);
  if (confirm("êtes-vous sûr de vouloir accepte cette demande!")) {
    $.ajax({
      url: "/DPC/confirm", // Url of backend (can be python, php, etc..)
      type: "POST", // data type (can be get, post, put, delete)
      data: JSON.stringify(id),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
      success: function (response, textStatus, jqXHR) {
        console.log(response);
        table.setData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else return false;
}

/**
 * Elle montre un modal
 *
 * Args:
 *   ele: L'élément qui a déclenché l'événement.
 */
function rejectionModel(ele) {
  idRejctionDemande = ele.dataset.id;
  $("#model_rejet").modal("show");
}

/**
 * Il envoie une requête POST au backend avec l'id de la demande à rejeter
 *
 * Args:
 *   ele: L'élément qui a été cliqué.
 */
function rejection(ele) {
  const motifRejet = document.getElementById("motifRejet").value;
  const data = { id: idRejctionDemande, motifRejet: motifRejet };
  console.log(JSON.stringify(data));
  if (confirm("Voulez-vous vraiment rejeter cette demande ?")) {
    $.ajax({
      url: "/DPC/rejet", // Url of backend
      type: "POST", // data type (can be get, post, put, delete)
      data: JSON.stringify(data),
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      async: false, // enable or disable async
      success: function (response, textStatus, jqXHR) {
        console.log(response);
        $("#model_rejet").modal("hide");
        table.setData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else return false;
}

function createDPC(ele) {
  var id = ele.dataset.id;
  // $.ajax({
  //   url: "/createDPC/" + id,
  //   type: "GET",
  //   async: false,
  //   success: function (response, textStatus, jqXHR) {},
  //   error: function (jqXHR, textStatus, errorThrown) {
  //     console.log(jqXHR);
  //     console.log(textStatus);
  //     console.log(errorThrown);
  //   },
  // });
  window.open(URL + "/createDPC/" + id, "_blank");
}
