import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const API_KEY = "6bdc95b52e3150a58e11d52bf6fd846c";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("index.ejs",{weatherData:null, error:null});
});

app.post("/weather", async(req,res)=>{
    const cityName = req.body.cityName;
    const baseURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;

    try{
        const response = await axios.get(baseURL);
        const weatherMain = response.data.weather[0].main;
        const weatherImages = {
            Rain: "./images/rain.png",
            Clouds: "./images/clouds.png",
            Clear: "./images/clear.png",
            Snow: "./images/snow.png",
            Drizzle: "./images/drizzle.png",
            Mist: "./images/mist.png",
        };

        const weatherImage = weatherImages[weatherMain] || "/images/clear.png";
        const weatherData = {
            city : response.data.name,
            temp : response.data.main.temp,
            wind: response.data.wind.speed,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            visibility: response.data.visibility,
            desc : response.data.weather[0].description,
            weatherImage : weatherImage,
        };

        console.log(req.body.cityName);

        res.render("index.ejs", {weatherData, error:null});
    } catch(error){
        res.render("index.ejs", {weatherData:null, error:error+"City Not Found! Try Again"})
    }
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});