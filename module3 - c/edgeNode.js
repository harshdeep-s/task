const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thindharsh045:49dtxJ3MBt5GTcQm@sit314.u565w.mongodb.net/');


const schema = require('./schema');
const PORT = 4000;
const app = express();
app.use(express.json());

let newtemp = null;


app.post('/sensor-data', async (req, res) => {
    const { id, name, address, time, temperature, humidity, chairs_in_use } = req.body;

    let hvacAction = null;
    if (temperature > 25 || chairs_in_use > 20) {
        hvacAction = { temperature: 18, airflow: 'high' };
        newtemp = 18;
        await adjustHVAC(hvacAction);
    }
    else if (temperature < 20) {
        hvacAction = { temperature: 24, airflow: 'low' }; // Example adjustment for cold conditions
        newtemp = 24;
        await adjustHVAC(hvacAction);
    } else {
        console.log('Room conditions are optimal, no HVAC adjustment needed.');
    }

    const data = new schema({
        id: id,
        name: name,
        address: address,
        time: time,
        temperature: temperature,
        humidity: humidity,
        newtemp: newtemp,
        chairs_in_use: chairs_in_use,
        timestamp: new Date()
    });

    data.save().then(doc => {
        console.log(doc);
    })

});

// Function to adjust HVAC based on sensor data
const adjustHVAC = async ({ temperature, airflow }) => {
    try {
        const response = await axios.post('http://localhost:3000/hvac', { temperature, airflow });
        console.log('HVAC adjusted:', response.data);
    } catch (error) {
        console.error('Error adjusting HVAC:', error);
    }
};

app.listen(PORT, () => {
    console.log(`Edge Node running on port ${PORT}`);
});