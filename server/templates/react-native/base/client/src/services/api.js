import axios from 'axios';
import { API_BASE_URL } from '../config/env';

function assertBaseUrl() {
    if (API_BASE_URL) return;

    throw new Error(
        'Missing API base URL. Set EXPO_PUBLIC_API_BASE_URL before running the app.'
    );
}

const api = axios.create({
    baseURL: API_BASE_URL || undefined,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        return;
    }

    delete api.defaults.headers.common.Authorization;
}

export async function apiGet(path, config) {
    assertBaseUrl();
    return api.get(path, config);
}

export async function apiPost(path, data, config) {
    assertBaseUrl();
    return api.post(path, data, config);
}

export default api;
