/**
 * Binary byte units (IEC). Prefer these over ad-hoc `1024 * 1024` expressions.
 */
export class ByteSize {
  static readonly BYTE = 1;
  static readonly KIB = 1024 * ByteSize.BYTE;
  static readonly MIB = 1024 * ByteSize.KIB;
  static readonly GIB = 1024 * ByteSize.MIB;

  /** Minimum free disk space kept on the media volume before uploads are rejected (5 GiB). */
  static readonly STORAGE_RESERVE = 5 * ByteSize.GIB;
}
