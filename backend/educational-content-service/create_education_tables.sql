-- Create educational content database tables

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
    duration_minutes INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Main lesson content (markdown/html)
    video_url TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    certificate_issued BOOLEAN DEFAULT false,
    UNIQUE(user_id, course_id)
);

-- Course categories table
CREATE TABLE IF NOT EXISTS course_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz/Assessment tables
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70,
    time_limit_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) DEFAULT 'multiple_choice', -- multiple_choice, true_false, short_answer
    correct_answer TEXT NOT NULL,
    options JSONB, -- For multiple choice options
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    passed BOOLEAN DEFAULT false,
    answers JSONB, -- User's answers
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Insert default categories
INSERT INTO course_categories (name, description, icon_name) VALUES 
('Waste Management', 'Learn about proper waste disposal and recycling techniques', 'recycle'),
('Sustainability', 'Understanding environmental sustainability practices', 'leaf'),
('Circular Economy', 'Principles of circular economy and resource reuse', 'cycle'),
('Environmental Policy', 'Laws and regulations regarding environmental protection', 'scale'),
('Green Technology', 'Latest technologies for environmental conservation', 'cpu')
ON CONFLICT (name) DO NOTHING;
