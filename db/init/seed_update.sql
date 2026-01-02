-- USERS (10 total)
INSERT INTO users (email, password_hash, name, role) VALUES
('alice@acme.com',   '$2a$10$dummyhash', 'Alice', 'employer'),
('bob@beta.io',      '$2a$10$dummyhash', 'Bob',   'employer'),
('admin@board.dev',  '$2a$10$dummyhash', 'Admin', 'admin'),
('sara@seekr.com',   '$2a$10$dummyhash', 'Sara L',  'seeker'),
('john@seekr.com',   '$2a$10$dummyhash', 'John W',  'seeker'),
('lisa@seekr.com',   '$2a$10$dummyhash', 'Lisa M',  'seeker'),
('marco@seekr.com',  '$2a$10$dummyhash', 'Marco T', 'seeker'),
('emily@seekr.com',  '$2a$10$dummyhash', 'Emily B', 'seeker'),
('recruit@omega.io', '$2a$10$dummyhash', 'Olivia', 'employer'),
('talent@delta.dev', '$2a$10$dummyhash', 'Derek',  'employer');

-- COMPANIES (10 total)
INSERT INTO companies (name, website, location, logo_url) VALUES
('Acme Corp', 'https://acme.example', 'Madison, WI', NULL),
('Beta Labs', 'https://beta.example', 'Remote (US)', NULL),
('Omega Tech', 'https://omega.example', 'Chicago, IL', NULL),
('Delta Digital', 'https://delta.example', 'Austin, TX', NULL),
('Pioneer AI', 'https://pioneer.example', 'Remote', NULL),
('Nebula Cloud', 'https://nebula.example', 'New York, NY', NULL),
('GreenField Apps', 'https://greenfield.example', 'San Francisco, CA', NULL),
('Harbor Systems', 'https://harbor.example', 'Boston, MA', NULL),
('Orbit Analytics', 'https://orbit.example', 'Seattle, WA', NULL),
('BrightWave Media', 'https://brightwave.example', 'Remote (US)', NULL);

-- COMPANY_USERS (10 total, one owner each)
INSERT INTO company_users (company_id, user_id, role) VALUES
(1, 1, 'owner'),
(2, 2, 'owner'),
(3, 9, 'owner'),
(4, 10, 'owner'),
(5, 1, 'owner'),
(6, 2, 'owner'),
(7, 9, 'owner'),
(8, 10, 'owner'),
(9, 1, 'owner'),
(10, 2, 'owner');

-- JOBS (10 total, mixed tone, mixed salary formats)
INSERT INTO jobs (company_id, title, description_md, location, job_type, work_mode, experience_required, education_level, date_posted, remote_ok, salary_min, salary_max, currency, status) VALUES
(1, 'Frontend Engineer (React)', 'Build our job board UI using React + Tailwind.', 'Madison, WI', 'full-time', 'hybrid', '2+ years JavaScript/React', 'bachelor', '2025-10-01', TRUE, 90000, 120000, 'USD', 'active'),
(1, 'Data Intern', 'Assist with dashboards and ETL.', 'Madison, WI', 'internship', 'in-person', 'Entry-level', 'none', '2025-10-02', FALSE, NULL, NULL, 'USD', 'active'),
(2, 'Backend Engineer (Spring Boot)', 'Design REST APIs and integrate with MySQL.', 'Remote (US)', 'full-time', 'remote', '3+ years Java/Spring', 'bachelor', '2025-10-03', TRUE, 100000, 140000, 'USD', 'active'),
(2, 'Product Designer', 'Own design system and UX flows.', 'Remote (US)', 'contract', 'remote', '4+ years UI/UX', 'bachelor', '2025-10-04', TRUE, 60, 90, 'USD', 'paused'),
(3, 'DevOps Engineer', 'Corporate environment, CI/CD pipelines, AWS + Terraform.', 'Chicago, IL', 'full-time', 'hybrid', '5+ years DevOps', 'bachelor', '2025-10-05', TRUE, 110000, 155000, 'USD', 'active'),
(4, 'Junior QA Tester', 'Help us ship fast — write test cases + automate flows.', 'Austin, TX', 'full-time', 'in-person', '0-1 years testing', 'none', '2025-10-03', FALSE, 45000, 60000, 'USD', 'active'),
(5, 'AI Research Assistant', 'Work with our ML team on training + model evaluation.', 'Remote', 'internship', 'remote', 'Python + ML basics', 'bachelor', '2025-10-06', TRUE, NULL, NULL, 'USD', 'active'),
(6, 'Cloud Support Specialist', 'Customer-facing support for AWS/GCP clients.', 'New York, NY', 'full-time', 'in-person', '2+ years IT support', 'high_school', '2025-10-02', FALSE, 55000, 70000, 'USD', 'active'),
(7, 'Full Stack Engineer', 'Own features end-to-end — React + Node or Spring.', 'San Francisco, CA', 'full-time', 'hybrid', '3+ years experience', 'bachelor', '2025-10-01', TRUE, 130000, 170000, 'USD', 'active'),
(8, 'UI Contractor', 'Short-term help designing dashboards.', 'Boston, MA', 'contract', 'remote', '3+ years UI', 'none', '2025-10-05', TRUE, 50, 80, 'USD', 'active');

-- APPLICATIONS (12 total, mixed emails, some tied to users)
INSERT INTO applications (job_id, seeker_name, seeker_email, resume_url, cover_letter_md, status) VALUES
(1, 'Jane Doe', 'jane@example.com', 'https://files.example/resumes/jane.pdf', 'Excited to contribute on the frontend!', 'received'),
(3, 'Mike Chan', 'mike@example.com', 'https://files.example/resumes/mike.pdf', 'Experienced with Spring Boot + Docker.', 'reviewed'),
(1, 'Sara L', 'sara@seekr.com', 'https://files.example/resumes/sara.pdf', 'I love React and UI work.', 'received'),
(3, 'John W', 'john@seekr.com', 'https://files.example/resumes/john.pdf', 'Spring + Docker experience.', 'advanced'),
(5, 'Lisa M', 'lisa@seekr.com', 'https://files.example/resumes/lisa.pdf', 'Interested in AI research.', 'received'),
(6, 'Emily B', 'emily@seekr.com', 'https://files.example/resumes/emily.pdf', 'Help desk and IT support background.', 'reviewed'),
(7, 'Marco T', 'marco@seekr.com', 'https://files.example/resumes/marco.pdf', 'Full-stack portfolio attached.', 'received'),
(8, 'Alex Grey', 'alex@example.com', 'https://files.example/resumes/alex.pdf', 'UI/UX contractor experience.', 'received'),
(2, 'Chris Harper', 'chris@example.com', 'https://files.example/resumes/chris.pdf', 'Excited to learn and grow.', 'received'),
(4, 'Heather Poe', 'heather@example.com', 'https://files.example/resumes/heather.pdf', 'UX + Figma experience.', 'received'),
(9, 'Dev Patel', 'dev@example.com', 'https://files.example/resumes/dev.pdf', 'End-to-end engineering interest.', 'received'),
(10, 'Ravi Singh', 'ravi@example.com', 'https://files.example/resumes/ravi.pdf', 'Available for contract work.', 'received');
