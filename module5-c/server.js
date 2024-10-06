const mongoose = require('mongoose');
const express = require('express');
const app = express();
const sensor = require('./sensor');

app.use(express.json());

mongoose.connect('mongodb+srv://thindharsh045:49dtxJ3MBt5GTcQm@sit314.u565w.mongodb.net/')


app.post('/api/sensor', async (req, res) => {
    try {
        const newSensor = new sensor({
            id: req.body.id,
            temperature: req.body.temperature,
            humidity: req.body.humidity
        });

        const savedSensor = await newSensor.save();
        res.status(201).send(savedSensor); 
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.get('/api/sensor/:id', async (req, res) => {
    try {
        const sensorId = req.params.id; 
        const sensorData = await sensor.findOne({ id: sensorId });

        if (!sensorData) {
            return res.status(404).send({ message: 'Sensor not found' });
        }

        res.status(200).send(sensorData);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


app.delete('/api/sensor/:id', async (req, res) => {
    try {
        const sensorId = req.params.id;
        const result = await sensor.deleteOne({ id: sensorId }); 

        if (result.deletedCount === 0) {
            res.status(404).send({ message: 'Sensor not found' });
        } else {
            res.status(200).send({ message: 'Sensor deleted successfully' });
        }
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


app.put('/api/sensor/:id', async (req, res) => {

    try {
        const sensorId = req.params.id; 
        const {
            name,
            temperature,
            humidity
        } = req.body;

        
        const updatedSensor = await sensor.findOneAndUpdate(
            { id: sensorId },      
            { name, temperature, humidity} ,        
            { new: true, runValidators: true } 
        );

        if (!updatedSensor) {
            return res.status(404).send({ message: 'Sensor not found' });
        }

 
        res.status(200).send(updatedSensor);
    } catch (err) {
        console.error(err); 
        res.status(400).send({ error: err.message });
    }

});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
