 function buildMetadata(sample) {

   // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var URL = `/metadata/${sample}`;
    d3.json(URL).then(function(sample) {
      console.log(sample);
      var metadata = d3.select("#sample-metadata");
    
      // Use `.html("") to clear any existing metadata
      sample-metadata.html("");

      // Use `Object.entries` to add each key and value pair to the panel     
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      
      Object.entries(sample).forEach(([key, value]) => {
      console.log(`${key} ${value}`); 
      metadata.append("div").text(`${key} : ${value} `);
      });
    });
  };

  function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots

  var URL = `/samples/${sample}`; 
  d3.json(URL).then(function(sample) {
    console.log(sample);
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
     // @TODO: Build a Bubble Chart using the sample data

     var x_values = sample.otu_ids;
     var y_values = sample.sample_values;
     var marker_size = sample.sample_values;
     var marker_colors = sample.otu_ids; 
     var text_values = sample.otu_labels;
 
     var trace1 = {
       x: x_values,
       y: y_values,
       hovertext: text_values,
       mode: 'markers',
       marker: {
         color: marker_colors,
         //opacity: [1, 0.8, 0.6, 0.4],
       size: marker_size,
       type: "bubble"
       }
     };
     
     var data = [trace1];
     
     var layout = {
       showlegend: false,
       xaxis: { title: "OTU ID"},
       height: 600,
       width: 1300
     };

    Plotly.newPlot('bubble', data, layout);
  
  // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var otu_ids = sample.otu_ids;
    var sample_values = sample.sample_values;
    var otu_labels = sample.otu_labels;

   // var sorted_sample_values = sample.sample_values.sort(d3.descending)
   // console.log(sorted_sample_values);
   // var dataTable = tabulate(sample, ["otu_ids","sample_values", "otu_labels"]);
    var sorted_values = sample.sort(function(a, b){ 
      return d3.descending(a[2], b[2]); 
    });
    

    var sliced_sample_values = sorted_values.slice(0, 10);
    console.log(sliced_sample_values);
    var sliced_otu_ids = otu_ids.slice(0, 10);
    console.log(sliced_otu_ids);
    var sliced_labels = otu_labels.slice(0, 10);
    console.log(sliced_labels);

    var data = [{
        values : sliced_sample_values,
        labels : otu_ids,
        hovertext: otu_labels,
        type: "pie"
    }];

    var layout = {
         height: 800,
         width: 1000
      };
  
    Plotly.newPlot("pie", data, layout);
});
};

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
  };

 function optionChanged(newSample) {
   // Fetch new data each time a new sample is selected
   buildCharts(newSample);
   buildMetadata(newSample);
 };

 // Initialize the dashboard
init();



