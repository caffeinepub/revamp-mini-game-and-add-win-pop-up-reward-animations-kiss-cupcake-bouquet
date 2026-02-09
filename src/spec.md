# Specification

## Summary
**Goal:** Restore owner/admin content management so the intended owner can reliably add, edit, delete, and reorder pictures and messages without unauthorized errors.

**Planned changes:**
- Fix backend authorization/bootstrap so the intended owner account is recognized as admin and can use admin-only mutations for pictures and messages.
- Add admin-only backend query endpoints to fetch the full list of pictures and messages, and update the Owner Editor Panel hooks to use these admin queries.
- Improve owner editing UX: clearly message authenticated non-admin users that content management is owner-only, and show actionable error messages when mutations fail.

**User-visible outcome:** The intended owner can load all existing pictures/messages in the editor and successfully add/update/delete/reorder them; non-admin users see clear “owner-only” messaging and meaningful errors when an action is unauthorized.
