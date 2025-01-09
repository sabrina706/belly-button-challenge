// URL of the JSON data
const dataUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Build the metadata panel
function buildMetadata(sample) {
    d3.json(dataUrl).then((data) => {
        let metadata = data.metadata;
        let result = metadata.find(obj => obj.id == sample);

        let display = d3.select("#sample-metadata");
        display.html(""); // Clear previous metadata

        Object.entries(result).forEach(([key, value]) => {
            display.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to build both charts
function buildCharts(sample) {
    d3.json(dataUrl).then((data) => {
        let sampleData = data.samples;
        let result = sampleData.find(obj => obj.id == sample);

        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        let sampleValues = result.sample_values;

        // Bubble Chart
        let bubbleData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "YlGnBu",
                showscale: true
            }
        }];

        let bubbleLayout = {
            title: 'Bacterial Cultures per Sample',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            font: { color: 'black' }
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Bar Chart
        let barData = [{
            y: otuIds.slice(0, 10).map(val => `OTU ${val}`).reverse(),
            x: sampleValues.slice(0, 10).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: otuIds.slice(0, 10).reverse(),
                colorscale: "YlGnBu",
                showscale: true
            }
        }];

        let barLayout = {
            title: 'Top Ten Bacteria Cultures Found',
            xaxis: { title: 'Number of Bacteria' },
            plot_bgcolor: 'white'
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}

// Function to initialize the page
function init() {
    d3.json(dataUrl).then((data) => {
        let sampleNames = data.names;
        let dropdown = d3.select("#selDataset");

        sampleNames.forEach((sample) => {
            dropdown.append("option").text(sample).property("value", sample);
        });

        let firstSample = sampleNames[0];
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });
}

// Function to update charts when a new sample is selected
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
