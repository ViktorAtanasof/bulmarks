import { LandmarkFormData } from "../types/formTypes";

export const handleGeolocation = async (data: LandmarkFormData) => {
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${data.address}
        &key=${process.env.REACT_APP_GEOCODE_API_KEY}`
    );
    const fetchedData = await response.json();
    const geolocation = {
        lat: fetchedData.results[0]?.geometry.location.lat ?? 0,
        lng: fetchedData.results[0]?.geometry.location.lng ?? 0,
    }

    const location = fetchedData.status === 'ZERO_RESULTS' && undefined;

    return {geolocation, location};
};