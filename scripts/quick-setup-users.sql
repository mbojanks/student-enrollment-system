-- Quick setup script to create user profiles for existing auth users
-- Run this if you already have auth users created in Supabase

-- First, check what auth users exist:
SELECT id, email, created_at FROM auth.users ORDER BY created_at;

-- Then create profiles for existing users (replace UUIDs with actual ones from above query)

-- Example: If you have users with these emails, replace the UUIDs:

-- For admin@university.edu user:
-- INSERT INTO user_profiles (user_id, email, first_name, last_name, role) 
-- SELECT id, email, 'System', 'Administrator', 'admin' 
-- FROM auth.users WHERE email = 'admin@university.edu';

-- For service@university.edu user:
-- INSERT INTO user_profiles (user_id, email, first_name, last_name, role) 
-- SELECT id, email, 'Service', 'Staff', 'service' 
-- FROM auth.users WHERE email = 'service@university.edu';

-- For student@university.edu user:
-- INSERT INTO user_profiles (user_id, email, first_name, last_name, role) 
-- SELECT id, email, 'John', 'Doe', 'student' 
-- FROM auth.users WHERE email = 'student@university.edu';

-- Create student candidate record for student user:
-- INSERT INTO student_candidates (
--     user_id, first_name, last_name, date_of_birth, social_security_number,
--     father_first_name, father_last_name, mother_first_name, mother_last_name,
--     phone, email, previous_education_program, previous_education_institution,
--     previous_education_start_year, previous_education_end_year
-- ) 
-- SELECT 
--     id, 'John', 'Doe', DATE '2000-05-15', '1234567890',
--     'Robert', 'Doe', 'Mary', 'Doe', '+1-555-0123', email,
--     'General High School Program', 'Central High School', 2016, 2020
-- FROM auth.users WHERE email = 'student@university.edu';

-- Alternative: Create profiles for ALL existing auth users as admins (be careful with this!)
-- INSERT INTO user_profiles (user_id, email, first_name, last_name, role)
-- SELECT id, email, 'User', split_part(email, '@', 1), 'admin'
-- FROM auth.users 
-- WHERE id NOT IN (SELECT user_id FROM user_profiles);
