# Spaces domain (`@repo/nest/spaces`)

Ephemeral **space** of files → required-PIN **share** link.

## Layout

| Path                 | Role                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------- |
| `use-cases/`         | One verb each; inline Drizzle                                                          |
| `workflows/`         | Orchestration (create/add/remove/complete upload/create share)                         |
| `tus/hooks/`         | Registers `UploadType.SpaceFile` on `/files`                                           |
| `tus/schemas/`       | Domain tus metadata Zod contracts                                                      |
| `models/`            | GraphQL ObjectTypes (return rows; `@ResolveField` for derived; no `@Field` on secrets) |
| `controllers/`       | Share unlock + file/zip downloads                                                      |
| `jobs/`              | Thumbnail generation (BullMQ) + daily draft/expired-space purge                        |
| `spaces.resolver.ts` | GraphQL entry                                                                          |

## Flow

1. `addSpaceFiles` creates draft space (author cookie) + file rows.
2. Client uploads via tus `/files` with `uploadType=space_file`.
3. Finish → claim + promote to `/drop-media/spaces/{spaceId}/` → thumb/preview WebP
   derivatives alongside the original (`{fileId}.thumb.webp` / `.preview.webp`;
   download still uses the original).
4. `createShare` (6-digit PIN + expiry snapped to UTC midnight of `today + N days`)
   → catch-up thumbnails if needed; status → `SHARED`.
5. Author manages at `/spaces/:id` (add/remove still allowed while `SHARED`).
6. Recipient `/s/:token` unlocks with PIN; downloads via REST.
7. Daily UTC midnight cron: delete stale drafts + share-expired spaces, `rm -rf` their media dirs.

See `.cursor/rules/` for naming, use-cases, tus, and share access rules.
