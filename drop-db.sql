-- WARNING: This will delete ALL data and tables in your public schema.
-- Run this in the Supabase Dashboard -> SQL Editor

-- Drop the entire public schema and all its contents
DROP SCHEMA public CASCADE;

-- Recreate the public schema
CREATE SCHEMA public;

-- Restore default permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
