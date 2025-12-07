import { API_ENDPOINT_PREFIX } from "@/secrets";

export interface FailedRequest {
  resolve: (value?: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const REFRESH_ENDPOINT = "/auth/refresh";

const pushToFailedQueue = () => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(true);
    }
  });
  failedQueue = [];
};

const refreshToken = async () => {
  isRefreshing = true;

  try {
    const response = await fetch(`${API_ENDPOINT_PREFIX}${REFRESH_ENDPOINT}`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      isRefreshing = false;
      processQueue(null);
      return true;
    } else {
      throw new Error("Refresh token is invalid or expired.");
    }
  } catch (error) {
    isRefreshing = false;
    processQueue(error as Error);

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw error;
  }
};

export async function authFetch(endpoint: string, options = {}) {
  const defaultOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  let response = await fetch(`${API_ENDPOINT_PREFIX}${endpoint}`, defaultOptions);

  if (response.status === 403 || response.status === 401) {
    if (endpoint === REFRESH_ENDPOINT) {
      return response;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      refreshToken();
    }

    await pushToFailedQueue();

    response = await fetch(`${API_ENDPOINT_PREFIX}${endpoint}`, defaultOptions);

    return response;
  }

  return response;
}
