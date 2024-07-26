const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const port = 4000;

const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', ws => {
    console.log('Client connected');

    function fetchData(message) {
        console.log("Fetching")
        const { lat = "", lon = "" } = JSON.parse(message)
        fetchWeatherApiData(lat, lon).then((data) => {
            ws.send(JSON.stringify(data));
        })
    }

    fetchData(JSON.stringify({}))

    // setInterval(async () => {
    ws.on("message", (message) => {
        console.log("New Message")
        fetchData(message)
    })
    ws.on('close', () => console.log('Client disconnected'));
    // }, 60000); // Fetch data every 60 seconds
});

async function fetchWeatherApiData(lat, lon) {
    const apiKey = "b58f44b5825e4b8fb3c60119242507"
    const city = "Palghar"
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`
    const defaultUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
    const response = await axios.get(lat ? url : defaultUrl);
    //   console.log({response})
    return response.data;
}

const fetchWeatherData = async () => {
    const apiKey = 'b12bf991bbf57240da33e3d827b95da1';
    const city = 'Palghar';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await axios.get(url);
    //   console.log({response})
    return response.data;
};

app.listen(port, () => console.log(`Server running on port ${port}`));