const globalApiBase =
  (window as { HOTEL_API_BASE_URL?: string }).HOTEL_API_BASE_URL;

export const environment = {
  apiBaseUrl: globalApiBase ?? 'http://localhost:8080',
};
