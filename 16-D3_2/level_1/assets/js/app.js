// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width of the #scatter
    // html element.
    var svgWidth = d3.select("#scatter").node().getBoundingClientRect().width
    var svgHeight = .75 * d3.select("#scatter").node().getBoundingClientRect().width
    var bubble_radius = 15/700 * d3.select("#scatter").node().getBoundingClientRect().width
    var font_size = 10/700 * d3.select("#scatter").node().getBoundingClientRect().width

    var margin = {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70
    }

    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    d3.csv("assets/data/data.csv").then(function(data){

        console.log(data);

        data.forEach(element => {
            element.healthcare = +element.healthcare;
            element.poverty = +element.poverty       
        });

        var xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.poverty))
            .range([0, chartWidth]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.healthcare)])
            .range([chartHeight, 0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);
        
        chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", `${bubble_radius}`)
            .attr("fill", "blue")
            .attr("opacity", "1")
            .attr("stroke-width", "1")
            .attr("stroke", "black")
            .property("textContent", d => d.abbr);

        chartGroup.selectAll(null)
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .text(d => d.abbr)
            .attr("font-family", "sans-serif")
            .attr("font-size", `${font_size}`)
            .attr("text-anchor", "middle")
            .attr("fill", "white");

          // Append axes titles
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", - 50)
          .attr("x", 0 - chartHeight/(2))
          .attr("font-size", `${font_size*1.5}`)
          .attr("text-anchor", "middle")
          .attr("class", "axisText")
          .text("Healthcare (%)");
        
        chartGroup.append("text")
          .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 50})`)
          .classed("axisText", true)
          .text("Poverty (%)")
          .attr("font-family", "sans-serif")
          .attr("font-size", `${font_size*1.5}`)
          .attr("text-anchor", "middle")

        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 37})`)
            .classed("smurf-text text", true)
            .text("Smurf Sightings");

    })
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);