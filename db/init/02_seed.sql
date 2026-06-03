
INSERT INTO users (email, password_hash, name, role) VALUES
('alice@acme.com',   '$2a$10$dummyhash', 'Alice', 'employer'),
('bob@beta.io',      '$2a$10$dummyhash', 'Bob',   'employer'),
('admin@board.dev',  '$2a$10$dummyhash', 'Admin', 'admin');

INSERT INTO companies (name, website, location, logo_url) VALUES
('Acme Corp', 'https://acme.example', 'Madison, WI', NULL),
('Beta Labs', 'https://beta.example', 'Remote (US)', NULL);

INSERT INTO company_users (company_id, user_id, role) VALUES
(1, 1, 'owner'),
(2, 2, 'owner');

-- Seed jobs w/ new fields
INSERT INTO jobs
(company_id, title, description_md, location, job_type, work_mode, experience_required, education_level, date_posted, remote_ok, salary_min, salary_max, currency, status)
VALUES
(1, 'Frontend Engineer (React)', 'Build our job board UI using React + Tailwind.', 'Madison, WI',
 'full-time', 'hybrid', '2+ years JavaScript/React', 'bachelor', '2025-10-01',
 TRUE, 90000, 120000, 'USD', 'active'),

(1, 'Data Intern', 'Assist with dashboards and ETL.', 'Madison, WI',
 'internship', 'in-person', 'Entry-level', 'none', '2025-10-02',
 FALSE, NULL, NULL, 'USD', 'active'),

(2, 'Backend Engineer (Spring Boot)', 'Design REST APIs and integrate with MySQL.', 'Remote (US)',
 'full-time', 'remote', '3+ years Java/Spring', 'bachelor', '2025-10-03',
 TRUE, 100000, 140000, 'USD', 'active'),

(2, 'Product Designer', 'Own design system and UX flows.', 'Remote (US)',
 'contract', 'remote', '4+ years UI/UX', 'bachelor', '2025-10-04',
 TRUE, 60, 90, 'USD', 'paused');

INSERT INTO applications (job_id, seeker_name, seeker_email, resume_url, cover_letter_md, status)
VALUES
(1, 'Jane Doe', 'jane@example.com', 'https://files.example/resumes/jane.pdf', 'Excited to contribute on the frontend!', 'received'),
(3, 'Mike Chan', 'mike@example.com', 'https://files.example/resumes/mike.pdf', 'Experienced with Spring Boot + Docker.', 'reviewed');
