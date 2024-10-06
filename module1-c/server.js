const express = require('express');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const PORT = 3000;

// Initialize SerialPort
const port = new SerialPort({
  path: 'COM5',
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

let serialData = ''; // Variable to store the serial data

// Event listener for serial data
parser.on('data', (data) => {
  serialData = data;
  console.log(`Data received: ${data}`);
});

// Serve static files from the root directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'arduino.html'));
});

// Route to handle data requests
app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the server!', serialData });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
