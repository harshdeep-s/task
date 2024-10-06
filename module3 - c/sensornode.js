const axios = require('axios');

// Function to simulate sensor data
const generateSensorData = () => {
    return {
        id: 'sensor1',  // Example ID, can be randomized or defined per sensor
        name: 'Room Sensor 1',
        address: 'Room 101',
        time: new Date().toISOString(),
        temperature: (17 + Math.random() * 13).toFixed(1), // Random between 17-30°C
        humidity: (30 + Math.random() * 20).toFixed(1),    // Random between 30-50%
        chairs_in_use: Math.floor(Math.random() * 50)     // Random between 0-50 chairs
    };
};

// Function to send sensor data to edge node
const sendSensorData = async () => {
    const sensorData = generateSensorData();
    const { id, name, address, time, temperature, humidity, chairs_in_use } = sensorData;

    console.log(`Sensor ID: ${id}`);
    console.log(`Name: ${name}`);
    console.log(`Address: ${address}`);
    console.log(`Time: ${time}`);
    console.log(`Temperature: ${temperature} °C`);
    console.log(`Humidity: ${humidity} %`);
    console.log(`Chairs in use: ${chairs_in_use}`);
    console.log('');
    
    try {
        const response = await axios.post('http://localhost:4000/sensor-data', sensorData);
        console.log(`Sensor data sent - Response: ${response.data.status}`);
    } catch (error) {
        console.error('Error sending sensor data:', error);
    }
};

setInterval(sendSensorData, 5000);
