Notiflix.Report.init({
  messageMaxLength: 1923,
  backgroundColor: "#121212",
  success: {
    svgColor: "#32c682",
    titleColor: "#ffffff",
    messageColor: "#ffffff",
    buttonBackground: "#32c682",
    buttonColor: "#fff",
    backOverlayColor: "rgba(50,198,130,0.2)",
  },
  failure: {
    svgColor: "#ff5549",
    titleColor: "#ffffff",
    messageColor: "#ffffff",
    buttonBackground: "#ff5549",
    buttonColor: "#fff",
    backOverlayColor: "rgba(255,85,73,0.2)",
  },
});

Notiflix.Confirm.init({
  messageMaxLength: 1923,
  backgroundColor: "#121212",
  messageColor: "#ffffff",
  cancelButtonColor: "#f8f8f8",
  cancelButtonBackground: "#d30000",
});

function addRows() {
  Notiflix.Confirm.show(
    "Ajout de lignes",
    "Êtes-vous sûr de vouloir ajouter des lignes ?",
    "Oui",
    "Non",
    () => {
      $.ajax({
        url: "/sh",
        type: "POST", // data type (can be get, post, put, delete)
        data: JSON.stringify(id_empTable),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
        success: function (response, textStatus, jqXHR) {
          console.log(response);
          Notiflix.Report.success(
            "les lignes sélections bien ajouter",
            "",
            "d'accord"
          );

          table.setData();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          Notiflix.Report.failure(
            "les lignes sélections n'est pas ajouter",
            "",
            "d'accord"
          );
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    },
    () => {}
  );
}
function showBtn() {
  var ele = document.getElementById("btn");

  ele.innerHTML =
    '<button type="button" onClick="addRows();" class="btn btn-inverse-primary btn-fw m-2">Enregistrer</button> ' +
    '<button type="button" onClick="window.location.reload();" class="btn btn-inverse-danger btn-fw m-2">Cancel</button>';
}
const rowDelete = () => {
  Notiflix.Confirm.show(
    "Suppression des lignes",
    "Etes-vous sûr de vouloir supprime ces lignes!",
    "Oui",
    "Non",
    () => {
      $.ajax({
        url: "/deleteSH",
        type: "POST",
        data: JSON.stringify(selectedRowsForDel),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
        success: function (response, textStatus, jqXHR) {
          console.log(response);
          Notiflix.Report.success(
            "les lignes sélections bien supprimer",
            "",
            "d'accord"
          );
          table.setData();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          Notiflix.Report.failure(
            "les lignes sélections n'est pas supprimer",
            "",
            "d'accord"
          );
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    },
    () => {
      return;
    }
  );
  // if (confirm("êtes-vous sûr de vouloir supprime ces lignes!")) {
  //   console.log(
  //     "🚀 ~ file: sh_table.js ~ line 43 ~ rowDelete ~ selectedRowsForDel",
  //     selectedRowsForDel
  //   );

  //   $.ajax({
  //     url: "/deleteSH",
  //     type: "POST",
  //     data: JSON.stringify(selectedRowsForDel),
  //     dataType: "json",
  //     contentType: "application/json; charset=utf-8",
  //     async: false, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
  //     success: function (response, textStatus, jqXHR) {
  //       console.log(response);
  //       Notiflix.Report.success(
  //         "les lignes sélections bien supprimer",
  //         "",
  //         "d'accord"
  //       );
  //       table.setData();
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       Notiflix.Report.failure(
  //         "les lignes sélections n'est pas supprimer",
  //         "",
  //         "d'accord"
  //       );
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // } else return false;
};

var id_empTable = [];
var selectedData = [];
var json_emp = {};
// FIX : test if is it changed or not to save the new value.

//initialize table
var table = new Tabulator("#example-table", {
  scrollToRowPosition: "bottom", //position row in the center of the table when scrolled to
  height: "500px",
  ajaxURL: "http://localhost:3050/sh", //ajax URL
  ajaxConfig: "GET", //ajax HTTP request type
  ajaxError: function (error) {
    //error - fetch response object
  },
  layout: "fitColumns",
  // progressiveLoad: "scroll",
  autoColumns: false, //create columns from data field names
  history: true,
  placeholder: "No Data Set",
  index: "structure_id",
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
    { title: "Id", field: "structure_id", width: 70, sorter: "number" },
    {
      title: "Code Mnémonique",
      field: "code_mnémonique",
      width: 197,
      editor: "input",
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "3", //set the maximum character length of the input element to 3 characters
        },
      },
      sorter: "string",
    },
    {
      title: "Structures",
      field: "structure_libelle",
      editor: "input",
      sorter: "string",
    },
  ],
});
table.on("cellEdited", function (cell) {
  json_emp["ID"] = cell.getRow().getData().structure_id;
  json_emp["col"] = cell.getField();
  json_emp["value"] = cell.getValue();

  id_empTable.push(json_emp);
  json_emp = {};
  console.log(id_empTable);
  showBtn();
});
var selectedRowsForDel = [];
table.on("rowSelected", () => (selectedRowsForDel = table.getSelectedData()));

document.getElementById("add-row").addEventListener("click", function () {
  var rowCount = table.getDataCount();
  // we add +'' to make the ID a string cuz our controller test if string it update else insert
  table.addRow({ structure_id: rowCount + 1 + "" });
  table.scrollToRow(rowCount + 1, "middle", true);
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
