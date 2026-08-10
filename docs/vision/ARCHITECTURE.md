<!-- Reconstructed from the original Portfolio_Claude_Docs.zip, which is no
     longer on disk. Content is verbatim as read on 2026-08-02; only this note
     was added. -->

# Architecture

Recommended:
Frontend -> API -> Database -> Object Storage

Use a headless CMS approach.

Public site consumes APIs only.
Admin updates data through secure APIs.

Separate:
- Content
- Media
- Authentication
- AI
- Resume
- Analytics
