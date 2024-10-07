const express = require('express');
const weather = require('weather-js');
const mongoose = require('mongoose');
const schema = require('./schema');

// Connect to MongoDB
mongoose.connect('mongodb+srv://thindharsh045:49dtxJ3MBt5GTcQm@sit314.u565w.mongodb.net/');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve the index.html file for the front-end
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// CREATE: Add new weather data or update existing data
app.post('/api/weather', async (req, res) => {
    const { location, temperature, humidity } = req.body;

    try {
        const data = await schema.findOneAndUpdate(
            { location },
            { temperature, humidity },
            { new: true, upsert: true }
        );

        const responseData = {
            location: data.location,
            temperature: data.temperature,
            humidity: data.humidity
        };

        console.log('Weather data saved:', responseData);
        return res.status(200).json({ message: 'Weather data saved successfully', data: responseData });

    } catch (error) {
        console.error('Error saving weather data:', error);
        return res.status(500).json({ message: 'Failed to save weather data', error: error.message });
    }
});

// READ: Get weather data by location
app.get('/api/weather/location/:location', async (req, res) => {
    const location = req.params.location.toLowerCase();
    const validLocations = ['melbourne', 'sydney', 'brisbane', 'perth'];

    if (validLocations.includes(location)) {
        weather.find({ search: location, degreeType: 'C' }, async function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to retrieve weather data' });
            }

            if (result && result.length > 0) {
                const temperature = result[0].current.temperature;
                const humidity = result[0].current.humidity;
                return res.status(200).json({ temperature, humidity });
            } else {
                return res.status(404).json({ error: 'No weather data available for this location' });
            }
        });
    } else {
        try {
            const weatherData = await schema.findOne({ location });

            if (weatherData) {
                return res.status(200).json({ temperature: weatherData.temperature, humidity: weatherData.humidity });
            } else {
                return res.status(404).json({ error: 'Invalid location/data not available' });
            }
        } catch (error) {
            console.error('Error fetching weather data from database:', error);
            return res.status(500).json({ error: 'Failed to retrieve data from the database' });
        }
    }
});

// DELETE: Remove weather data by location
app.delete('/api/weather/location/:location', async (req, res) => {
    const location = req.params.location;

    try {
        const deletedData = await schema.findOneAndDelete({ location });
        if (deletedData) {
            return res.status(200).json({ message: 'Weather data deleted successfully', data: deletedData });
        } else {
            return res.status(404).json({ error: 'No weather data found for this location' });
        }
    } catch (error) {
        console.error('Error deleting weather data:', error);
        return res.status(500).json({ error: 'Failed to delete weather data' });
    }
});

// UPDATE: Update weather data by location
app.put('/api/weather/location/:location', async (req, res) => {
    const location = req.params.location.toLowerCase();
    const { temperature, humidity } = req.body;

    try {
        const updatedData = await schema.findOneAndUpdate(
            { location },
            { temperature, humidity },
            { new: true }
        );

        if (updatedData) {
            return res.status(200).json({ message: 'Weather data updated successfully', data: updatedData });
        } else {
            return res.status(404).json({ error: 'No weather data found for this location to update' });
        }
    } catch (error) {
        console.error('Error updating weather data:', error);
        return res.status(500).json({ error: 'Failed to update weather data' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
