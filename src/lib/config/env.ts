import { z } from 'zod';

const envSchema = z.object({
  HUBSPOT_CLIENT_ID: z.string().optional().default(''),
  HUBSPOT_CLIENT_SECRET: z.string().optional().default(''),
  REDIRECT_URI: z.string().optional().default('http://localhost:4321/callback'),
  SITE_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);

export const config = {
  hubspot: {
    clientId: env.HUBSPOT_CLIENT_ID,
    clientSecret: env.HUBSPOT_CLIENT_SECRET,
    redirectUri: env.REDIRECT_URI,
    scopes: 'content crm.objects.contacts.read',
    urls: {
      auth: 'https://app.hubspot.com/oauth/authorize',
      token: 'https://api.hubapi.com/oauth/v1/token',
      api: 'https://api.hubapi.com',
    },
  },
  site: {
    password: env.SITE_PASSWORD,
  },
} as const;