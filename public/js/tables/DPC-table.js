//Generate doc icon
var docIcon = function (cell, formatterParams) {
  //plain text value
  return "<i class='mdi mdi-file-multiple'></i>";
};

// initialize table
var table = new Tabulator("#DPC-table", {
  height: "500px",
  ajaxURL: "https://localhost:3030/DPCtable", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  ajaxError: function (error) {
    //error - fetch response object
    console.log(error);
  },
  layout: "fitColumns",
  progressiveLoad: "scroll",
  autoColumns: false, //create columns from data field names
  history: true,
  placeholder: "No Data Set",
  index: "ID",
  columns: [
    { title: "Id", field: "ID", width: 48, sorter: "number" },
    {
      title: "Demandeur",
      field: "MATRICULE_DEM",
      width: 116,
      sorter: "string",
      cellPopup:"Hey, Im a Popup!"
    },
    {
      title: "Lien de parente du Ben",
      field: "LIEN_PARENTE_BEN",
      width: 157,
      sorter: "string",
    },
    {
      title: "Structure",
      field: "STRUCTURE",
      width: 146,
      sorter: "string",
    },
    {
      title: "Act",
      field: "ACT",
      width: 146,
      sorter: "string",
    },
    {
      title: "VALIDATION",
      field: "VALIDATION",
      hozAlign: "center",
      width: 120,
      editor: true,
      formatter: "tickCross",
    },
    {
      formatter: docIcon,
      field: "document",

      width: 40,
      hozAlign: "center",
      cellClick: function (e, cell) {
        alert("Printing row data for: " + cell.getRow().getData().ID);
      },
    },
  ],
});

table.on("cellEdited", function (cell) {
  console.log(table.getRow(15).getData());
});
