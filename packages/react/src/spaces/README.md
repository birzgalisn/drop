# Spaces UI (`@repo/react/spaces`)

Wizard, author manage, and recipient viewer for Drop spaces.

Each surface is a feature component that takes props: the route passes ids, `apiBaseUrl`, and navigation callbacks, and the component owns its own layout. Structure rules: [`.cursor/rules/code-structure.mdc`](../../../../.cursor/rules/code-structure.mdc), [`.cursor/rules/react-layers.mdc`](../../../../.cursor/rules/react-layers.mdc), [`.cursor/rules/react-composition.mdc`](../../../../.cursor/rules/react-composition.mdc).

`spaces/` is only domain folders (plus this README). Each domain uses `feature/` / `ui/` / `hooks/` / `util/` / `data-access/` / `constants/` as needed — nothing sits at the package root.

| Domain                  | Role                                                      |
| ----------------------- | --------------------------------------------------------- |
| `files/`                | Shared space + file kernel (query, mutations, tus, merge) |
| `wizard/`               | Author create flow (`upload/` step + share)               |
| `manage/`               | Author manage surface                                     |
| `share-viewer/`         | Recipient PIN gate + file list                            |
| `upload-notifications/` | Upload toast                                              |

## Exports

- `@repo/react/spaces/wizard` — `SpaceWizard` (+ `clearSpaceUploads`)
- `@repo/react/spaces/manage` — `SpaceManage`
- `@repo/react/spaces/share-viewer` — recipient `ShareViewer`
- `@repo/react/logo` — brand `DropLogo` (live storage meter)

## URL map

| Path                      | Stage                                                           |
| ------------------------- | --------------------------------------------------------------- |
| `/`                       | Landing upload (no space yet)                                   |
| `/spaces/$spaceId/upload` | Draft upload (add/remove files)                                 |
| `/spaces/$spaceId/share`  | Draft share (PIN + expiry)                                      |
| `/spaces/$spaceId`        | Author manage (after share) — admin chrome, QR, Finder list     |
| `/s/$token`               | Recipient viewer — “Shared with you”, Finder list, download/zip |

Wizard is two steps: **Upload → Share**. `spaceId` is a path param once a space exists.

**Author vs recipient:** Manage is “Manage this Drop” (share handoff + PIN first, then files). Viewer is “Shared with you” (download only). `DropLogo` / Start a new Drop returns to `/` (and clears staged uploads). File list stays live via `spaceUpdated` subscription (removes/adds appear without reload).

Uploads start on file add (tus via `useSpaceUploadStore`). The progress toast renders in a Mantine portal outside the React tree, so it reads and cancels uploads through that store rather than through props.

## GraphQL

Documents live in each domain’s `data-access/` (`files/`, `wizard/`, `share-viewer/`). Prefer regenerating via `pnpm generate` after API schema emit.
