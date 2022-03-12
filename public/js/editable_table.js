
function showBtn() {
    var ele = document.getElementById('btn');
    
    ele.innerHTML = '<form method="post">'+
    '<button type="submit" class="btn m-lg-1 btn-primary btn-rounded btn-fw">save</button>'+
    '<button type="submit" class="btn btn-danger btn-rounded btn-fw">cancel</button>'+
    '</form>';
}


var table = document.getElementById('example');
var cells = table.getElementsByTagName('td');

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

                showBtn();

                td.removeAttribute('data-clicked');
                td.removeAttribute('data-text');
                td.style.cssText = 'padding: 15px';
                td.innerHTML = current_text ; 
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

console.log(cells);