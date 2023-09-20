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

/* export type InputFieldProps = {
    label: string;
    name: string;
    placeholder: string;
    register:
    errors:
    minLength: number;
    maxLength: number
    required: boolean;
    type,
} */