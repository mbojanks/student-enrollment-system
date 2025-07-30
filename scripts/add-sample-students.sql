-- Add some sample student candidates for testing
-- Note: You'll need to create auth users first, then replace the UUIDs

-- Sample student data (replace UUIDs with actual ones from auth.users)
/*
-- Student 1: Marko Petrović
INSERT INTO student_candidates (
    user_id, first_name, last_name, date_of_birth, social_security_number,
    father_first_name, father_last_name, mother_first_name, mother_last_name,
    phone, email, previous_education_program, previous_education_institution,
    previous_education_start_year, previous_education_end_year
) VALUES (
    'student-uuid-1', 'Marko', 'Petrović', DATE '2002-03-15', '1503002123456',
    'Milan', 'Petrović', 'Jovana', 'Petrović', '+381-64-123-4567', 'marko.petrovic@example.com',
    'Mathematical Gymnasium', 'Mathematical Gymnasium "Mihailo Petrović Alas"', 2018, 2022
);

-- Student 2: Ana Nikolić
INSERT INTO student_candidates (
    user_id, first_name, last_name, date_of_birth, social_security_number,
    father_first_name, father_last_name, mother_first_name, mother_last_name,
    phone, email, previous_education_program, previous_education_institution,
    previous_education_start_year, previous_education_end_year
) VALUES (
    'student-uuid-2', 'Ana', 'Nikolić', DATE '2001-07-22', '2207001234567',
    'Petar', 'Nikolić', 'Marija', 'Nikolić', '+381-64-234-5678', 'ana.nikolic@example.com',
    'Medical High School', 'Medical High School Belgrade', 2017, 2021
);

-- Student 3: Stefan Jovanović
INSERT INTO student_candidates (
    user_id, first_name, last_name, date_of_birth, social_security_number,
    father_first_name, father_last_name, mother_first_name, mother_last_name,
    phone, email, previous_education_program, previous_education_institution,
    previous_education_start_year, previous_education_end_year
) VALUES (
    'student-uuid-3', 'Stefan', 'Jovanović', DATE '2002-11-08', '0811002345678',
    'Nikola', 'Jovanović', 'Jelena', 'Jovanović', '+381-64-345-6789', 'stefan.jovanovic@example.com',
    'Economics High School', 'Economics High School Belgrade', 2018, 2022
);
*/

-- Sample applications with scores (uncomment and adjust after creating students)
/*
-- Application 1: Marko applying for Computer Science
INSERT INTO applications (
    student_candidate_id, enrollment_deadline_id, study_program_id, ranking_mode_id,
    status, total_points, rank_position, financing_type
) 
SELECT 
    sc.id, ed.id, sp.id, rm.id,
    'pending', 85.5, 15, 'budget'
FROM student_candidates sc, enrollment_deadlines ed, study_programs sp, ranking_modes rm
WHERE sc.first_name = 'Marko' AND sc.last_name = 'Petrović'
AND ed.name = 'Fall 2024 Enrollment'
AND sp.name = 'Computer Science and Engineering'
AND rm.name = 'Technical Studies Ranking';

-- Application 2: Ana applying for Medicine
INSERT INTO applications (
    student_candidate_id, enrollment_deadline_id, study_program_id, ranking_mode_id,
    status, total_points, rank_position, financing_type
) 
SELECT 
    sc.id, ed.id, sp.id, rm.id,
    'pending', 92.3, 8, 'budget'
FROM student_candidates sc, enrollment_deadlines ed, study_programs sp, ranking_modes rm
WHERE sc.first_name = 'Ana' AND sc.last_name = 'Nikolić'
AND ed.name = 'Fall 2024 Enrollment'
AND sp.name = 'Medicine'
AND rm.name = 'Medical Studies Ranking';

-- Application 3: Stefan applying for Economics
INSERT INTO applications (
    student_candidate_id, enrollment_deadline_id, study_program_id, ranking_mode_id,
    status, total_points, rank_position, financing_type
) 
SELECT 
    sc.id, ed.id, sp.id, rm.id,
    'accepted', 78.2, 25, 'self_financing'
FROM student_candidates sc, enrollment_deadlines ed, study_programs sp, ranking_modes rm
WHERE sc.first_name = 'Stefan' AND sc.last_name = 'Jovanović'
AND ed.name = 'Fall 2024 Enrollment'
AND sp.name = 'Economics'
AND rm.name = 'Economics Studies Ranking';
*/
