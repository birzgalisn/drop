/** Shared CORS header policy for Nest CorsModule (and anything that mirrors it). */
export class CorsHeaders {
  static readonly POLICY = {
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Forwarded',
      'Tus-Resumable',
      'Tus-Version',
      'Upload-Concat',
      'Upload-Defer-Length',
      'Upload-Length',
      'Upload-Metadata',
      'Upload-Offset',
      'X-Forwarded-Host',
      'X-Forwarded-Proto',
      'X-HTTP-Method-Override',
      'X-Requested-With',
    ],
    exposedHeaders: [
      'Location',
      'Upload-Offset',
      'Upload-Length',
      'Tus-Resumable',
      'Tus-Version',
      'Tus-Max-Size',
      'Tus-Extension',
      'Upload-Metadata',
      'Upload-Defer-Length',
      'Upload-Concat',
    ],
  };
}
