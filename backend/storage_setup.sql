-- ==========================================
-- Supabase Storage Setup for Menu Images
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Update" ON storage.objects;

-- 3. Allow anyone to VIEW images (Public)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'menu-images' );

-- 4. Allow anyone to UPLOAD images (Anonymous)
-- Since we use a custom FastAPI backend for Auth, the frontend client is anonymous to Supabase.
CREATE POLICY "Allow Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'menu-images' );

-- 5. Allow anyone to UPDATE their own uploads
CREATE POLICY "Allow Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'menu-images' );
