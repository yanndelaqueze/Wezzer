import axios from "axios";

import { OPENWEATHER_BASE_URL } from "../config";

export class OpenWeatherAPI {
  static async getWeather(lat, lon) {
    const res = await axios.get(
      `${OPENWEATHER_BASE_URL}lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY_PARAM}`
    );
    return res;
  }
}

// https://api.openweathermap.org/data/2.5/forecast?lat=48.8949019&lon=2.4039608&appid={API%20key}
