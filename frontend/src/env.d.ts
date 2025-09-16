/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VAPID_PUBLIC_KEY: string
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}