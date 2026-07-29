# Tus (`@repo/nest/tus`)

Single upload endpoint: **`/files`**.

## Register a handler

```ts
registry.register(UploadType.SpaceFile, {
  onUploadCreate: async (req, upload) => { ... },
  onUploadFinish: async (req, upload) => { ... },
});
```

1. Add a member to `UploadType` in `@repo/shared`.
2. Implement hooks in the domain `tus/` folder.
3. Register from the domain module (see `spaces/tus/hooks/space-files-tus.hooks.ts`).

No new HTTP paths — one mount, typed dispatch.
