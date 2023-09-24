import { FieldValue } from "firebase/firestore";

export type Landmark = {
    id: string;
    address: string;
    description: string;
    geolocation: {
        lat: number;
        lng: number;
    };
    imgUrls: string[];
    likes: string[];
    name: string;
    place: string;
    size: "small" | "large";
    timestamp: FieldValue;
    type: string;
    userRef: string;
};

export type LandmarkData = {
    id: string;
    data: Landmark;
};

export type LandmarkCategoryProps = {
    landmarks: Array<LandmarkData>;
    category: "small" | "large";
};

export type LikeLandmarkProps = {
    id: string;
    likes: string[];
};

export type FavouriteLandmarkProps = {
    id: string;
};