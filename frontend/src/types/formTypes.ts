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