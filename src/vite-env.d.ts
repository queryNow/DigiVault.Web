/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_OPENAI_ENDPOINT: string
  readonly VITE_AZURE_OPENAI_API_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_MSAL_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}