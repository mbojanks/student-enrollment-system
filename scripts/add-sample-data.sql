-- Add sample institutions
INSERT INTO institutions (name, address, phone, bank_account) VALUES
('University of Technology Belgrade', 'Bulevar kralja Aleksandra 73, Belgrade', '+381-11-3218-000', 'RS35160005601001611379'),
('Faculty of Medicine Belgrade', 'Dr Subotića 8, Belgrade', '+381-11-3636-300', 'RS35160005601001611380'),
('Faculty of Economics Belgrade', 'Kamenička 6, Belgrade', '+381-11-3021-000', 'RS35160005601001611381'),
('Novi Sad University', 'Dr Zorana Đinđića 1, Novi Sad', '+381-21-485-2000', 'RS35340061000028646'),
('Niš University', 'Univerzitetski trg 2, Niš', '+381-18-257-950', 'RS35310007000016687');

-- Add sample ranking criteria
INSERT INTO ranking_criteria (name, description, min_value, max_value) VALUES
('High School Grade 1st Year', 'Average grade from 1st year of high school', 2.00, 5.00),
('High School Grade 2nd Year', 'Average grade from 2nd year of high school', 2.00, 5.00),
('High School Grade 3rd Year', 'Average grade from 3rd year of high school', 2.00, 5.00),
('High School Grade 4th Year', 'Average grade from 4th year of high school', 2.00, 5.00),
('Mathematics Entrance Exam', 'Mathematics entrance examination score', 0.00, 60.00),
('Physics Entrance Exam', 'Physics entrance examination score', 0.00, 60.00),
('Chemistry Entrance Exam', 'Chemistry entrance examination score', 0.00, 60.00),
('Biology Entrance Exam', 'Biology entrance examination score', 0.00, 60.00),
('Serbian Language Exam', 'Serbian language and literature exam', 0.00, 60.00),
('English Language Exam', 'English language proficiency exam', 0.00, 60.00),
('Bachelor Degree Grade', 'Average grade from bachelor studies', 6.00, 10.00),
('Bachelor Thesis Grade', 'Grade from bachelor thesis defense', 6.00, 10.00);

-- Add sample ranking modes
INSERT INTO ranking_modes (name, description, max_total_points) VALUES
('Technical Studies Ranking', 'Ranking for engineering and technical programs', 100.00),
('Medical Studies Ranking', 'Ranking for medical and health programs', 120.00),
('Economics Studies Ranking', 'Ranking for economics and business programs', 100.00),
('Master Studies Ranking', 'General ranking for master degree programs', 100.00),
('Natural Sciences Ranking', 'Ranking for natural sciences programs', 110.00);

-- Add sample study programs
INSERT INTO study_programs (name, education_level, institution_id, accreditation_valid_until, enrollment_school_year)
SELECT 
    'Computer Science and Engineering', 
    'bachelor', 
    i.id, 
    DATE '2028-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'University of Technology Belgrade'
UNION ALL
SELECT 
    'Electrical Engineering', 
    'bachelor', 
    i.id, 
    DATE '2028-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'University of Technology Belgrade'
UNION ALL
SELECT 
    'Software Engineering', 
    'master', 
    i.id, 
    DATE '2027-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'University of Technology Belgrade'
UNION ALL
SELECT 
    'Medicine', 
    'bachelor', 
    i.id, 
    DATE '2029-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Faculty of Medicine Belgrade'
UNION ALL
SELECT 
    'Dentistry', 
    'bachelor', 
    i.id, 
    DATE '2029-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Faculty of Medicine Belgrade'
UNION ALL
SELECT 
    'Economics', 
    'bachelor', 
    i.id, 
    DATE '2027-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Faculty of Economics Belgrade'
UNION ALL
SELECT 
    'Business Administration', 
    'master', 
    i.id, 
    DATE '2027-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Faculty of Economics Belgrade'
UNION ALL
SELECT 
    'Information Technology', 
    'bachelor', 
    i.id, 
    DATE '2028-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Novi Sad University'
UNION ALL
SELECT 
    'Mathematics', 
    'bachelor', 
    i.id, 
    DATE '2028-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Niš University'
UNION ALL
SELECT 
    'Physics', 
    'bachelor', 
    i.id, 
    DATE '2028-12-31', 
    '2024/2025'
FROM institutions i WHERE i.name = 'Niš University';

-- Add sample enrollment deadlines
INSERT INTO enrollment_deadlines (name, school_year, deadline_date, committee_head_first_name, committee_head_last_name) VALUES
('Spring 2024 Enrollment', '2024/2025', DATE '2024-06-15', 'Marko', 'Petrović'),
('Fall 2024 Enrollment', '2024/2025', DATE '2024-09-15', 'Ana', 'Nikolić'),
('Winter 2025 Enrollment', '2024/2025', DATE '2025-01-15', 'Stefan', 'Jovanović'),
('Spring 2025 Enrollment', '2025/2026', DATE '2025-06-15', 'Milica', 'Stojanović'),
('Fall 2025 Enrollment', '2025/2026', DATE '2025-09-15', 'Nikola', 'Mitrović');

-- Link ranking criteria to ranking modes with multiplication factors

-- Technical Studies Ranking (Computer Science, Electrical Engineering, IT)
INSERT INTO ranking_mode_criteria (ranking_mode_id, ranking_criteria_id, multiplication_factor)
SELECT 
    rm.id,
    rc.id,
    CASE 
        WHEN rc.name = 'High School Grade 1st Year' THEN 1.5
        WHEN rc.name = 'High School Grade 2nd Year' THEN 1.5
        WHEN rc.name = 'High School Grade 3rd Year' THEN 2.0
        WHEN rc.name = 'High School Grade 4th Year' THEN 2.0
        WHEN rc.name = 'Mathematics Entrance Exam' THEN 1.0
        WHEN rc.name = 'Physics Entrance Exam' THEN 1.0
        ELSE 0.0
    END
FROM ranking_modes rm
CROSS JOIN ranking_criteria rc
WHERE rm.name = 'Technical Studies Ranking'
AND rc.name IN (
    'High School Grade 1st Year',
    'High School Grade 2nd Year', 
    'High School Grade 3rd Year',
    'High School Grade 4th Year',
    'Mathematics Entrance Exam',
    'Physics Entrance Exam'
);

-- Medical Studies Ranking
INSERT INTO ranking_mode_criteria (ranking_mode_id, ranking_criteria_id, multiplication_factor)
SELECT 
    rm.id,
    rc.id,
    CASE 
        WHEN rc.name = 'High School Grade 1st Year' THEN 1.5
        WHEN rc.name = 'High School Grade 2nd Year' THEN 1.5
        WHEN rc.name = 'High School Grade 3rd Year' THEN 2.0
        WHEN rc.name = 'High School Grade 4th Year' THEN 2.0
        WHEN rc.name = 'Chemistry Entrance Exam' THEN 1.2
        WHEN rc.name = 'Biology Entrance Exam' THEN 1.2
        WHEN rc.name = 'Mathematics Entrance Exam' THEN 0.8
        ELSE 0.0
    END
FROM ranking_modes rm
CROSS JOIN ranking_criteria rc
WHERE rm.name = 'Medical Studies Ranking'
AND rc.name IN (
    'High School Grade 1st Year',
    'High School Grade 2nd Year', 
    'High School Grade 3rd Year',
    'High School Grade 4th Year',
    'Chemistry Entrance Exam',
    'Biology Entrance Exam',
    'Mathematics Entrance Exam'
);

-- Economics Studies Ranking
INSERT INTO ranking_mode_criteria (ranking_mode_id, ranking_criteria_id, multiplication_factor)
SELECT 
    rm.id,
    rc.id,
    CASE 
        WHEN rc.name = 'High School Grade 1st Year' THEN 1.5
        WHEN rc.name = 'High School Grade 2nd Year' THEN 1.5
        WHEN rc.name = 'High School Grade 3rd Year' THEN 2.0
        WHEN rc.name = 'High School Grade 4th Year' THEN 2.0
        WHEN rc.name = 'Mathematics Entrance Exam' THEN 1.0
        WHEN rc.name = 'Serbian Language Exam' THEN 0.8
        WHEN rc.name = 'English Language Exam' THEN 0.6
        ELSE 0.0
    END
FROM ranking_modes rm
CROSS JOIN ranking_criteria rc
WHERE rm.name = 'Economics Studies Ranking'
AND rc.name IN (
    'High School Grade 1st Year',
    'High School Grade 2nd Year', 
    'High School Grade 3rd Year',
    'High School Grade 4th Year',
    'Mathematics Entrance Exam',
    'Serbian Language Exam',
    'English Language Exam'
);

-- Master Studies Ranking
INSERT INTO ranking_mode_criteria (ranking_mode_id, ranking_criteria_id, multiplication_factor)
SELECT 
    rm.id,
    rc.id,
    CASE 
        WHEN rc.name = 'Bachelor Degree Grade' THEN 4.0
        WHEN rc.name = 'Bachelor Thesis Grade' THEN 2.0
        WHEN rc.name = 'English Language Exam' THEN 1.0
        ELSE 0.0
    END
FROM ranking_modes rm
CROSS JOIN ranking_criteria rc
WHERE rm.name = 'Master Studies Ranking'
AND rc.name IN (
    'Bachelor Degree Grade',
    'Bachelor Thesis Grade',
    'English Language Exam'
);

-- Natural Sciences Ranking
INSERT INTO ranking_mode_criteria (ranking_mode_id, ranking_criteria_id, multiplication_factor)
SELECT 
    rm.id,
    rc.id,
    CASE 
        WHEN rc.name = 'High School Grade 1st Year' THEN 1.5
        WHEN rc.name = 'High School Grade 2nd Year' THEN 1.5
        WHEN rc.name = 'High School Grade 3rd Year' THEN 2.0
        WHEN rc.name = 'High School Grade 4th Year' THEN 2.0
        WHEN rc.name = 'Mathematics Entrance Exam' THEN 1.2
        WHEN rc.name = 'Physics Entrance Exam' THEN 1.0
        WHEN rc.name = 'Chemistry Entrance Exam' THEN 0.8
        ELSE 0.0
    END
FROM ranking_modes rm
CROSS JOIN ranking_criteria rc
WHERE rm.name = 'Natural Sciences Ranking'
AND rc.name IN (
    'High School Grade 1st Year',
    'High School Grade 2nd Year', 
    'High School Grade 3rd Year',
    'High School Grade 4th Year',
    'Mathematics Entrance Exam',
    'Physics Entrance Exam',
    'Chemistry Entrance Exam'
);

-- Link study programs to ranking modes with available places

-- Computer Science and Engineering -> Technical Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    120, -- budget places
    80   -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Computer Science and Engineering'
AND rm.name = 'Technical Studies Ranking';

-- Electrical Engineering -> Technical Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    100, -- budget places
    60   -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Electrical Engineering'
AND rm.name = 'Technical Studies Ranking';

-- Software Engineering (Master) -> Master Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    40, -- budget places
    30  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Software Engineering'
AND rm.name = 'Master Studies Ranking';

-- Medicine -> Medical Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    180, -- budget places
    50   -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Medicine'
AND rm.name = 'Medical Studies Ranking';

-- Dentistry -> Medical Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    60, -- budget places
    30  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Dentistry'
AND rm.name = 'Medical Studies Ranking';

-- Economics -> Economics Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    150, -- budget places
    100  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Economics'
AND rm.name = 'Economics Studies Ranking';

-- Business Administration (Master) -> Master Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    50, -- budget places
    40  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Business Administration'
AND rm.name = 'Master Studies Ranking';

-- Information Technology -> Technical Studies Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    80, -- budget places
    50  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Information Technology'
AND rm.name = 'Technical Studies Ranking';

-- Mathematics -> Natural Sciences Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    60, -- budget places
    30  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Mathematics'
AND rm.name = 'Natural Sciences Ranking';

-- Physics -> Natural Sciences Ranking
INSERT INTO study_program_ranking_modes (study_program_id, ranking_mode_id, budget_places, self_financing_places)
SELECT 
    sp.id,
    rm.id,
    50, -- budget places
    25  -- self-financing places
FROM study_programs sp
CROSS JOIN ranking_modes rm
WHERE sp.name = 'Physics'
AND rm.name = 'Natural Sciences Ranking';
