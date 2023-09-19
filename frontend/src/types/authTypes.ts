import { FieldValue } from "firebase/firestore";

export type AuthFormData = {
    username: string;
    email: string;
    password: string;
    timestamp: FieldValue;
    favourites: string[];
};