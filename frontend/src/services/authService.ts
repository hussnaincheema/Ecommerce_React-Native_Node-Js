import api from './api';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: FormData) => {
        const response = await api.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, password: any) => {
        const response = await api.put(`/auth/reset-password/${token}`, { password });
        return response.data;
    },

    verifyEmail: async (token: string) => {
        const response = await api.get(`/auth/verify-email/${token}`);
        return response.data;
    },

    resendVerification: async (email: string) => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },
};
