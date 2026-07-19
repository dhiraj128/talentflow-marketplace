# Administrator Recovery

## Purpose
This script provides a safe, idempotent mechanism to recover or provision the root Administrator account in production environments. It ensures the `demo@admin.com` account exists, holds the `ADMIN` role, and has a synchronized password, without overwriting or duplicating existing users, candidate data, or employer data.

## When to use
Use this script only when the Administrator account is missing in a production or staging database (for example, if Prisma seeds were correctly skipped during deployment) and you need initial platform access.

## Required environment variables
- `DATABASE_URL`: Must point directly to the PostgreSQL database where you want to provision the admin account.

## How to run locally
If you need to run this against your local development database, execute:
```bash
npm run recover:admin
```
*(This uses the `DATABASE_URL` specified in your local `.env` file).*

## How to run against Render Production
To execute this script securely against the live production database without modifying your local `.env`, run the command while injecting the production environment variable inline:

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="<YOUR_RENDER_POSTGRES_URL>"; npm run recover:admin
```

**Mac/Linux (Bash):**
```bash
DATABASE_URL="<YOUR_RENDER_POSTGRES_URL>" npm run recover:admin
```

## Expected output
Upon success, the script will output:
```
[Admin Recovery] Initiating recovery for demo@admin.com...
[Admin Recovery] SUCCESS
- User ID: <uuid>
- Email: demo@admin.com
- Role: ADMIN
- Verified: true
```

## Safety guarantees
- **Idempotency**: This script uses Prisma's `upsert` mechanism. It is 100% safe to run multiple times. If the user already exists, it will only update their password hash and ensure they maintain the `ADMIN` role.
- **Data Integrity**: The script strictly targets the `demo@admin.com` record. It does not manipulate candidate profiles, employer profiles, or general mock data.
- **Security**: The password is encrypted dynamically using `bcrypt` during execution. Plaintext passwords are not transmitted to the database.
- **Deployment**: This script is deliberately excluded from the standard CI/CD deployment pipeline to prevent automated overwriting of credentials.

## Rollback considerations
- This script modifies a single user record. There is no automated rollback script required.
- If the `demo@admin.com` account needs to be completely removed from the production database later, you can securely remove it by accessing Prisma Studio and deleting the corresponding row in the `User` table.

## Verification steps
1. Check the console output for `[Admin Recovery] SUCCESS`.
2. Attempt to log in to the production frontend or via Postman using `POST /api/v1/auth/login` with `demo@admin.com` and `password123`.
3. The server should return a `200 OK` or `201 Created` with a valid JWT access token.
