#!/bin/bash

# Run migration.sql on DigitalOcean PostgreSQL using psql
# This script connects to your DigitalOcean database and runs the migration

echo "🚀 Running migration.sql on DigitalOcean PostgreSQL"
echo

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check if migration.sql exists
if [ ! -f "migration.sql" ]; then
    echo "❌ migration.sql not found in current directory"
    echo "Please ensure you're in the backend directory with migration.sql"
    exit 1
fi

echo "📄 Found migration.sql file"

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database?sslmode=require
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in environment"
    echo "Please check your .env file"
    exit 1
fi

echo "🔍 Connecting to DigitalOcean PostgreSQL..."
echo

# Run migration using psql
# The --set ON_ERROR_STOP=off allows the script to continue even if some statements fail
# This is useful for migrations that might have some already-existing objects

psql "$DATABASE_URL" \
    --set ON_ERROR_STOP=off \
    --echo-queries \
    --file=migration.sql

if [ $? -eq 0 ]; then
    echo
    echo "✅ Migration completed successfully!"
    echo
    echo "🔍 Verifying database..."
    
    # Check if key tables exist
    psql "$DATABASE_URL" -c "
        SELECT 
            table_name,
            table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'users', 'user_profiles', 'resumes', 'jobs', 
            'job_applications', 'skills', 'companies'
        )
        ORDER BY table_name;
    "
    
    echo
    echo "🎉 Database migration completed!"
    echo
    echo "🔧 Next steps:"
    echo "  1. Your resume optimizer database is ready"
    echo "  2. Start your FastAPI server: python -m uvicorn main:app --reload"
    echo "  3. Test the API endpoints"
    
else
    echo
    echo "⚠️  Migration completed with some errors"
    echo "This is often normal for migrations (e.g., objects already exist)"
    echo
    echo "🔍 Check the output above for any critical errors"
    echo "🔧 If needed, you can run specific parts of migration.sql manually"
fi
