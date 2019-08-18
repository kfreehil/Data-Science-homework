// @TODO: YOUR CODE HERE!

var svgWidth = 1200;
var svgHeight = 660;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

d3.csv("./data/data.csv", function(error, data){

    if (error) throw error;

    console.log(data);

    // data.array.forEach(element => {
        
    // });
    // yScale = 
})