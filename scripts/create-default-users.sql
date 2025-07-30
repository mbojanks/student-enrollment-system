-- This script creates default users for testing
-- Note: You'll need to run this after creating the auth users in Supabase

-- First, you need to create these users in Supabase Auth (through the dashboard or API):
-- 1. admin@university.edu (password: admin123)
-- 2. service@university.edu (password: service123)  
-- 3. student@university.edu (password: student123)

-- After creating the auth users, get their UUIDs from the auth.users table
-- and replace the UUIDs below with the actual ones

-- Example of how to insert user profiles after auth users are created:
-- Replace 'your-admin-uuid-here' with actual UUID from auth.users

/*
-- Admin user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-admin-uuid-here', 'admin@university.edu', 'System', 'Administrator', 'admin');

-- Service user profile  
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-service-uuid-here', 'service@university.edu', 'Service', 'Staff', 'service');

-- Student user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-student-uuid-here', 'student@university.edu', 'John', 'Doe', 'student');

-- Sample student candidate data for the student user
INSERT INTO student_candidates (
    user_id, 
    first_name, 
    last_name, 
    date_of_birth, 
    social_security_number,
    father_first_name,
    father_last_name, 
    mother_first_name,
    mother_last_name,
    phone, 
    email,
    previous_education_program,
    previous_education_institution,
    previous_education_start_year,
    previous_education_end_year
) VALUES (
    'your-student-uuid-here',
    'John',
    'Doe', 
    DATE '2000-05-15',
    '1234567890',
    'Robert',
    'Doe',
    'Mary', 
    'Doe',
    '+1-555-0123',
    'student@university.edu',
    'General High School Program',
    'Central High School',
    2016,
    2020
);
*/
