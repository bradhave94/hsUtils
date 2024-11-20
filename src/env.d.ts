/// <reference path="../.astro/types.d.ts" />
import type { AstroClientDirective } from '../.astro/types';

interface ImportMetaEnv {
  readonly HUBSPOT_CLIENT_ID: string;
  readonly HUBSPOT_CLIENT_SECRET: string;
  readonly REDIRECT_URI: string;
  readonly SITE_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}