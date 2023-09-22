export type Landmark = {
    id: string;
    imgUrls: string[];
    name: string;
    place: string;
    type: string;
    address: string;
    description: string;
    likes?: string[];
    geolocation: {
        lat: number;
        lng: number;
    };
    size: "small" | "large";
    userRef: string;
};

export type LandmarkCategoryProps = {
    landmarks: Array<{
        id: string;
        data: Landmark;
    }>;
    category: "small" | "large";
};

export type LikeLandmarkProps = {
    id: string;
    likes: string[];
};

export type FavouriteLandmarkProps = {
    id: string;
};