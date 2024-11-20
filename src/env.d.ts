/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly HUBSPOT_CLIENT_ID: string;
  readonly HUBSPOT_CLIENT_SECRET: string;
  readonly REDIRECT_URI: string;
  readonly SITE_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}