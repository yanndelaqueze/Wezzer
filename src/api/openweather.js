import axios from "axios";

import { OPENWEATHER_BASE_URL } from "../config";

export class OpenWeatherAPI {
  static async getCurrentWeather(lat, lon) {
    const res = await axios.get(
      `${OPENWEATHER_BASE_URL}lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY_PARAM}`
    );
    return res;
  }
}

//"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API%20key}"
