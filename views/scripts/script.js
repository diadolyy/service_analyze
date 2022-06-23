

//  import fetch from 'node-fetch';


let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');
let container= document.createElement('container');
var list = '';
var amount;
var onlineAmount =0;

table.appendChild(thead);
table.appendChild(tbody);

list = '<table class="table mt-3 mx-auto" id="viewData">'+'<thead>'+
'<tr>'+
  '<th scope="col">Name</th>'+
  '<th scope="col">Port</th>'+
  '<th scope="col">Status</th>'+
  '<th scope="col">Version</th>'+
  '<th scope="col">Component</th>'+
  '<th scope="col">Component version</th>'+
  '<th scope="col">Component status</th>'+
'</tr>'+
'</thead>';

setTimeout(function(){
  location.reload();
}, 900000);

async function getAPI() {
    try {
      document.getElementById('viewData').innerHTML="";
      var url="http://localhost:2525/imposters/";
      const response = await fetch(url); //запрос на получение всех портов
  
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
  
      const result=await response.json();

      amount=result.imposters.length;
  
      for(let i=0;i<(amount);++i){
        let port=result.imposters[i].port; //Получаем значение порта существующих сервисов
        const imposter=await fetch(`${url}${port}`); //посылаем запрос к портам
        var temp=await imposter.json();
        var tempBody=temp.stubs[0].responses[0].is.body;

        var header = temp.name;
        
        list += 
        '<tr>'+
          '<td>'+header+'</td>'+
          '<td>'+port+'</td>'+
          '<td>'+tempBody.status+'</td>'+
          '<td>'+tempBody.version+'</td>'+
          '<td>'+tempBody.componentInfoList[0].component+'</td>'+
          '<td>'+tempBody.componentInfoList[0].version+'</td>'+
          '<td>'+tempBody.componentInfoList[0].status+'</td>'+
          '</tr>';
        
        if(tempBody.status=='up'){ //выводим все открытые порты
          ++onlineAmount;

      }
       }
    
       document.getElementById('viewData').innerHTML += '<tbody>'+ list +'</tbody>';
        
    } catch (err) {
      console.log(err);
    }

  }

  document.addEventListener("DOMContentLoaded",getAPI);
  setTimeout(charts,500);

  
function charts(){
  google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {

        var Onlinedata = google.visualization.arrayToDataTable([
          ['Services', 'OnlineAmount'],
          ['Online',     onlineAmount],
          ['Offline',     (amount-onlineAmount)]
        ]);

        var options = {
          pieHole: 0.3,
          slices: {
            0: { color: 'green' },
            1: { color: 'grey' },
          }
        };

        var chartOn = new google.visualization.PieChart(document.getElementById('donutchart'));
        chartOn.draw(Onlinedata, options);
      }
    }
 
  document.getElementById("myinput").onkeyup=tableSearch;
    
// Поиск по таблице
function tableSearch() {
  
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myinput");
  filter = input.value.toUpperCase();
  table = document.getElementById("viewData");
  tr = table.getElementsByTagName("tr");

  // Перебираем все строки таблицы и скрываем те, которые не соответствует поисковому запросу
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Сортировка таблицы
function sortTable(ID) {
  var table, switching, i, x, y, shouldSwitch;
  table = document.getElementById("viewData");
  switching = true;
  
  while (switching) {
    switching = false;
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < (tr.length - 1); i++) {
      shouldSwitch = false;
      /* Получим два элемента для сравнения,
      один из текущей строки и один из следующей: */
      x = tr[i].getElementsByTagName("td")[ID];
      y = tr[i + 1].getElementsByTagName("td")[ID];
      // Проверим, должны ли две строки поменяться местами
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      tr[i].parentNode.insertBefore(tr[i + 1], tr[i]);
      switching = true;
    }
  }
}