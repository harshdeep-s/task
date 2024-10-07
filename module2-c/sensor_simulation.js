const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const mqtt = require('mqtt');

// Initialize serial port
const port = new SerialPort({
  path: 'COM5', // Update with your serial port path
  baudRate: 9600
});

// Initialize MQTT client
const mqttBrokerUrl = 'mqtt://broker.hivemq.com'; // Replace with your MQTT broker URL
const client = mqtt.connect(mqttBrokerUrl);

// Alert thresholds
const HEAT_THRESHOLD_HOMEOWNERS = 60.0;
const SMOKE_THRESHOLD_HOMEOWNERS = 50.0;

const HEAT_THRESHOLD_FIRE_SERVICE = 75.0;
const SMOKE_THRESHOLD_FIRE_SERVICE = 75.0;
const FIRE_THRESHOLD_FIRE_SERVICE = 0.7;

const HEAT_THRESHOLD_NEWS = 90.0;
const SMOKE_THRESHOLD_NEWS = 90.0;
const FIRE_THRESHOLD_NEWS = 0.9;

const HEAT_THRESHOLD_SOCIAL_MEDIA = 80.0;
const SMOKE_THRESHOLD_SOCIAL_MEDIA = 80.0;
const FIRE_THRESHOLD_SOCIAL_MEDIA = 0.8;

// Connect to the MQTT broker
client.on('connect', () => {
  console.log('Connected to MQTT broker');
});

// Handle MQTT errors
client.on('error', (err) => {
  console.error('MQTT Error: ', err.message);
});

// Parse data from Arduino
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {

  // Parse sensor values
  const [heatStr, smokeStr, fireStr] = data.split('\t');
  const heat = parseFloat(heatStr.split(': ')[1]);
  const smoke = parseFloat(smokeStr.split(': ')[1]);
  const fire = parseFloat(fireStr.split(': ')[1]);

  console.log(`Heat: ${heat} °C`);
  console.log(`Smoke: ${smoke} ppm`);
  console.log(`Fire: ${fire}`);

  // Determine alert messages using data fusion
  let homeownersMessage = '';
  let fireServiceMessage = '';
  let newsMessage = '';
  let socialMediaMessage = '';

  // Data fusion for homeowners: both heat and smoke must exceed thresholds
  if (heat > HEAT_THRESHOLD_HOMEOWNERS && smoke > SMOKE_THRESHOLD_HOMEOWNERS) {
    homeownersMessage = 'Warning: High heat and smoke levels detected. Please check your surroundings.';
    client.publish('/alerts/homeowners', homeownersMessage, { qos: 1 });
  }

  // Data fusion for fire service: all three sensors (heat, smoke, and fire) must exceed thresholds
  if (heat > HEAT_THRESHOLD_FIRE_SERVICE && smoke > SMOKE_THRESHOLD_FIRE_SERVICE && fire > FIRE_THRESHOLD_FIRE_SERVICE) {
    fireServiceMessage = 'Critical alert: High heat, smoke, and fire levels detected. Immediate action required.';
    client.publish('/alerts/fireService', fireServiceMessage, { qos: 1 });
  }

  // Data fusion for news: any two sensors must exceed thresholds
  if ((heat > HEAT_THRESHOLD_NEWS && smoke > SMOKE_THRESHOLD_NEWS) || 
      (heat > HEAT_THRESHOLD_NEWS && fire > FIRE_THRESHOLD_NEWS) || 
      (smoke > SMOKE_THRESHOLD_NEWS && fire > FIRE_THRESHOLD_NEWS)) {
    newsMessage = 'Alert: Extreme sensor readings detected. Media coverage may be required.';
    client.publish('/alerts/news', newsMessage, { qos: 1 });
  }

  // Data fusion for social media: any two sensors must exceed thresholds
  if ((heat > HEAT_THRESHOLD_SOCIAL_MEDIA && smoke > SMOKE_THRESHOLD_SOCIAL_MEDIA) || 
      (heat > HEAT_THRESHOLD_SOCIAL_MEDIA && fire > FIRE_THRESHOLD_SOCIAL_MEDIA) || 
      (smoke > SMOKE_THRESHOLD_SOCIAL_MEDIA && fire > FIRE_THRESHOLD_SOCIAL_MEDIA)) {
    socialMediaMessage = 'Alert: Critical sensor readings detected. Share this information on social media.';
    client.publish('/alerts/socialMedia', socialMediaMessage, { qos: 1 });
  }
});

// Handle serial port errors
port.on('error', (err) => {
  console.error('Serial Port Error: ', err.message);
});
