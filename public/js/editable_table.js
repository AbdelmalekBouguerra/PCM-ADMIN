
function showBtn() {
    var ele = document.getElementById('btn');

    ele.innerHTML = '<form method="post" action = "/employeur">'+
    '<input type="hidden" name="id_empTable" id="hiddenInput" />'+
    '<button type="submit" class="btn m-lg-1 btn-primary btn-rounded btn-fw">save</button>'+
    '<button type="button" onClick="window.location.reload();" class="btn btn-danger btn-rounded btn-fw">cancel</button>'+
    '</form>';
    var input = document.getElementById('hiddenInput');
    input.value = JSON.stringify(id_empTable);
    console.log("json",id_empTable);
    console.log("input : ",input.value);
}

// convert a table to json
function tableToJson(table) {
    var data = [];
    // first row ** headers **
    var headers = [];
    for (var i = 0 ; i < table.rows[0].cells.length;i++){
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
    }
    // go through cells
    for (var i = 1 ; i < table.rows.length; i++){
        var tableRow = table.rows[i];
        var rowData = {};
        for (var j = 0; j < tableRow.cells.length;j++){
            rowData[headers[j]] = tableRow.cells[j].innerHTML;
        }
        data.push(rowData);
    }
    return data;
}
// collect id row that get changed
function pushIds(element,tab) {
    for (var i = 0;i < tab.length ; i++){
        if (tab[i] = element.id) return 0;
    }

    tab.push(element.id)
}

var table = document.getElementById('example');
var cells = table.getElementsByTagName('td');
var id_empTable = [];
var json_emp = {};
for (var i = 0;i < cells.length ; i++){
    cells[i].onclick = function () {
        if (this.hasAttribute('data-clicked')) {
            return;
        }
        this.setAttribute('data-clicked','yes');
        this.setAttribute('data-text',this.innerHTML);


        var input = document.createElement('input');
        input.value = this.innerHTML;
        input.style.width = "inherit";
        input.style.height = "inherit";
        input.style.border = "0px";
        input.style.fontFamily = "inherit";
        input.style.fontSize = "inherit";
        input.style.textAlign = "inherit";
        input.style.color = "inherit";

        input.onblur = function (){
            var td = input.parentElement;
            var orig_text = input.parentElement.getAttribute('data-text');
            var current_text =  this.value

            if (orig_text != current_text) {
                // save to db and pop up msg
                
                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                td.style.cssText = 'padding: 15px';
                td.innerHTML = current_text ;
                
                json_emp["id"] = td.id.split(",")[1]
                json_emp["col"] = td.id.split(",")[0];
                json_emp["value"] = current_text;

                id_empTable.push(json_emp);
                json_emp = {};

             showBtn();

            }else{
                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                td.style.cssText = 'padding: 15px';
                td.innerHTML = current_text ; 
            }
        }
        input.onkeypress = function(){
            if (event.keyCode == 13) {
                this.blur();
            }
        }
        this.innerHTML = "";
        this.style.cssText = 'widt:10px,padding: 0px 0px';
        
        this.append(input);
        this.firstElementChild.select();


    }
}

var myjson = JSON.stringify(tableToJson(table));

console.log(myjson);