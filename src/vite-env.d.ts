/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /** Direct backend URL for the SSE stream — bypasses the Netlify proxy, which does not relay SSE. */
  readonly VITE_SSE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
