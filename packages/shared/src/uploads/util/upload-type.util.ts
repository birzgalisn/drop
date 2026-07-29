import { UploadType } from '../enums/upload-type.enum';

/** Registry / guard helpers for {@link UploadType}. */
export class UploadTypes {
  /** Stable registry / iteration order for upload handlers. */
  static readonly ALL = [UploadType.SpaceFile] as const;

  private static readonly SET = new Set<string>(UploadTypes.ALL);

  static is(value: unknown): value is UploadType {
    return typeof value === 'string' && UploadTypes.SET.has(value);
  }
}
