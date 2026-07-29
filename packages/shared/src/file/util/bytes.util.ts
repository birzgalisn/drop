import { ByteSize } from '../constants/file-size.constants';

/** Formatting and capacity helpers for byte quantities. */
export class Bytes {
  /** Bytes that may still be uploaded while keeping the storage reserve free. */
  static uploadableFree(availableBytes: number): number {
    return Math.max(0, availableBytes - ByteSize.STORAGE_RESERVE);
  }

  /** 0–1 fraction of host disk capacity in use. */
  static usedRatio(capacity: { totalBytes: number; usedBytes: number }): number {
    if (capacity.totalBytes <= 0) {
      return 0;
    }

    return Bytes.clamp(capacity.usedBytes / capacity.totalBytes);
  }

  /**
   * 0–1 storage pressure vs reserve headroom.
   * 0 = full usable capacity still uploadable; 1 = at or below the reserve.
   */
  static pressure(capacity: {
    totalBytes: number;
    availableBytes: number;
    reserveBytes?: number;
  }): number {
    const reserveBytes = capacity.reserveBytes ?? ByteSize.STORAGE_RESERVE;
    const usable = Math.max(0, capacity.totalBytes - reserveBytes);

    if (usable <= 0) {
      return 1;
    }

    const uploadable = Math.max(0, capacity.availableBytes - reserveBytes);

    return Bytes.clamp(1 - uploadable / usable);
  }

  static format(bytes: number): string {
    if (bytes < ByteSize.KIB) {
      return `${bytes} B`;
    }

    if (bytes < ByteSize.MIB) {
      return `${(bytes / ByteSize.KIB).toFixed(1)} KiB`;
    }

    if (bytes < ByteSize.GIB) {
      return `${(bytes / ByteSize.MIB).toFixed(1)} MiB`;
    }

    return `${(bytes / ByteSize.GIB).toFixed(2)} GiB`;
  }

  /** Approximate upload speed label from bytes/sec. */
  static formatSpeed(bytesPerSecond: number): string {
    if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
      return '—';
    }

    return `${Bytes.format(bytesPerSecond)}/s`;
  }

  /** Clamp to the closed unit interval [0, 1]; non-finite → 0. */
  private static clamp(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.min(1, Math.max(0, value));
  }
}
