/** Formatting helpers for calendar / clock values. */
export class Dates {
  /** Locale short datetime, e.g. `Jul 26, 2026, 5:22 PM`. Empty / invalid → `—`. */
  static format(value: string | Date | null | undefined): string {
    const date = Dates.parse(value);

    if (!date) {
      return '—';
    }

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  /** Locale short date, e.g. `Jul 26, 2026`. Empty / invalid → `—`. */
  static formatDate(value: string | Date | null | undefined): string {
    const date = Dates.parse(value);

    if (!date) {
      return '—';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private static parse(value: string | Date | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }
}
