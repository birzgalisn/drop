/**
 * Redis pub/sub JSON round-trips turn `Date` into ISO strings. Nest's
 * `GraphQLISODateTime.serialize` only accepts real `Date` instances and returns
 * `null` otherwise — which breaks non-null `DateTime!` fields on subscription
 * payloads. Revive ISO strings so GraphQL can serialize them again.
 */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export class RedisJson {
  static reviver(_key: string, value: unknown): unknown {
    if (typeof value !== 'string' || !ISO_DATE_RE.test(value)) {
      return value;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date;
  }
}
