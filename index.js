import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import fs from "fs";

const weatherCodes = JSON.parse(
  fs.readFileSync(new URL("./public/data/weatherCodes.json", import.meta.url)),
);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/search", async (req, res) => {
  try {
    const params = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "wind_speed_10m_max",
        "precipitation_probability_max",
      ],
      timezone: "auto",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await axios.get(url, { params });
    console.log(responses.data);
    res.render("index.ejs", {
      data: responses.data,
      weatherCodes: weatherCodes,
    });
  } catch (error) {
    console.log(error);
    res.render("index.ejs", {
      error:
        "Ops! Si è verificato un errore. Consultare il log per maggiori informazioni.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
