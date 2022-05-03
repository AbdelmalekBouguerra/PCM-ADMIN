function showBtn() {
  var ele = document.getElementById("btn");

  ele.innerHTML =
    '<form method="post" action = "/sh" onsubmit="if(!confirm(\'êtes-vous sûr de vouloir ajouter ces lignes!\')) { ' +
    "return false;" +
    '}"> ' +
    '<input type="hidden" name="id_empTable" id="hiddenInput" />' +
    '<button type="submit" class="btn btn-inverse-primary btn-fw m-2">Enregistrer</button> ' +
    '<button type="button" onClick="window.location.reload();" class="btn btn-inverse-danger btn-fw m-2">Cancel</button>' +
    "</form>";
  var input = document.getElementById("hiddenInput");
  input.value = JSON.stringify(id_empTable);
  console.log("json", id_empTable);
  console.log("input : ", input.value);
}
function showDeleteBtn() {}
var id_empTable = [];
var selectedData = [];
var json_emp = {};
// FIX : test if is it changed or not to save the new value.

//initialize table
var table = new Tabulator("#example-table", {
  height:"500px",
  ajaxURL: "https://localhost:3030/sh", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  ajaxError: function (error) {
    //error - fetch response object
  },
  layout: "fitColumns",
  progressiveLoad:"scroll",
  // data: data, //assign data to table
  autoColumns: false, //create columns from data field names
  history: true,
  placeholder: "No Data Set",
  columns: [
    {
      formatter: "rowSelection",
      width: 10,
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      cellClick: function (e, cell) {
        cell.getRow().toggleSelect();
      },
    },
    { title: "Id", field: "ID", width: 70, sorter: "number" },
    {
      title: "Code Mnémonique",
      field: "CODE",
      width: 197,
      editor: "input",
      sorter: "string",
    },
    {
      title: "Structures",
      field: "STRUCTURE",
      editor: "input",
      sorter: "string",
    },
  ],
});
table.on("cellEdited", function (cell) {
  json_emp["ID"] = cell.getRow().getData().ID;
  json_emp["col"] = cell.getField();
  json_emp["value"] = cell.getValue();

  id_empTable.push(json_emp);
  json_emp = {};

  showBtn();
});
table.on("rowSelected", function (row) {
  //row - row component for the selected row
  selectedData = table.getSelectedData();
  var selectedRowsForDel = document.getElementById("selectedRowsForDel");
  selectedRowsForDel.value = JSON.stringify(selectedData);
  //get array of currently selected data.
  console.log(selectedData);
});

document.getElementById("add-row").addEventListener("click", function () {
  lastID = lastID + 1;
  table.addRow({ ID: lastID });
  table.redraw();
});

document.getElementById("del-row").addEventListener("click", function () {
  //   if (confirm("êtes-vous sûr de vouloir supprimer ces lignes!")) {
  //     //! FIX : here it first execute the POST method from /sh link (Add rows)
  //     //! then it go for the deleting the rows
  //     var xhr = new XMLHttpRequest();
  //     xhr.open("POST", "/deleteSH", true);
  //     xhr.setRequestHeader('Content-Type', 'application/json');
  //     xhr.send(JSON.stringify({
  //     value: selectedData
  // }));
  // window.location.reload();
  //   }
});

//Define variables for input elements
var fieldEl = document.getElementById("filter-field");
var typeEl = "like";
var valueEl = document.getElementById("filter-value");

//Trigger setFilter function with correct parameters
function updateFilter() {
  var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
  console.log(
    "🚀 ~ file: sh_table.js ~ line 90 ~ updateFilter ~ filterVal",
    filterVal
  );
  typeVal = "like";
  var filter = filterVal == "function" ? customFilter : filterVal;

  if (filterVal == "function") {
    typeEl.disabled = true;
    valueEl.disabled = true;
  } else {
    typeEl.disabled = false;
    valueEl.disabled = false;
  }

  if (filterVal) {
    table.setFilter(filter, typeVal, valueEl.value);
  }
}

//Update filters on value change
document
  .getElementById("filter-field")
  .addEventListener("change", updateFilter);
document.getElementById("filter-value").addEventListener("keyup", updateFilter);
