// Expo bundles public variables into the app. Never put secrets here.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');
