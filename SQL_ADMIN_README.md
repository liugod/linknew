# SQL Admin Panel

This feature adds a secure SQL query interface for database administration.

## Features

- **Secure Authentication**: Only authenticated users with admin privileges can access the SQL panel
- **Query Restrictions**: Only SELECT queries are allowed for security purposes
- **Real-time Results**: Execute queries and view results in a formatted table
- **Error Handling**: Comprehensive error messages for debugging

## Setup

1. **Environment Variables**: Add admin email addresses to your `.env` file:
   ```
   ADMIN_EMAILS=admin@yourdomain.com,admin2@yourdomain.com
   ```

2. **Access**: Navigate to `/admin/sql` when logged in with an admin account

## Security

- Only SELECT statements are permitted
- Admin access is controlled via environment variables
- All queries are logged for audit purposes
- Authentication is required via NextAuth session

## Usage Examples

```sql
-- List all users
SELECT id, email, name FROM "User" LIMIT 10;

-- Check user counts
SELECT COUNT(*) as total_users FROM "User";

-- View recent page hits
SELECT * FROM "HitPage" ORDER BY timestamp DESC LIMIT 20;

-- Check active kytes
SELECT username, name, "createdAt" FROM "KyteProd" WHERE username IS NOT NULL;
```

## Technical Details

- **API Endpoint**: `/api/admin/sql`
- **Frontend Page**: `/pages/admin/sql.tsx`
- **Database Access**: Uses Prisma's `$queryRawUnsafe()` method
- **Response Format**: JSON with success status, data array, and metadata