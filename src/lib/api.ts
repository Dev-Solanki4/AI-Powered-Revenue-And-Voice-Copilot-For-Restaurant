// ==========================================
// PetPooja - API Client (with auto-refresh)
// ==========================================

const API_BASE = import.meta.env.VITE_API_URL || '';

// In-memory access token (NEVER persisted to localStorage)
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

async function baseRequest(path: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE}${path}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (response.status === 401 && accessToken) {
        const refreshed = await silentRefresh();
        if (refreshed) {
            headers.set('Authorization', `Bearer ${accessToken}`);
            response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });
        }
    }

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { detail: response.statusText };
        }
        return Promise.reject({ response: { data: errorData, status: response.status } });
    }

    // Attempt to parse JSON response
    try {
        const data = await response.json();
        return { data, status: response.status };
    } catch {
        return { data: null, status: response.status };
    }
}

export const apiClient = {
    get: (path: string, options?: RequestInit) => baseRequest(path, { ...options, method: 'GET' }),
    post: (path: string, body?: any, options?: RequestInit) => baseRequest(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (path: string, body?: any, options?: RequestInit) => baseRequest(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (path: string, options?: RequestInit) => baseRequest(path, { ...options, method: 'DELETE' }),
};

/**
 * Attempt to refresh the access token using the HTTPOnly refresh cookie.
 * Returns true if successful, false otherwise.
 */
export async function silentRefresh(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            accessToken = null;
            return false;
        }

        const data = await response.json();
        accessToken = data.access_token;
        return true;
    } catch {
        accessToken = null;
        return false;
    }
}

// ==========================================
// Auto-refresh timer
// ==========================================

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Start a timer that auto-refreshes the access token before it expires.
 * Default: refresh 1 minute before expiry.
 */
export function startAutoRefresh(tokenExpiresInMinutes: number = 15) {
    stopAutoRefresh();

    // Refresh 1 minute before expiry (or at half the time if < 2 min)
    const refreshMs = Math.max(
        (tokenExpiresInMinutes - 1) * 60 * 1000,
        (tokenExpiresInMinutes / 2) * 60 * 1000,
    );

    refreshTimer = setTimeout(async () => {
        const success = await silentRefresh();
        if (success) {
            startAutoRefresh(tokenExpiresInMinutes);
        }
    }, refreshMs);
}

export function stopAutoRefresh() {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
}
