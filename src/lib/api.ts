import axios, { type AxiosResponse } from 'axios';

// Types
export interface Asset {
  url: string;
  name?: string;
}

export interface MapLayer {
  url: string;
  layer: string;
  name?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// API Client configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Une erreur est survenue',
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

// API Methods
export const fetchItems = async (fetchUrl: string): Promise<AxiosResponse> => {
  return apiClient.get(fetchUrl);
};

export const uploadItem = async (
  uploadUrl: string,
  formData: FormData
): Promise<AxiosResponse> => {
  return apiClient.post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const postItem = async (
  postUrl: string,
  data: any
): Promise<AxiosResponse> => {
  return apiClient.post(postUrl, data);
};

export const deleteItem = async (
  deleteUrlBase: string,
  item: Asset
): Promise<AxiosResponse> => {
  const url = `${deleteUrlBase}?url=${encodeURIComponent(item.url)}`;
  return apiClient.delete(url);
};

export const deleteMapLayer = async (
  deleteUrlBase: string,
  layer: MapLayer
): Promise<AxiosResponse> => {
  const url = `${deleteUrlBase}?url=${encodeURIComponent(layer.url)}&layer=${encodeURIComponent(layer.layer)}`;
  return apiClient.delete(url);
};
