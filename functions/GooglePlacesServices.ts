// src/services/GooglePlacesService.ts
import axios from "axios";
import { GOOGLE_API_KEY } from "../config";

export const fetchPlacePredictions = async (input: string, country = "ke") => {
  if (!input.trim()) return [];
  const res = await axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
    params: {
      input,
      key: GOOGLE_API_KEY,
      components: `country:${country}`,
    },
  });
  console.log(res)
  return res.data.predictions || [];
};

export const fetchPlaceDetails = async (placeId: string) => {
  const res = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
    params: {
      place_id: placeId,
      key: GOOGLE_API_KEY,
      fields: "geometry,name,formatted_address",
    },
  });
  console.log(res)
  return res.data.result;
};
