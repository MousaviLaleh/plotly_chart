
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}



// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array.
    var barArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var barNumber = barArray.filter(object => object.id == sample);

    // //  5. Create a variable that holds the first sample in the array.
    var firstSample = barNumber[0];

    // // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids;
    var otuLabel = firstSample.otu_labels;
    var sampleValue = firstSample.sample_values;

    // // 7. Create the yticks for the bar chart.
    // // Hint: Get the the top 10 otu_ids and map them in descending order  
    // // so the otu_ids with the most bacteria are last. 
    var yticks = otuID.slice(0, 10).map(id => "OTU " + id).reverse();

    // // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValue.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabel,
      type: 'bar',
      orientation: 'h',
    }];

    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top 10 Bacteria Cultures Found</b>',
      font:{
        family: 'Raleway, sans-serif'
      },
    };

    // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);





    // // Bubble charts

    // // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValue,
      text: otuLabel,
      mode: 'markers',
      marker: {
        size: sampleValue,
        color: otuID,
        colorscale: 'Rainbow'
      },
    }];

    // // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Culture Per Sample</b>',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: sampleValue },
      text: otuLabel
    };

    // // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);




    // // Guage Chart
    
    // Create a variable that holds the samples array.
    var gaugeArray = data.metadata;
    console.log(gaugeArray);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeNumber = gaugeArray.filter(object => object.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeSample = gaugeNumber[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var gotuID = gaugeSample.otu_ids;
    var gotuLabel = gaugeSample.otu_labels;
    var gsampleValue = gaugeSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = (gaugeSample.wfreq == null ) ? 0:  (gaugeSample.wfreq).toFixed(2);


    // // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain:{x:[0, 1], y: [0, 1] },
      value: wfreq,
      title: {text: '<b>Belly Button Washing Frequency</b><br><br><br>Scrubs per week'},
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: {
          range: [null, 10],
          tickmode: "array",
          tickvals: [0,2,4,6,8,10],
          ticktext: [0,2,4,6,8,10]
        },
        bar: {color: "rgb(74, 74, 78)"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }]
      }
    }];

    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      autosize: true,
      font : {'color': "black", 'family': "Arial"},
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "The gauge displays your belly button weekly washing frequency",
        showarrow: false
      }]
    };

    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);


  });
}
