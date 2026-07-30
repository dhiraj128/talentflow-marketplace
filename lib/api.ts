import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://api.sispl.shop/api/v1',
});

let isRefreshing = false;
let isRedirecting = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

function safeRedirectToSignIn() {
  if (typeof window !== 'undefined' && !isRedirecting) {
    const pathname = window.location.pathname;
    if (!pathname.startsWith('/sign-in') && !pathname.startsWith('/sign-up')) {
      isRedirecting = true;
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
        document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
      } catch (e) {
        console.error("Failed clearing local auth storage", e);
      }
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 50);
    }
  }
}

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        if (typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attach request correlation ID from headers or error payload
    const requestId =
      error.response?.headers?.['x-request-id'] ||
      error.response?.data?.requestId;

    if (requestId && error.response) {
      error.requestId = requestId;
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refresh_token')
          : null;

      if (!refreshToken) {
        safeRedirectToSignIn();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (typeof originalRequest.headers.set === 'function') {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
            } else {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            'https://api.sispl.shop/api/v1'
          }/auth/refresh`,
          {
            refresh_token: refreshToken,
          }
        );

        if ((res.status === 200 || res.status === 201) && res.data.access_token) {
          const newToken = res.data.access_token;

          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', newToken);
          }

          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          isRefreshing = false;
          onRefreshed(newToken);

          return api(originalRequest);
        }
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        safeRedirectToSignIn();

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;