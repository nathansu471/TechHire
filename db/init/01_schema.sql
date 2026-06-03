
-- Users: who can manage companies/jobs (and admins)
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('seeker','employer','admin') NOT NULL DEFAULT 'employer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Companies
CREATE TABLE companies (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  location VARCHAR(255),
  logo_url VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Which users can manage which companies
CREATE TABLE company_users (
  company_id BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  role ENUM('owner','manager') NOT NULL DEFAULT 'owner',
  PRIMARY KEY (company_id, user_id),
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)     ON DELETE CASCADE
);

-- Jobs (with date_posted, experience_required, education_level, work_mode)
CREATE TABLE jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description_md MEDIUMTEXT NOT NULL,
  location VARCHAR(255),
  job_type ENUM('full-time','part-time','internship','contract') NOT NULL,
  work_mode ENUM('remote','hybrid','in-person') NOT NULL DEFAULT 'in-person',
  experience_required VARCHAR(255),  -- e.g., "2+ years React"
  education_level ENUM('none','high_school','bachelor','master','phd') DEFAULT 'none',
  date_posted DATE NOT NULL DEFAULT (CURRENT_DATE),
  remote_ok BOOLEAN NOT NULL DEFAULT FALSE,  -- keep for compat (can remove later)
  salary_min INT NULL,
  salary_max INT NULL,
  currency CHAR(3) DEFAULT 'USD',
  status ENUM('active','paused','closed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

-- Indexes for typical filters/search
CREATE INDEX idx_jobs_company   ON jobs(company_id);
CREATE INDEX idx_jobs_status    ON jobs(status);
CREATE INDEX idx_jobs_type_stat ON jobs(job_type, status);
CREATE INDEX idx_jobs_title     ON jobs(title);
CREATE INDEX idx_jobs_location  ON jobs(location);
CREATE INDEX idx_jobs_date      ON jobs(date_posted);
CREATE INDEX idx_jobs_workmode  ON jobs(work_mode);

-- Applications
CREATE TABLE applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  job_id BIGINT NOT NULL,
  seeker_name  VARCHAR(120) NOT NULL,
  seeker_email VARCHAR(255) NOT NULL,
  resume_url   VARCHAR(500) NOT NULL,
  cover_letter_md MEDIUMTEXT,
  status ENUM('received','reviewed','rejected','advanced') NOT NULL DEFAULT 'received',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX idx_apps_job    ON applications(job_id);
CREATE INDEX idx_apps_status ON applications(status);

-- User Searches TODO: implement later
