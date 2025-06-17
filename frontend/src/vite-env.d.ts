/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_API_TIMEOUT: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_TOKEN_KEY: string
    readonly VITE_AUTO_LOGOUT_ON_401: string
    readonly VITE_DEBUG_MODE: string
    readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}