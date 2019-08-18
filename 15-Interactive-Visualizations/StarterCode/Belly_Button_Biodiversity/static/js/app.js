function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`
  d3.json(url).then(response =>{
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value])=>{
      var cell = metadata.append("p")
      cell.text(`${key}: ${value}`);
    })

  })

    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url).then(response =>{

    console.log(response)
  
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
        mode: 'markers',
        x: response.otu_ids,
        y: response.sample_values,
        marker: { size: response.sample_values,
                  color: response.otu_ids},
        text: response.otu_labels
    }

    var data1 = [trace1]

    var layout1 = {
        title: 'Bubble Chart'
    }

    Plotly.newPlot('bubble',data1, layout1)

    // @TODO: Build a Pie Chart
    var trace2 = {
        type: "pie",
        values: response.sample_values.sort((f,s)=> s-f).slice(0,10),
        labels: response.otu_ids,
        hovertext: response.otu_labels
    }

    var data2 = [trace2];

    var layout2 = {
      title: "Pie Chart"
    }

    Plotly.newPlot("pie", data2, layout2)
  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
