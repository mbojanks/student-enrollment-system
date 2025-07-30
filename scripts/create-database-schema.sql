-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'service', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Institutions table
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    bank_account VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study programs table
CREATE TABLE study_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    education_level VARCHAR(20) NOT NULL CHECK (education_level IN ('bachelor', 'master')),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    accreditation_valid_until DATE NOT NULL,
    enrollment_school_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollment deadlines table
CREATE TABLE enrollment_deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    school_year VARCHAR(20) NOT NULL,
    deadline_date DATE NOT NULL,
    committee_head_first_name VARCHAR(100) NOT NULL,
    committee_head_last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ranking criteria table
CREATE TABLE ranking_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    min_value DECIMAL(5,2) NOT NULL DEFAULT 0,
    max_value DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ranking modes table
CREATE TABLE ranking_modes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    max_total_points DECIMAL(6,2) NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ranking mode criteria (junction table with multiplication factors)
CREATE TABLE ranking_mode_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ranking_mode_id UUID REFERENCES ranking_modes(id) ON DELETE CASCADE,
    ranking_criteria_id UUID REFERENCES ranking_criteria(id) ON DELETE CASCADE,
    multiplication_factor DECIMAL(4,2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ranking_mode_id, ranking_criteria_id)
);

-- Study program ranking modes (which ranking modes are available for each program)
CREATE TABLE study_program_ranking_modes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    study_program_id UUID REFERENCES study_programs(id) ON DELETE CASCADE,
    ranking_mode_id UUID REFERENCES ranking_modes(id) ON DELETE CASCADE,
    budget_places INTEGER NOT NULL DEFAULT 0,
    self_financing_places INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(study_program_id, ranking_mode_id)
);

-- Student candidates table
CREATE TABLE student_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    social_security_number VARCHAR(50) UNIQUE NOT NULL,
    father_first_name VARCHAR(100) NOT NULL,
    father_last_name VARCHAR(100) NOT NULL,
    mother_first_name VARCHAR(100) NOT NULL,
    mother_last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    previous_education_program VARCHAR(255) NOT NULL,
    previous_education_institution VARCHAR(255) NOT NULL,
    previous_education_start_year INTEGER NOT NULL,
    previous_education_end_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_candidate_id UUID REFERENCES student_candidates(id) ON DELETE CASCADE,
    enrollment_deadline_id UUID REFERENCES enrollment_deadlines(id) ON DELETE CASCADE,
    study_program_id UUID REFERENCES study_programs(id) ON DELETE CASCADE,
    ranking_mode_id UUID REFERENCES ranking_modes(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    total_points DECIMAL(6,2) DEFAULT 0,
    rank_position INTEGER,
    financing_type VARCHAR(20) CHECK (financing_type IN ('budget', 'self_financing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application criteria scores table
CREATE TABLE application_criteria_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    ranking_criteria_id UUID REFERENCES ranking_criteria(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(application_id, ranking_criteria_id)
);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_mode_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_program_ranking_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_criteria_scores ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins and service can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role IN ('admin', 'service')
        )
    );

CREATE POLICY "Admins can manage all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

-- Policies for institutions (admin only)
CREATE POLICY "Admins can manage institutions" ON institutions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role = 'admin'
        )
    );

CREATE POLICY "Service can view institutions" ON institutions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() 
            AND up.role IN ('admin', 'service')
        )
    );

-- Similar policies for other tables...
-- (Additional policies would be added for each table following the same pattern)

-- Indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_study_programs_institution_id ON study_programs(institution_id);
CREATE INDEX idx_applications_student_candidate_id ON applications(student_candidate_id);
CREATE INDEX idx_applications_study_program_id ON applications(study_program_id);
CREATE INDEX idx_applications_ranking_mode_id ON applications(ranking_mode_id);
CREATE INDEX idx_application_criteria_scores_application_id ON application_criteria_scores(application_id);
