import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const embedPolicySchema = z.enum(['live', 'video', 'api']);
const statusSchema = z.enum(['active', 'development', 'maintenance']);

const bilingualTextSchema = z.object({
  es: z.string(),
  en: z.string(),
});

const linkSchema = z.object({
  type: z.enum(['live', 'code', 'case']),
  url: z.url(),
  label: bilingualTextSchema.optional(),
});

const metricSchema = z.object({
  label: bilingualTextSchema,
  value: z.string(),
  verified: z.boolean().default(false),
});

const projectSchema = z.object({
  order: z.number().int().positive(),
  slug: z.string(),
  title: bilingualTextSchema,
  summary: bilingualTextSchema,
  role: bilingualTextSchema,
  stack: z.array(z.string()),
  metrics: z.array(metricSchema).optional(),
  links: z.array(linkSchema).optional(),
  embedPolicy: embedPolicySchema.default('video'),
  embedUrl: z.url().optional(),
  videoUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  status: statusSchema.default('active'),
  featured: z.boolean().default(true),
  clientPermission: z.boolean().default(false),
  tint: z.string().default('#0A84FF'),
  screenshotIds: z
    .object({
      mac: z.array(z.string()).default([]),
      ipad: z.array(z.string()).default([]),
      iphone: z.array(z.string()).default([]),
    })
    .default({ mac: [], ipad: [], iphone: [] }),
  serverFlow: z.array(bilingualTextSchema).optional(),
});

export type Project = z.infer<typeof projectSchema>;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: projectSchema,
});

export const collections = {
  projects,
};
