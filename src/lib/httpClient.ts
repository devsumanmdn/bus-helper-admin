/**
 * HTTP Client with automatic token refresh
 * Handles 401 errors by refreshing the access token and retrying the request
 */

import { authService } from '@/services/authService';

interface RequestConfig extends RequestInit {
    _retry?: boolean;
}

/**
 * Enhanced fetch wrapper with automatic token refresh on 401 errors
 */
export async function httpClient(
    url: string,
    config: RequestConfig = {}
): Promise<Response> {
    // Always include credentials for cookie-based auth
    const requestConfig: RequestConfig = {
        ...config,
        credentials: 'include',
    };

    try {
        const response = await fetch(url, requestConfig);

        // If we get a 401 and haven't already retried, attempt token refresh
        if (response.status === 401 && !config._retry) {
            console.log('[httpClient] 401 detected, attempting token refresh...');

            try {
                // Attempt to refresh the token
                await authService.refresh();
                console.log('[httpClient] Token refreshed successfully, retrying request...');

                // Retry the original request with the new token
                const retryConfig: RequestConfig = {
                    ...config,
                    _retry: true, // Prevent infinite retry loop
                    credentials: 'include',
                };

                return await fetch(url, retryConfig);
            } catch (refreshError) {
                console.error('[httpClient] Token refresh failed:', refreshError);

                // Clear tokens and redirect to login
                localStorage.removeItem('refresh_token');

                // Only redirect if we're in a browser environment
                if (typeof window !== 'undefined') {
                    window.location.href = '/admin/login';
                }

                throw new Error('Session expired. Please log in again.');
            }
        }

        return response;
    } catch (error) {
        console.error('[httpClient] Request failed:', error);
        throw error;
    }
}

/**
 * Convenience methods for common HTTP operations
 */
export const http = {
    async get(url: string, config?: RequestConfig): Promise<Response> {
        return httpClient(url, { ...config, method: 'GET' });
    },

    async post(url: string, body?: unknown, config?: RequestConfig): Promise<Response> {
        return httpClient(url, {
            ...config,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    async put(url: string, body?: unknown, config?: RequestConfig): Promise<Response> {
        return httpClient(url, {
            ...config,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    async delete(url: string, config?: RequestConfig): Promise<Response> {
        return httpClient(url, { ...config, method: 'DELETE' });
    },
};
