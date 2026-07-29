import { z } from 'zod';

import { UploadTypes } from '../util/upload-type.util';

export const uploadTypeSchema = z.enum(UploadTypes.ALL);
