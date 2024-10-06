// src/hvacNode.js

const express = require('express');
const app = express();
app.use(express.json());

app.post('/hvac', (req, res) => {
    const { temperature, airflow } = req.body;
    console.log(`HVAC updated: Temperature set to ${temperature}°C, Airflow set to ${airflow}`);
    res.status(200).send({ status: 'HVAC settings updated', temperature, airflow });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`HVAC Node running on port ${PORT}`);
});