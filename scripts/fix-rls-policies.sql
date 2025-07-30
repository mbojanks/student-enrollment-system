-- Fix RLS policies to allow users to create their own profiles

-- Allow users to insert their own profile
CREATE POLICY "Users can create their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own student candidate record
CREATE POLICY "Users can create their own student record" ON student_candidates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Alternatively, if you want to temporarily disable RLS for testing:
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE student_candidates DISABLE ROW LEVEL SECURITY;

-- You can re-enable it later with:
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE student_candidates ENABLE ROW LEVEL SECURITY;
