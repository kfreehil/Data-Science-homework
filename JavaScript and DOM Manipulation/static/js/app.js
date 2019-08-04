// from data.js
var tableData = data;
var drpDownFilters = ["city","state","country","shape"]

var tbody = d3.select("#ufo-table>tbody");

var btn = d3.select("#filter-btn");
btn.on("click", handleClick);

function handleClick(){

    tbody.html("");
  
    var filteredData = getfilteredData();

    filteredData.forEach((item) => {
        var trow = tbody.append("tr");
        Object.values(item).forEach((value)=>{
            var cell = trow.append("td")
            cell.text(value);
        })
    })

    console.log(filteredData);
}

function getfilteredData(){

    var filteredData = tableData

    var input_date = d3.select("#datetime");
    var input_date_value = input_date.property("value");
    if (!input_date_value.length == 0){
            filteredData = filteredData.filter((obj) => obj.datetime === input_date_value)
        }

    drpDownFilters.forEach((filterName) => {
        var filter_obj = d3.select("#select-" + filterName)
        var selectedCriteria = filter_obj.property("selectedOptions");
        selectedCriteria = Object.values(selectedCriteria).map(item => item.text)
        
        if (!selectedCriteria.length == 0){
            filteredData = filteredData.filter((obj) => selectedCriteria.includes(obj[filterName]))
        }
    })

    return filteredData;
}

function getDropDownLists(){
    addlist("city", "#select-city")
    addlist("state", "#select-state")
    addlist("country", "#select-country")
    addlist("shape", "#select-shape")
}

function addlist(list_type, html_location){

    var uniquelist = tableData
    .map(myItem => myItem[list_type])
    .filter((item, index, itemList) => itemList.indexOf(item) === index)
    .sort();

    console.log(uniquelist);

    var drpdwn_obj = d3.select(html_location);
    uniquelist.forEach(item => {
        var option = drpdwn_obj.append("option")
        option.text(item);
    })
    
}