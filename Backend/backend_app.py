# Input: Database for job listings and user search input
# Output: Filtered job listings based on criteria

import database_reader as db_reader
import pandas as pd

users_df, companies_df, jobs_df, applications_df = db_reader.read_db()

"""
Filter jobs based on a partial (case-insensitive) match of job title.
Returns only active jobs.
"""
def search_job_title(jobs_df, input_title):
    filtered = jobs_df[
        jobs_df["title"].str.contains(input_title, case=False, na=False)
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
    Find jobs by company name (partial, case-insensitive).
"""
def search_company(jobs_df, companies_df, input_company_name):

    matched_companies = companies_df[
        companies_df["name"].str.contains(input_company_name, case=False, na=False)
    ]

    if matched_companies.empty: # No matching companies found
        return pd.DataFrame(columns=jobs_df.columns)

    matched_company_ids = matched_companies["id"].tolist()

    filtered_jobs = jobs_df[
        (jobs_df["company_id"].isin(matched_company_ids))
        & (jobs_df["status"] == "active")
    ]

    return filtered_jobs


# Input: Database for job listings
# Output: Filtered job listings based on criteria

"""
Filter jobs by location (partial, case-insensitive match).
"""
def filter_by_location(jobs_df, location):
    filtered = jobs_df[
        jobs_df["location"].str.contains(location, case=False, na=False)
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
Filter jobs by salary range.
min_salary and max_salary are optional parameters.
"""
def filter_by_salary(jobs_df, min_salary=None, max_salary=None):
    filtered = jobs_df[jobs_df["status"] == "active"].copy()
    
    if min_salary is not None:
        filtered = filtered[filtered["salary_min"] >= min_salary]
    
    if max_salary is not None:
        filtered = filtered[filtered["salary_max"] <= max_salary]
    
    return filtered

"""
Filter jobs by job type (e.g., "full-time", "part-time", "contract", "internship").
Supports partial, case-insensitive matching.
"""
def filter_by_job_type(jobs_df, job_type):
    filtered = jobs_df[
        jobs_df["job_type"].str.contains(job_type, case=False, na=False)
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
Filter jobs by experience level (e.g., "entry", "mid", "senior").
Supports partial, case-insensitive matching.
"""
def filter_experience_level(jobs_df, experience_level):
    filtered = jobs_df[
        jobs_df["experience_level"].str.contains(experience_level, case=False, na=False)
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
Filter jobs by company size (e.g., "small", "medium", "large", "enterprise").
Requires companies_df to join company information.
"""
def filter_by_company_size(jobs_df, companies_df, company_size):
    matched_companies = companies_df[
        companies_df["size"].str.contains(company_size, case=False, na=False)
    ]
    
    if matched_companies.empty:
        return pd.DataFrame(columns=jobs_df.columns)
    
    matched_company_ids = matched_companies["id"].tolist()
    
    filtered = jobs_df[
        (jobs_df["company_id"].isin(matched_company_ids))
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
Filter jobs by industry (e.g., "tech", "finance", "healthcare").
Requires companies_df to join company information.
"""
def filter_by_industry(jobs_df, companies_df, industry):
    matched_companies = companies_df[
        companies_df["industry"].str.contains(industry, case=False, na=False)
    ]
    
    if matched_companies.empty:
        return pd.DataFrame(columns=jobs_df.columns)
    
    matched_company_ids = matched_companies["id"].tolist()
    
    filtered = jobs_df[
        (jobs_df["company_id"].isin(matched_company_ids))
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
Filter jobs by visa sponsorship availability.
visa_required should be True or False.
"""
def filter_by_visa_sponsorship(jobs_df, visa_required=True):
    filtered = jobs_df[
        (jobs_df["visa_sponsorship"] == visa_required)
        & (jobs_df["status"] == "active")
    ]
    return filtered

"""
Filter jobs by date posted.
days_ago: jobs posted within the last N days (default: 30).
Assumes jobs_df has a "posted_date" column in datetime format.
"""
def filter_by_date_posted(jobs_df, days_ago=30):
    cutoff_date = datetime.now() - timedelta(days=days_ago)
    
    filtered = jobs_df[
        (pd.to_datetime(jobs_df["posted_date"]) >= cutoff_date)
        & (jobs_df["status"] == "active")
    ]
    return filtered

