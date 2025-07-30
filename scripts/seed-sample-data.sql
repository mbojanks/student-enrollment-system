-- Insert sample institutions
INSERT INTO institutions (name, address, phone, bank_account) VALUES
('University of Technology', '123 Tech Street, Tech City', '+1-555-0101', '1234567890123456'),
('State University', '456 Education Ave, University Town', '+1-555-0102', '2345678901234567'),
('Medical College', '789 Health Blvd, Medical District', '+1-555-0103', '3456789012345678');

-- Insert sample ranking criteria
INSERT INTO ranking_criteria (name, description, min_value, max_value) VALUES
('High School Grade 1st Year', 'Average grade from 1st year of high school', 2.00, 5.00),
('High School Grade 2nd Year', 'Average grade from 2nd year of high school', 2.00, 5.00),
('High School Grade 3rd Year', 'Average grade from 3rd year of high school', 2.00, 5.00),
('High School Grade 4th Year', 'Average grade from 4th year of high school', 2.00, 5.00),
('Mathematics Entrance Exam', 'Mathematics entrance examination score', 0.00, 60.00),
('Physics Entrance Exam', 'Physics entrance examination score', 0.00, 60.00),
('Chemistry Entrance Exam', 'Chemistry entrance examination score', 0.00, 60.00);

-- Insert sample ranking modes
INSERT INTO ranking_modes (name, description, max_total_points) VALUES
('Standard Academic Ranking', 'Standard ranking based on high school grades and entrance exam', 100.00),
('STEM Focus Ranking', 'Ranking with emphasis on science and mathematics', 100.00),
('Medical Program Ranking', 'Specialized ranking for medical programs', 120.00);

-- Get IDs for the inserted data (you would need to adjust these based on actual UUIDs)
-- For demonstration, we'll use variables that would be replaced with actual UUIDs

-- Insert sample study programs
INSERT INTO study_programs (name, education_level, institution_id, accreditation_valid_until, enrollment_school_year)
SELECT 
    'Computer Science', 
    'bachelor', 
    i.id, 
    DATE '2028-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'University of Technology'
UNION ALL
SELECT 
    'Software Engineering', 
    'master', 
    i.id, 
    DATE '2027-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'University of Technology'
UNION ALL
SELECT 
    'Medicine', 
    'bachelor', 
    i.id, 
    DATE '2029-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Medical College';

-- Insert sample enrollment deadlines
INSERT INTO enrollment_deadlines (name, school_year, deadline_date, committee_head_first_name, committee_head_last_name) VALUES
('Spring 2024 Enrollment', '2024/2025', DATE '2024-06-15', 'John', 'Smith'),
('Fall 2024 Enrollment', '2024/2025', DATE '2024-09-15', 'Jane', 'Johnson'),
('Spring 2025 Enrollment', '2025/2026', DATE '2025-01-15', 'Robert', 'Brown');

-- Link ranking criteria to ranking modes with multiplication factors
INSERT INTO ranking_mode_criteria (ranking_mode_id, ranking_criteria_id, multiplication_factor)
SELECT 
    rm.id,
    rc.id,
    CASE 
        WHEN rc.name LIKE 'High School Grade%' THEN 2.0
        WHEN rc.name LIKE '%Entrance Exam' THEN 1.0
        ELSE 1.0
    END
FROM ranking_modes rm
CROSS JOIN ranking_criteria rc
WHERE rm.name = 'Standard Academic Ranking'
AND rc.name IN (
    'High School Grade 1st Year',
    'High School Grade 2nd Year', 
    'High School Grade 3rd Year',
    'High School Grade 4th Year',
    'Mathematics Entrance Exam'
);

-- Link study programs to ranking modes
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    25, -- budget places
    15  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name IN ('Computer Science', 'Software Engineering')
AND rm.name = 'Standard Academic Ranking';

-- Insert sample admin user profile (you'll need to create the auth user first)
-- This would typically be done through Supabase Auth UI or API
-- INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
-- ('your-admin-user-uuid', 'admin@university.edu', 'Admin', 'User', 'admin');
