const express = require('express');
var weather = require('weather-js');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thindharsh045:49dtxJ3MBt5GTcQm@sit314.u565w.mongodb.net/');
const schema = require('./schema');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve the index.html file for the front-end (if you have one)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/weather', async (req, res) => {
    const { location, temperature, humidity } = req.body;

    try {
        // Use findOneAndUpdate to find the document and update it or create a new one if it doesn't exist
        const data = await schema.findOneAndUpdate(
            { location },
            { temperature, humidity },
            { new: true, upsert: true }
        );

        if (data) {

            const responseData = {
                location: data.location,
                temperature: data.temperature,
                humidity: data.humidity
            };

            console.log('Weather data saved:', responseData);
            return res.status(200).json({ message: 'Weather data saved successfully', data: responseData });
        }
    } catch (error) {
        console.error('Error saving weather data:', error);
        return res.status(500).json({ message: 'Failed to save weather data', error: error.message });
    }
});


app.get('/api/weather/location/:location', async (req, res) => {
    const location = req.params.location.toLowerCase();
    const validLocations = ['melbourne', 'sydney', 'brisbane', 'perth'];

    if (validLocations.includes(location)) {
        weather.find({ search: location, degreeType: 'C' }, function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to retrieve weather data' });
            }

            if (result && result.length > 0) {
                const temperature = result[0].current.temperature;
                const humidity = result[0].current.humidity;
                return res.status(200).json({ temperature, humidity }); // Send temperature in response
            } else {
                return res.status(404).json({ error: 'No weather data available for this location' });
            }
        });
    }

    else {
        try {
            const weatherData = await schema.findOne({ location });

            if (weatherData) {
                // If found, respond with the temperature from the database
                return res.status(200).json({ temperature: weatherData.temperature, humidity: weatherData.humidity });
            } else {
                // If not found, respond with invalid location message
                return res.status(404).json({ error: 'Invalid location/ data not available' });
            }
        } catch (error) {
            console.error('Error fetching weather data from database:', error);
            return res.status(500).json({ error: 'Failed to retrieve data from the database' });
        }

    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
