import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email address is required'),
    password: Yup.string()
        .min(6, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});

export const signupValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Full name is required'),
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email address is required'),
    password: Yup.string()
        .min(6, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
});
