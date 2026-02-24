import { AuthActionTypes, AuthState } from '../types';

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

export const authReducer = (state = initialState, action: any): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_REQUEST:
        case AuthActionTypes.REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AuthActionTypes.LOGIN_SUCCESS:
        case AuthActionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            };
        case AuthActionTypes.LOGIN_FAILURE:
        case AuthActionTypes.REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                isAuthenticated: false,
            };
        case AuthActionTypes.LOGOUT:
            return initialState;
        case AuthActionTypes.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case AuthActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
