const { SerialPort } = require('serialport'); // Destructure SerialPort from the serialport package
const { ReadlineParser  } = require('@serialport/parser-readline');
const axios = require('axios');

// Open serial port (adjust the port name to match your setup)
const port = new SerialPort({
  path: 'COM5',
  baudRate: 9600
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Function to upload data to Plotly
const uploadToPlotly = async (temperature) => {
  const plotlyUsername = 'Harsh221150096';  // Replace with your Plotly username
  const plotlyAPIKey = 'tH4DMKhAmHOs2CdCjVzk';     // Replace with your Plotly API key

  const data = {
    data: [
      {
        x: [new Date().toISOString()], // X-axis: timestamp
        y: [temperature],              // Y-axis: temperature
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperature'
      }
    ],
    layout: {
      title: 'Temperature Data from Arduino',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Temperature (°C)' }
    }
  };

  try {
    const response = await axios.post(`https://api.plotly.com/v2/charts`, data, {
      auth: {
        username: plotlyUsername,
        password: plotlyAPIKey,
      },
    });
    console.log(`Uploaded temperature: ${temperature} °C`);
  } catch (error) {
    console.error('Failed to upload data to Plotly:', error.message);
  }
};

// Read data from Arduino via SerialPort
parser.on('data', (data) => {
  const temperature = parseFloat(data.trim());
  if (!isNaN(temperature)) {
    console.log(`Temperature: ${temperature} °C`);
    uploadToPlotly(temperature); // Upload temperature to Plotly
  }
});
