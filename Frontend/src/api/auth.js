import api from './axios';

export const registerUser = (formData) =>
    api.post('/users/register', formData);

export const loginUser = (data) =>
    api.post('/users/login', data);

export const logoutUser = () =>
    api.post('/users/logout');

export const getCurrentUser = () =>
    api.get('/users/current-user');

export const updateAccountDetails = (data) =>
    api.patch('/users/update-details', data);

export const changePassword = (data) =>
    api.post('/users/change-password', data);

export const updateAvatar = (formData) =>
    api.patch('/users/avatar', formData);

export const updateCoverImage = (formData) =>
    api.patch('/users/cover-image', formData);

export const getChannelProfile = (userName) =>
    api.get(`/users/c/${userName}`);

export const getWatchHistory = () =>
    api.get('/users/history');
