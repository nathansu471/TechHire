import requests, mysql.connector, re
from datetime import datetime
import html

# Database connection configuration dictionary
DB = dict(
    host="db",            # Database hostname or container name
    port=3306,            # MySQL default port
    user="app",           # Database username
    password="app_pw",    # Database password
    database="jobboard",  # Target database name
    charset="utf8mb4",
    use_unicode=True
)

# Helper Functions

def trim_date(s):
    """
    Ensures we have a date string (YYYY-MM-DD format).
    If 's' is None, use today's UTC date.
    """
    return (s or datetime.utcnow().date().isoformat())[:10]

def infer_job_type(tags):
    """
    Infers job type (internship, contract, part-time, or full-time)
    from a list of tag strings.
    """
    t = [x.lower() for x in (tags or [])]  # Normalize tags to lowercase

    if "intern" in t or "internship" in t:
        return "internship"
    if "contract" in t or "freelance" in t:
        return "contract"
    if "part-time" in t or "part time" in t:
        return "part-time"
    return "full-time"  # Default if none of the above keywords found

def fetch_remoteok():
    """
    Fetches job postings from the RemoteOK public API.
    Returns a list of job dictionaries.
    """
    r = requests.get(
        "https://remoteok.com/api",
        timeout=30,
        headers={"User-Agent": "jobboard"}  # User-Agent to avoid being blocked
    )
    r.raise_for_status()  # Raise error if HTTP request failed
    r.encoding = "utf-8"

    data = r.json()  # Parse the JSON response

    # RemoteOK API returns a list where the first item is metadata,
    # so skip index 0 and return the rest.
    return data[1:] if isinstance(data, list) else []

def strip_html_tags(text):
    """
    Removes HTML tags and decodes HTML entities.
    Returns clean, plain text without HTML formatting or encoded characters.
    """
    if not text:
        return ""
    
    # Handle potential UTF-8 encoding issues
    if isinstance(text, str):
        try:
            # Try to fix double-encoded UTF-8
            text = text.encode('latin-1').decode('utf-8', errors='replace')
        except (UnicodeDecodeError, UnicodeEncodeError):
            pass
    
    # Decode HTML entities
    text = html.unescape(text)
    
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", "", text)
    
    # Remove problematic characters and control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\t\r')
    
    # Clean up extra whitespace and newlines
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def extract_salary(salary_str):
    """
    Extracts salary min and max from salary string.
    Looks for patterns like "$50k-$100k" or "50000-100000".
    Returns (min, max) tuple or (None, None) if not found.
    """
    if not salary_str:
        return (None, None)
    
    # Remove common currency symbols and text
    salary_str = str(salary_str).upper()
    salary_str = re.sub(r'[^0-9K-]', '', salary_str)
    
    # Try to find two numbers separated by dash/hyphen
    match = re.search(r'(\d+)K?\s*-\s*(\d+)K?', salary_str)
    if match:
        min_sal = int(match.group(1))
        max_sal = int(match.group(2))
        # Assume K if large enough
        if min_sal < 1000:
            min_sal *= 1000
        if max_sal < 1000:
            max_sal *= 1000
        return (min_sal, max_sal)
    
    return (None, None)

def infer_experience_level(tags, description):
    """
    Infers experience level from tags and description.
    Returns one of: 'entry', 'mid', 'senior', or 'Not specified'.
    """
    full_text = (" ".join([str(x).lower() for x in (tags or [])]) + " " + 
                 (description or "").lower())
    
    if any(word in full_text for word in ["senior", "lead", "principal", "10+", "15+", "20+"]):
        return "senior"
    elif any(word in full_text for word in ["junior", "entry", "entry-level", "0-2", "1-2", "graduate"]):
        return "entry"
    elif any(word in full_text for word in ["mid", "intermediate", "3-5", "5-7", "5-10"]):
        return "mid"
    
    return "Not specified"

def infer_education_level(description):
    """Return a value that fits the jobs.education_level enum."""
    text = (description or "").lower()

    if "phd" in text or "ph.d" in text or "doctorate" in text:
        return "phd"
    if any(w in text for w in ["master", "msc", "graduate degree", "m.s."]):
        return "master"
    if any(w in text for w in ["bachelor", "bsc", "undergraduate", "bs in", "b.s."]):
        return "bachelor"
    if any(w in text for w in ["high school", "high-school", "hs diploma", "ged", "associate"]):
        return "high_school"

    return "none"

# Main Import Script

def clear_job_data(cur):
    """
    No longer clears job data - we'll just skip duplicates.
    Keep all old jobs and add new ones.
    """
    pass

def main():
    print("Fetching RemoteOK…")
    jobs = fetch_remoteok()[:100]  # Fetch first 100 jobs for demo purposes
    print(f"Fetched {len(jobs)} jobs")
    
    if jobs:
        print(f"\nAvailable fields in job data: {list(jobs[0].keys())}\n")

    # Connect to MySQL using credentials in DB dict
    conn = mysql.connector.connect(**DB)
    cur = conn.cursor()  # Create a cursor for executing SQL commands

    # Clear existing data before importing new jobs
    clear_job_data(cur)
    conn.commit()

    print("Importing new jobs (skipping duplicates)...")
    for j in jobs:
        # Extract job data safely with defaults
        title = j.get("position") or "Untitled"
        company = j.get("company") or "Unknown Company"
        location = j.get("location") or "Remote"
        tags = j.get("tags") or []
        raw_description = j.get("description") or ", ".join(tags)
        description = strip_html_tags(raw_description)  # Clean HTML
        date_posted = trim_date(j.get("date"))  # Normalize date format
        work_mode = "remote"
        job_type = infer_job_type(tags)
        
        # Extract salary range if available
        salary_str = j.get("salary")
        salary_min, salary_max = extract_salary(salary_str)
        
        # If salary_str didn't work, try salary_min/salary_max fields directly
        if salary_min is None or salary_max is None:
            api_salary_min = j.get("salary_min")
            api_salary_max = j.get("salary_max")
            # Only use if they're non-zero (0 means not provided)
            if api_salary_min and api_salary_min > 0:
                salary_min = api_salary_min
            if api_salary_max and api_salary_max > 0:
                salary_max = api_salary_max
        
        # Infer experience level from tags and description
        experience_level = infer_experience_level(tags, description)
        education_level = infer_education_level(description)

        # 1) Find or create company record
        cur.execute("SELECT id FROM companies WHERE name=%s LIMIT 1", (company,))
        row = cur.fetchone()
        if row:
            company_id = row[0]  # Existing company found
        else:
            # Insert new company into companies table
            cur.execute("INSERT INTO companies (name) VALUES (%s)", (company,))
            company_id = cur.lastrowid  # Get new company ID

        # 2) Check for duplicate job postings
        # Skip inserting if same company + title + location + date already exists
        cur.execute("""
            SELECT id FROM jobs
            WHERE company_id=%s
              AND LOWER(title)=LOWER(%s)
              AND COALESCE(location,'')=COALESCE(%s,'')
              AND date_posted=%s
              AND status<>'closed'
            LIMIT 1
        """, (company_id, title, location, date_posted))
        exists = cur.fetchone()
        if exists:
            continue  # Skip duplicate job posting

        # 3) Insert job into jobs table
        cur.execute("""
            INSERT INTO jobs
            (company_id, title, description_md, location, job_type, work_mode,
             experience_required, education_level, date_posted, remote_ok,
             salary_min, salary_max, currency, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            company_id, title, description, location, job_type, work_mode,
            experience_level, education_level, date_posted, True,
            salary_min, salary_max, "USD", "active"
        ))

        # Commit the insert to save changes in database
        conn.commit()

    # Close database connection
    cur.close()
    conn.close()
    print("Import complete.")

# Entry point

if __name__ == "__main__":
    main()