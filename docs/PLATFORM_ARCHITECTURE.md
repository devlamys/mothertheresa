# Mother Teresa Educational Global Trust Platform Architecture

## Implemented foundation

The application now has three connected surfaces:

1. Public study-abroad website and enquiry capture.
2. Staff ERP workspace for CRM, students, admissions, visa/document operations, finance, tasks, reporting, and access visibility.
3. Website content manager with centralized homepage publishing.

The React frontend is served from `dist/`. A same-origin PHP API under `api/` uses the XAMPP MariaDB service and normalized database migrations under `api/migrations/`.

## Local development

- Website: `http://localhost/mothertheresa/`
- API health: `http://localhost/mothertheresa/api/index.php?resource=health`
- Database: `mother_teresa_erp`
- Local staff demo: use the **Staff ERP** button in the website header.

The local demo session endpoint is enabled only because `api/config.local.php` sets `app_env` to `local`. That file must not be deployed. Production must provide its own database user and set `APP_ENV=production`.

## Database initialization

Run the migrations in order using the MariaDB client:

```powershell
Get-Content api\migrations\001_core_schema.sql -Raw | C:\xampp\mysql\bin\mysql.exe -u root
Get-Content api\migrations\002_demo_seed.sql -Raw | C:\xampp\mysql\bin\mysql.exe -u root
```

The schema currently contains 51 relational tables covering branches, users, multi-role RBAC, CRM, follow-ups, students, education, tests, destinations, universities, courses, shortlists, applications, offers, visas, documents, appointments, tasks, communications, invoices, payments, expenses, agents, commissions, HR records, notifications, audit activity, and CMS content.

## Security baseline

- PDO prepared statements and disabled emulated prepares.
- Same-origin session cookies with `HttpOnly` and `SameSite=Lax`.
- CSRF tokens for authenticated writes.
- Permission checks at API routes.
- Public enquiry rate limiting and duplicate email/phone detection.
- Server-side validation and field length limits.
- Immutable activity records for key workflow changes.
- Directory listing disabled and SQL/config downloads blocked.
- Production demo login disabled when `APP_ENV=production`.

Before internet deployment, add HTTPS, a dedicated least-privilege database user, secret management, backup storage, malware scanning for uploads, queue workers, real email/WhatsApp credentials, and an external security review.

## Phase boundary

This foundation does not claim the entire 100-section master plan is finished. Implemented modules are operational foundations; remaining phases include full profile CRUD, course rules, document upload/storage, offer and visa workflow editors, accounting transactions, HR/payroll, scheduled automations, full CMS entity builders, media processing, SEO routing, exports/PDFs, backups, and third-party communication integrations.
