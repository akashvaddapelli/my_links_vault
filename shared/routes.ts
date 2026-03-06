import { z } from 'zod';
import { insertLinkSchema, links } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.object({ success: z.boolean(), email: z.string() }),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.object({ email: z.string() }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  links: {
    list: {
      method: 'GET' as const,
      path: '/api/links' as const,
      responses: {
        200: z.array(z.custom<typeof links.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/links' as const,
      input: insertLinkSchema,
      responses: {
        201: z.custom<typeof links.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/links/:id' as const,
      input: insertLinkSchema.partial(),
      responses: {
        200: z.custom<typeof links.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LoginRequest = z.infer<typeof api.auth.login.input>;
export type LinkInput = z.infer<typeof api.links.create.input>;
export type LinkResponse = z.infer<typeof api.links.create.responses[201]>;
export type LinksListResponse = z.infer<typeof api.links.list.responses[200]>;