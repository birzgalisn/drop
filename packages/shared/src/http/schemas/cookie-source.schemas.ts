import { z } from 'zod';

const cookiesBagSchema = z.record(z.string(), z.string().optional());

/** Fastify `@fastify/cookie` map, or GraphQL ctx wrapping that request. */
const cookiesBagFromSourceSchema = z
  .union([
    z.object({ cookies: cookiesBagSchema }),
    z.object({ req: z.object({ cookies: cookiesBagSchema }) }),
  ])
  .transform((value) => ('req' in value ? value.req.cookies : value.cookies));

const cookieHeaderTextSchema = z
  .union([z.string().min(1), z.array(z.string().min(1))])
  .transform((value) => (Array.isArray(value) ? value.join('; ') : value));

const headersSchema = z.union([
  z
    .instanceof(Headers)
    .transform((headers) => headers.get('cookie') ?? undefined)
    .pipe(z.string().min(1)),
  z.object({ cookie: cookieHeaderTextSchema }).transform((headers) => headers.cookie),
]);

/**
 * Fetch {@link Request} (`headers.get`) or Node / Fastify (`headers.cookie`),
 * including GraphQL ctx that nests the request under `req`.
 */
const cookieHeaderFromSourceSchema = z
  .union([
    z.object({ headers: headersSchema }),
    z.object({ req: z.object({ headers: headersSchema }) }),
  ])
  .transform((value) => ('req' in value ? value.req.headers : value.headers));

function cookiePairFromPart(part: string): readonly [string, string] | undefined {
  const separator = part.indexOf('=');

  if (separator === -1) {
    return undefined;
  }

  const key = part.slice(0, separator).trim();

  if (!key) {
    return undefined;
  }

  return [key, decodeURIComponent(part.slice(separator + 1).trim())];
}

function cookiesFromHeader(header: string): Record<string, string> {
  return Object.fromEntries(
    header.split(';').flatMap((part) => {
      const pair = cookiePairFromPart(part);
      return pair ? [pair] : [];
    }),
  );
}

/** Parsed cookie map from Fastify `cookies`, GraphQL ctx, Fetch Request, or Node headers. */
export const cookiesFromSourceSchema = z.union([
  cookiesBagFromSourceSchema,
  cookieHeaderFromSourceSchema.transform(cookiesFromHeader),
]);

export type CookiesFromSource = z.infer<typeof cookiesFromSourceSchema>;
