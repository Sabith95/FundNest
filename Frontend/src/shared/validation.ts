import type { ILoginFormErrors, ILoginFormValues } from "../types/auth.types";

export const validateLoginForm = (
    values: ILoginFormValues
): ILoginFormErrors =>{
    const errors: ILoginFormErrors = {}

    if(!values.email){
        errors.email = 'Email is required'
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)){
        errors.email = 'Enter a valid email address'
    }

    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
}