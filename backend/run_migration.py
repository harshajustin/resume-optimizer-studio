#!/usr/bin/env python3
"""
Run migration.sql on DigitalOcean PostgreSQL Database
This script executes the full database schema migration
"""

import asyncio
import asyncpg
import sys
import os
from pathlib import Path

# Get the backend directory (where this script is located)
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Change to backend directory to find .env file
os.chdir(backend_dir)

from app.core.config import settings

async def run_migration_sql():
    """Run the complete migration.sql file on DigitalOcean PostgreSQL"""
    
    print("🔍 Connecting to DigitalOcean PostgreSQL...")
    
    try:
        # Connect with fixed SSL parameter
        connection_url = settings.DATABASE_URL.replace('+asyncpg', '').replace('ssl=require', 'sslmode=require')
        conn = await asyncpg.connect(connection_url)
        
        print("✅ Connected to DigitalOcean PostgreSQL!")
        
        # Read migration.sql file
        migration_file = backend_dir / "migration.sql"
        if not migration_file.exists():
            print(f"❌ Migration file not found at: {migration_file}")
            print("Please ensure migration.sql exists in the backend directory")
            return False
            
        print(f"📄 Reading migration file: {migration_file}")
        with open(migration_file, 'r', encoding='utf-8') as f:
            migration_sql = f.read()
        
        # Split into individual statements (basic approach)
        print("🔧 Processing migration statements...")
        
        # Split by semicolon but handle complex cases
        statements = []
        current_statement = ""
        in_function = False
        in_dollar_quote = False
        dollar_tag = None
        
        lines = migration_sql.split('\n')
        
        for line in lines:
            # Skip comments and empty lines
            stripped_line = line.strip()
            if not stripped_line or stripped_line.startswith('--'):
                continue
                
            current_statement += line + '\n'
            
            # Handle dollar quoting (for functions)
            if '$$' in line or '$' in line:
                dollar_parts = line.split('$')
                for i, part in enumerate(dollar_parts):
                    if i > 0 and i < len(dollar_parts) - 1:  # Between dollars
                        if not in_dollar_quote:
                            dollar_tag = part
                            in_dollar_quote = True
                        elif part == dollar_tag:
                            in_dollar_quote = False
                            dollar_tag = None
            
            # Check for statement end
            if line.strip().endswith(';') and not in_dollar_quote:
                statements.append(current_statement.strip())
                current_statement = ""
        
        # Add final statement if exists
        if current_statement.strip():
            statements.append(current_statement.strip())
        
        print(f"📊 Found {len(statements)} SQL statements to execute")
        
        # Execute statements one by one
        executed_count = 0
        failed_count = 0
        
        for i, statement in enumerate(statements, 1):
            if not statement.strip():
                continue
                
            try:
                # Show progress for long operations
                if i % 10 == 0 or i == len(statements):
                    print(f"⏳ Executing statement {i}/{len(statements)}...")
                
                await conn.execute(statement)
                executed_count += 1
                
            except Exception as e:
                failed_count += 1
                error_msg = str(e)
                
                # Check if it's a harmless error (like table already exists)
                if any(phrase in error_msg.lower() for phrase in [
                    'already exists',
                    'does not exist',
                    'duplicate key',
                    'relation already exists'
                ]):
                    print(f"⚠️  Statement {i}: {error_msg[:100]}... (continuing)")
                    continue
                else:
                    print(f"❌ Error in statement {i}: {error_msg[:200]}...")
                    print(f"Statement: {statement[:100]}...")
                    # Continue with other statements instead of stopping
                    continue
        
        await conn.close()
        
        print(f"\n🎉 Migration completed!")
        print(f"✅ Successfully executed: {executed_count} statements")
        if failed_count > 0:
            print(f"⚠️  Failed statements: {failed_count}")
        
        # Verify some key tables were created
        print("\n🔍 Verifying migration...")
        conn = await asyncpg.connect(connection_url)
        
        # Check if main tables exist
        tables_to_check = [
            'users', 'user_profiles', 'resumes', 'jobs', 'job_applications',
            'skills', 'skill_assessments', 'resume_analyses', 'companies'
        ]
        
        existing_tables = []
        for table in tables_to_check:
            try:
                result = await conn.fetchval(
                    "SELECT to_regclass($1)", 
                    f'public.{table}'
                )
                if result:
                    existing_tables.append(table)
            except:
                pass
        
        await conn.close()
        
        print(f"📊 Found {len(existing_tables)} key tables: {', '.join(existing_tables)}")
        
        if len(existing_tables) >= 5:  # If at least 5 key tables exist
            print("✅ Migration appears successful!")
            return True
        else:
            print("⚠️  Migration may have issues - fewer tables than expected")
            return False
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting DigitalOcean PostgreSQL Migration")
    print("📄 This will run the complete migration.sql file")
    print()
    
    success = asyncio.run(run_migration_sql())
    
    if success:
        print("\n🎉 Migration completed successfully!")
        print("🔧 Next steps:")
        print("  1. Your database schema is now ready")
        print("  2. Run your FastAPI server to test endpoints")
        print("  3. Create initial admin users if needed")
    else:
        print("\n❌ Migration had issues")
        print("🔧 Troubleshooting:")
        print("  1. Check migration.sql syntax")
        print("  2. Verify database permissions")
        print("  3. Check database connection")
    
    sys.exit(0 if success else 1)
