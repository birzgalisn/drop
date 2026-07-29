/** Bundled demo images served from `apps/web/public/samples/`. */
export const SAMPLE_SPACE_FILES = [
  { src: '/samples/sample-1.jpg', alt: 'sample-1.jpg' },
  { src: '/samples/sample-2.jpg', alt: 'sample-2.jpg' },
  { src: '/samples/sample-3.jpg', alt: 'sample-3.jpg' },
];

/** Sample config for the landing wizard's "try with sample images" CTA. */
export const SPACE_SAMPLES = {
  previews: SAMPLE_SPACE_FILES,
  load: loadSampleSpaceFiles,
};

/** Fetches the three landing demo JPEGs as `File`s for `addFiles`. */
export async function loadSampleSpaceFiles() {
  const files = await Promise.all(
    SAMPLE_SPACE_FILES.map(async ({ src, alt }) => {
      const res = await fetch(src);

      if (!res.ok) {
        throw new Error(`Could not load ${alt}`);
      }

      const blob = await res.blob();
      const type = blob.type || 'image/jpeg';

      return new File([blob], alt, { type });
    }),
  );

  return files;
}
