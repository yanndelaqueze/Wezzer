import axios from "axios";

import { MAPBOX_GEOCODING_BASE_URL } from "../config";

export class GeocoderAPI {
  static async geocodeWithCoords(input) {
    const res = await axios.get(
      `${MAPBOX_GEOCODING_BASE_URL}${input.lon},${input.lat}.json?types=place&access_token=${process.env.REACT_APP_MAPBOX_API_KEY_PARAM}`
    );
    return res;
  }
}

// https://api.mapbox.com/geocoding/v5/{endpoint}/{longitude},{latitude}.json
// https://api.mapbox.com/geocoding/v5/mapbox.places/2.3920276,48.8542194.json?access_token=pk.eyJ1IjoieWFubmRlbGFxdWV6ZSIsImEiOiJjbGR5a2NueTIwMDJrM25vOXBhaXdiNHJuIn0.LeeRjGt1japvv4d5yvaRKw
