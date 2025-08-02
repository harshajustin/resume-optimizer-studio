#!/usr/bin/env python3
"""
Simple Database Connection Test for DigitalOcean PostgreSQL
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

async def test_connection():
    """Test database connection"""
    
    print("🔍 Testing DigitalOcean PostgreSQL connection...")
    print(f"🔗 Host: {settings.DATABASE_URL.split('@')[1].split(':')[0]}")
    
    try:
        # Remove +asyncpg for direct connection and fix SSL parameter
        connection_url = settings.DATABASE_URL.replace('+asyncpg', '').replace('ssl=require', 'sslmode=require')
        
        print(f"🔗 Connecting to: {connection_url.split('://')[1].split('@')[1]}")
        
        conn = await asyncpg.connect(connection_url)
        
        # Test basic query
        result = await conn.fetchval("SELECT 1")
        print(f"✅ Connection successful! Test query result: {result}")
        
        # Get database info
        version = await conn.fetchval("SELECT version()")
        print(f"📊 PostgreSQL Version: {version[:60]}...")
        
        # Get current database and user
        db_name = await conn.fetchval("SELECT current_database()")
        user = await conn.fetchval("SELECT current_user")
        print(f"📦 Database: {db_name}")
        print(f"👤 Current User: {user}")
        
        # Test permissions
        try:
            await conn.execute("CREATE TEMP TABLE test_table (id SERIAL);")
            await conn.execute("DROP TABLE test_table;")
            print("✅ Write permissions: OK")
        except Exception as perm_error:
            print(f"⚠️ Write permission issue: {perm_error}")
        
        await conn.close()
        
        print("\n🎉 Database connection test successful!")
        print("✅ Your DigitalOcean PostgreSQL database is ready to use!")
        
        return True
        
    except asyncio.TimeoutError:
        print("❌ Connection timeout")
        print("🔧 This usually means firewall is blocking the connection")
        return False
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Check if your IP is added to database firewall")
        print("2. Verify database status is 'Available' in DigitalOcean")
        print("3. Check connection details in .env file")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    if success:
        print("\n▶️ Run 'python migrate_db.py' to set up authentication tables")
    sys.exit(0 if success else 1)
