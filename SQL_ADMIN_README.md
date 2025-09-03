# SQL Admin Panel

This feature adds a secure SQL query interface for database administration.

## Features

- **Secure Authentication**: Only authenticated users with admin privileges can access the SQL panel
- **Full SQL Access**: All SQL commands are allowed for administrators (SELECT, INSERT, UPDATE, DELETE, etc.)
- **Real-time Results**: Execute queries and view results in a formatted table
- **Error Handling**: Comprehensive error messages for debugging

## Setup

1. **Environment Variables**: Add admin email addresses to your `.env` file:
   ```
   ADMIN_EMAILS=admin@yourdomain.com,admin2@yourdomain.com
   ```

2. **Access**: Navigate to `/admin/sql` when logged in with an admin account

## Troubleshooting

**Issue**: Accessing `/admin/sql` redirects to homepage
- **Solution**: Ensure you're accessing the admin panel on the main application domain (not a custom domain)
- **Note**: Admin routes are protected by middleware and only work on the primary application domains

## Security

- All SQL commands are permitted for administrators
- Admin access is controlled via environment variables
- All queries are logged for audit purposes
- Authentication is required via NextAuth session
- **CAUTION**: Use with extreme care as modifications can be irreversible

## Usage Examples

### Read Operations
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

### Write Operations (Use with caution)
```sql
-- Update user information
UPDATE "User" SET name = 'Updated Name' WHERE id = 123;

-- Insert new record
INSERT INTO "KyteProd" (userId, email, name) VALUES ('user123', 'test@example.com', 'Test User');

-- Delete old records
DELETE FROM "HitPage" WHERE timestamp < '2023-01-01';

-- Create indexes for performance
CREATE INDEX idx_user_email ON "User" (email);
```

## Technical Details

- **API Endpoint**: `/api/admin/sql`
- **Frontend Page**: `/pages/admin/sql.tsx`
- **Database Access**: Uses Prisma's `$queryRawUnsafe()` method
- **Response Format**: JSON with success status, data array, and metadata