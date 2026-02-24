import { Dispatch } from 'redux';
import { AuthActionTypes } from '../types';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';
import Toast from 'react-native-toast-message';

export const login = (credentials: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOGIN_REQUEST });
    try {
        const data = await authService.login(credentials);
        const { user, token } = data; // Adjust based on your backend response structure

        await storage.saveToken(token);
        await storage.saveUser(user);

        dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: { user, token },
        });

        Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: `Welcome back, ${user.name}!`,
        });
    } catch (error: any) {
        console.error('Login Error:', error);
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        const message = error.response?.data?.message || 'Login failed';
        dispatch({
            type: AuthActionTypes.LOGIN_FAILURE,
            payload: message,
        });
        throw new Error(message);
    }
};

export const register = (userData: FormData) => async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.REGISTER_REQUEST });
    try {
        const data = await authService.register(userData);
        console.log("Register Data", data);

        // We DO NOT save token/user here because they need to verify first.
        // Also, we don't dispatch REGISTER_SUCCESS with isAuthenticated: true.
        dispatch({
            type: AuthActionTypes.CLEAR_ERROR,
        });

        Toast.show({
            type: 'success',
            text1: 'Registration Successful',
            text2: 'Please check your email for the verification code!',
        });

        return data; // Return data so SignupScreen can navigate
    } catch (error: any) {
        console.error('Registration Error:', error);
        if (error.response) {
            console.error('Error Response:', error.response.data);
        }
        const message = error.response?.data?.message || 'Registration failed';
        dispatch({
            type: AuthActionTypes.REGISTER_FAILURE,
            payload: message,
        });
        throw new Error(message);
    }
};

export const logout = () => async (dispatch: Dispatch) => {
    await storage.clearAll();
    dispatch({ type: AuthActionTypes.LOGOUT });
};

export const clearError = () => ({
    type: AuthActionTypes.CLEAR_ERROR,
});

export const loadUser = () => async (dispatch: Dispatch) => {
    const token = await storage.getToken();
    const user = await storage.getUser();

    if (token && user) {
        dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: { user, token },
        });
    }
};

export const forgotPassword = (email: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOGIN_REQUEST }); // Reusing loading state
    try {
        await authService.forgotPassword(email);
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        dispatch({ type: AuthActionTypes.CLEAR_ERROR });
        Toast.show({
            type: 'success',
            text1: 'Email Sent',
            text2: 'Password reset token has been sent to your email.',
        });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to send reset email';
        dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: message });
        throw new Error(message);
    }
};

export const resetPassword = (token: string, password: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOGIN_REQUEST });
    try {
        const data = await authService.resetPassword(token, password);
        const { token: authToken } = data; // Backend returns a new token on success

        // We don't automatically log in here for security, or we can. 
        // Plan says "Verify login with new password", so let's just show success.

        Toast.show({
            type: 'success',
            text1: 'Password Reset',
            text2: 'Your password has been updated successfully. Please login with your new password.',
        });
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        dispatch({ type: AuthActionTypes.CLEAR_ERROR });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to reset password';
        dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: message });
        throw new Error(message);
    }
};

export const verifyEmail = (token: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOGIN_REQUEST });
    try {
        await authService.verifyEmail(token);
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        Toast.show({
            type: 'success',
            text1: 'Email Verified',
            text2: 'Your email has been successfully verified! You can now login.',
        });
        dispatch({ type: AuthActionTypes.CLEAR_ERROR });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Verification failed';
        dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: message });
        throw new Error(message);
    }
};

export const resendVerification = (email: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AuthActionTypes.LOGIN_REQUEST });
    try {
        await authService.resendVerification(email);
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        Toast.show({
            type: 'success',
            text1: 'Verification Sent',
            text2: 'A new verification link has been sent to your email.',
        });
        dispatch({ type: AuthActionTypes.CLEAR_ERROR });
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to resend verification';
        dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: message });
        throw new Error(message);
    }
};
