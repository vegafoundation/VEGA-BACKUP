# ROOT Decisions

Decisions made during ROOT consolidation.

---

## Structure Decisions

| Decision | Rationale |
|----------|-----------|
| Separate system/ from docs/ | Code and documentation serve different purposes |
| State in its own folder | Runtime state is distinct from source code |
| Meta for project info | Limitations and directions are not documentation |
| Exports for instructions | Export methods are operational, not architectural |

## Content Decisions

| Decision | Rationale |
|----------|-----------|
| Copy, not move | Preserve original structure outside ROOT |
| No DALL-E images in ROOT | Keep ROOT minimal, assets stay in assets/ |
| No node_modules | Regenerated on install |
| No .git in ROOT | Start fresh, avoid 8.8 GB history |

## Documentation Decisions

| Decision | Rationale |
|----------|-----------|
| Engineering tone | No metaphors, clear and direct |
| Reality map required | Must know what is real vs mock |
| Rebuild guide required | Must be able to recreate from scratch |
| Glossary required | Terms must be defined technically |

---

**ROOT is stable. Further work should branch, not overwrite.**
