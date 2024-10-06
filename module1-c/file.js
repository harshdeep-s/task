const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Set up the serial port
const port = new SerialPort({
  path: 'COM5',
  baudRate: 9600
});

// Set up the parser with a delimiter
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Listen for data events
parser.on('data', (data) => {
  console.log(`Data received: ${data}`);
});

// Handle errors
port.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});
