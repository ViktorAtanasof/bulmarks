import { FieldErrors, UseFormRegister } from "react-hook-form";

export type InputFieldProps = {
    label: string;
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    errors: FieldErrors;
    minLength: number;
    maxLength: number
    required: boolean;
}

export type LandmarkFormData = {
    size: 'large' | 'small';
    name: string;
    type: string;
    place: string;
    address: string;
    description: string;
    latitude: number;
    longitude: number;
    images: FileList;
}