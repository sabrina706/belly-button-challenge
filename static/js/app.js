// Define the URL for the JSON data
const jsonDataUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to display metadata information
function displayMetadata(sampleId) {
    d3.json(jsonDataUrl).then((data) => {
        let metadataList = data.metadata;
        let selectedMetadata = metadataList.find(entry => entry.id == sampleId);

        let metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html(""); // Clear any existing content

        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to generate charts for the selected sample
function createCharts(sampleId) {
    d3.json(jsonDataUrl).then((data) => {
        let samplesArray = data.samples;
        let selectedSample = samplesArray.find(entry => entry.id == sampleId);

        let otuIds = selectedSample.otu_ids;
        let otuLabels = selectedSample.otu_labels;
        let sampleValues = selectedSample.sample_values;

        // Generate the bubble chart
        let bubbleChartData = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Reds",
                showscale: true
            }
        }];

        let bubbleChartLayout = {
            title: 'Bacterial Cultures per Sample',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            font: { color: 'black' }
        };

        Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

        // Generate the bar chart
        let barChartData = [{
            y: otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            x: sampleValues.slice(0, 10).reverse(),
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: otuIds.slice(0, 10).reverse(),
                colorscale: "Reds",
                showscale: true
            }
        }];

        let barChartLayout = {
            title: 'Top 10 Bacteria Cultures Found',
            xaxis: { title: 'Number of Bacteria' },
            plot_bgcolor: 'white'
        };

        Plotly.newPlot("bar", barChartData, barChartLayout);
    });
}

// Function to initialize the page content
function initializeDashboard() {
    d3.json(jsonDataUrl).then((data) => {
        let sampleOptions = data.names;
        let dropdownMenu = d3.select("#selDataset");

        sampleOptions.forEach((sample) => {
            dropdownMenu.append("option").text(sample).property("value", sample);
        });

        let initialSample = sampleOptions[0];
        displayMetadata(initialSample);
        createCharts(initialSample);
    });
}

// Function to update the visualizations when a different sample is selected
function updateVisualizations(newSampleId) {
    displayMetadata(newSampleId);
    createCharts(newSampleId);
}

// Initialize the dashboard
initializeDashboard();

