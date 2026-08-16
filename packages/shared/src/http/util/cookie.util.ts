import { cookiesFromSourceSchema } from '../schemas/cookie-source.schemas';

export function readCookie({
  source,
  name,
}: {
  source: unknown;
  name: string;
}): string | undefined {
  const value = cookiesFromSourceSchema.safeParse(source).data?.[name];

  if (typeof value !== 'string' || !value.length) {
    return undefined;
  }

  return value;
}
