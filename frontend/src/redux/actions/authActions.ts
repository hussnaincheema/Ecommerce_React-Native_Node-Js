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
        const { user, token } = data;

        await storage.saveToken(token);
        await storage.saveUser(user);

        dispatch({
            type: AuthActionTypes.REGISTER_SUCCESS,
            payload: { user, token },
        });

        Toast.show({
            type: 'success',
            text1: 'Registration Successful',
            text2: 'Account created successfully!',
        });
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
