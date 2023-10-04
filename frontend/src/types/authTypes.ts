import { FieldValue } from "firebase/firestore";

export type AuthFormData = {
    username: string;
    email: string;
    password: string;
    timestamp: FieldValue;
    favourites: string[];
};

export type ProfileFormData = {
    username: string | null | undefined;
    email: string | null | undefined;
};

export type UserData = {
    email: string;
    favourites: string[];
    timestamp: FieldValue;
    username: string;
}