/**
 * Duration lengths in whole seconds (cookie `maxAge`, TTLs, `Cache-Control`).
 * Prefer these over ad-hoc `60 * 60 * 24` expressions.
 * Use {@link Duration.toMs} for timers, `Date` math, and Apollo `pollInterval`.
 */
export class Duration {
  static readonly SECOND = 1;
  static readonly MINUTE = 60 * Duration.SECOND;
  static readonly HOUR = 60 * Duration.MINUTE;
  static readonly DAY = 24 * Duration.HOUR;
  /** Non-leap calendar year (365 days). */
  static readonly YEAR = 365 * Duration.DAY;

  /** Seconds → milliseconds. */
  static toMs(seconds: number): number {
    return seconds * 1000;
  }

  /** Milliseconds → whole seconds (cookie `maxAge`, etc.). */
  static toSeconds(ms: number): number {
    return Math.floor(ms / 1000);
  }
}
