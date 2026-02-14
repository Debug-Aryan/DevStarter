// Expo public env var (safe to commit; no secrets)
// Set before running Expo:
// - PowerShell: $env:EXPO_PUBLIC_API_BASE_URL = "http://<your-ip>:3000"
// - Bash: export EXPO_PUBLIC_API_BASE_URL="http://<your-ip>:3000"
//
// We intentionally do NOT hardcode any URL here.
// If unset, the app still boots; API calls will throw a clear error.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
