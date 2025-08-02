#!/usr/bin/env python3
"""
Database Migration Script for DigitalOcean PostgreSQL
Run this script once your database connection is working
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

async def test_and_migrate():
    """Test database connection and run basic migrations"""
    
    print("🔍 Testing DigitalOcean PostgreSQL connection...")
    
    try:
        # Test connection with fixed SSL parameter
        connection_url = settings.DATABASE_URL.replace('+asyncpg', '').replace('ssl=require', 'sslmode=require')
        conn = await asyncpg.connect(connection_url)
        
        print("✅ Connected to DigitalOcean PostgreSQL!")
        
        # Get database info
        version = await conn.fetchval("SELECT version()")
        print(f"📊 Database Version: {version[:60]}...")
        
        db_name = await conn.fetchval("SELECT current_database()")
        user = await conn.fetchval("SELECT current_user")
        print(f"📦 Database: {db_name}")
        print(f"👤 User: {user}")
        
        # Create basic user table for authentication
        print("\n🔧 Creating authentication tables...")
        
        # Users table
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                is_active BOOLEAN DEFAULT true,
                is_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        print("✅ Users table created")
        
        # Create index for email lookup
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """)
        
        # Files table for DigitalOcean Spaces integration
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS files (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                filename VARCHAR(255) NOT NULL,
                original_filename VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size INTEGER NOT NULL,
                content_type VARCHAR(100),
                upload_status VARCHAR(50) DEFAULT 'uploaded',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        print("✅ Files table created")
        
        # Create test user
        print("\n👤 Creating test user...")
        
        # Check if test user exists
        existing_user = await conn.fetchval(
            "SELECT id FROM users WHERE email = $1", 
            "test@skillmatch.ai"
        )
        
        if not existing_user:
            # Hash password (simple for testing)
            import bcrypt
            password = "testpassword123"
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            user_id = await conn.fetchval("""
                INSERT INTO users (email, hashed_password, full_name, is_verified)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            """, "test@skillmatch.ai", hashed.decode('utf-8'), "Test User", True)
            
            print(f"✅ Test user created with ID: {user_id}")
            print("📧 Email: test@skillmatch.ai")
            print("🔑 Password: testpassword123")
        else:
            print("ℹ️ Test user already exists")
        
        # Test queries
        user_count = await conn.fetchval("SELECT COUNT(*) FROM users")
        print(f"👥 Total users: {user_count}")
        
        await conn.close()
        
        print("\n🎉 Database migration completed successfully!")
        print("\n🚀 Next steps:")
        print("1. Your FastAPI server is already running on http://localhost:8000")
        print("2. Test authentication at http://localhost:8000/docs")
        print("3. Use test@skillmatch.ai / testpassword123 to login")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check if your IP is whitelisted in DigitalOcean database firewall")
        print("2. Verify database is in 'Available' status")
        print("3. Check connection string in .env file")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_and_migrate())
    sys.exit(0 if success else 1)
