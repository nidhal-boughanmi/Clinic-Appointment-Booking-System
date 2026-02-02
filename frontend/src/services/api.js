import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (userData) => API.post('/auth/register', userData),
    login: (credentials) => API.post('/auth/login', credentials),
    getProfile: () => API.get('/auth/profile'),
    updateProfile: (userData) => API.put('/auth/profile', userData),
};

// Doctor API
export const doctorAPI = {
    getAllDoctors: (params) => API.get('/doctors', { params }),
    getDoctorById: (id) => API.get(`/doctors/${id}`),
    createDoctor: (doctorData) => API.post('/doctors', doctorData),
    updateDoctor: (id, doctorData) => API.put(`/doctors/${id}`, doctorData),
    deleteDoctor: (id) => API.delete(`/doctors/${id}`),
};

// Appointment API
export const appointmentAPI = {
    createAppointment: (appointmentData) => API.post('/appointments', appointmentData),
    getAppointments: (params) => API.get('/appointments', { params }),
    getAppointmentById: (id) => API.get(`/appointments/${id}`),
    updateAppointment: (id, appointmentData) => API.put(`/appointments/${id}`, appointmentData),
    cancelAppointment: (id, reason) => API.delete(`/appointments/${id}`, { data: { reason } }),
};

// User API (Admin only)
export const userAPI = {
    getAllUsers: (params) => API.get('/users', { params }),
    getUserById: (id) => API.get(`/users/${id}`),
    updateUser: (id, userData) => API.put(`/users/${id}`, userData),
    deleteUser: (id) => API.delete(`/users/${id}`),
};

export default API;
