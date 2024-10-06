const axios = require('axios');

// Base URL for the API
const baseURL = 'http://credit-loadbalancer-536126010.us-east-1.elb.amazonaws.com:3000/api/sensor'; // Adjust this URL if your server is hosted elsewhere

// Function to generate random temperature and humidity values
function getRandomSensorData() {
    return {
        id: 2,
        temperature: Math.floor(Math.random() * 40), // Random temperature between 0 and 40
        humidity: Math.floor(Math.random() * 100) // Random humidity between 0 and 100
    };
}

// Function to upload initial sensor data
async function uploadSensorData() {
    try {
        const sensorData = getRandomSensorData();
        const response = await axios.post(baseURL, sensorData);
        console.log('Initial sensor data uploaded:', response.data);
    } catch (err) {
        console.error('Error uploading sensor data:', err.response ? err.response.data : err.message);
    }
}

// Function to update sensor data and retrieve the values
async function updateAndGetSensorData() {
    while (true) { // Infinite loop
        try {
            const updatedData = getRandomSensorData();
            const response = await axios.put(`${baseURL}/2`, updatedData); 
            
            await getSensorData();

           
           
        } catch (err) {
            console.error('Error updating sensor data:', err.response ? err.response.data : err.message);
        }
    }
}

async function getSensorData() {
    try {
        const response = await axios.get(`${baseURL}/2`); // Get data for sensor with id 1
        console.log('Retrieved sensor data:', response.data);
    } catch (err) {
        console.error('Error retrieving sensor data:', err.response ? err.response.data : err.message);
    }
}

// Main function to execute the tasks
async function main() {
    await uploadSensorData(); // Upload initial sensor data
    await updateAndGetSensorData(); // Update sensor data and get values in a loop
}

// Start the client
main();
