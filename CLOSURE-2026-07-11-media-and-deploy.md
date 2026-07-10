# Closure record — media "Replace Image" + deployment guides (2026-07-11)

Governed build under THINKX1.md / THINKX2.md. This is the **A22 session-read manifest**
(the framework's anti-drift closure artifact) plus the commit summary for the session.

## Session-read manifest (A22)
Both governing documents were **read in full in this session**, from the working tree, before
building — not cited from cached labels (§0.1 / A19 / A22):
- `THINKX1.md` — lines 1–414 (Constitution incl. AMD-005 §0.1, AMD-006 §1.5.1 four-layer +
  §1.5.2 proactive audit, AMD-004 §1.7).
- `THINKX2.md` — lines 1–762 (Constitution mirror + Asset Library A1–A22).

Assets cited in this session's commits, and how the build embodies each:
- **AMD-006 §1.5.1 (four-layer)** — traced before building: L1 one config-driven reusable control
  (`Dropzone`+`ImageField`), no schema change; L2 verified end-to-end (drop→upload→assign→save→
  reload); L3 composes with the existing save flow and keeps the "choose existing" path (no
  capability lost); L4 visual thumbnail + drag affordance.
- **§1.5.2 (proactive audit)** — surfaced findings beyond the ask: `projects.gallery` is
  unrendered dead config; admin lists had no ordering; media picker order was inconsistent.
  Fixed the two obvious-right-default ones; surfaced the gallery one as a decision.
- **A14 (data path ≠ render path)** — verified *every* ImageField branch: upload-replace,
  choose-existing, remove, empty-state, globals embedding, SVG-reject, and alt-persist-on-blur.
- **A16 / A21 (compose / same logic everywhere)** — one `Dropzone` primitive powers the field
  control and the library uploader; media reads newest-first in both the list and the picker.
- **A17 (multi-contract)** — the fast drop flow preserves alt-text accessibility (auto-suggested
  alt + inline editable field that persists via `updateMediaAlt`).
- **A20 (recommend, don't offload)** — took the lead on obvious-right defaults (list ordering);
  surfaced genuine values-decisions (gallery, multi-user admin) with recommendations, not "you decide".
- **A5 (ripple-trace a change)** — the CSP added earlier forbids `blob:`, so previews use `data:`
  URLs; the old `select[name=imageId]` e2e was rewritten to the new render path.

## Commits this session
- `Admin: visual drag-and-drop "Replace Image" control for every media field`
- `test: verify alt-text persist-on-blur (closes the untested branch)`
- `Admin: order list pages so the owner sees the right rows first`
- `Admin: order the media picker newest-first`
- Docs: Hetzner CX-is-EU-only correction, Windows PowerShell SSH, multi-site build memory,
  `MULTI-SITE.md`, and a generated `Hetzner-Setup-Guide.pdf` (Nuremberg/CX33, Windows).

## Verification (this session's end state)
- `tsc --noEmit`: clean · `next build`: exit 0
- Integration (vitest): 18/18 · **E2E (Playwright): 19/19 against `next start`** (prod mode)
- The dev server flakes at 9 parallel workers (Next dev is slow under load) — green at ≤2 workers
  and in prod; the authoritative runs are the prod-server runs.

## Open — founder decisions (surfaced, not built; A20)
- **`projects.gallery`** — a multi-image JSON field that renders nowhere on the public site, shown
  in the admin as a raw-JSON footgun. *Recommend:* hide it, unless you want a real multi-photo
  gallery section on the projects page (then I'd build the public section + a multi-image manager).
- **Multi-user admin** — one owner login today; add a Users collection if separate staff logins are wanted.
- **Other raw-JSON admin fields** (`hours`, `trust bar`, `why-us`) — same unfriendliness class as
  media was; could get simple repeating-row editors.

## Deploy note recorded
Owner chose **CX33 / Nuremberg** (EU) over a US CPX/Hillsboro plan — accepted ~150 ms extra
latency for US visitors in exchange for the lower price. Functionally fine for a booking site;
local SEO unaffected. Server hosts **multiple** sites (each isolated: own folder/port/service/DB/media).
