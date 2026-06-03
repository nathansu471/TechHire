import pandas as pd
import mysql.connector

'''
Read data from the MySQL database and return as pandas DataFrames.
'''
def read_db():

    conn = mysql.connector.connect( # Need to change later with database
        host="localhost",
        user="root",
        password="your_password",
        database="job_portal"
    )

    users_df = pd.read_sql("SELECT * FROM users;", conn)
    companies_df = pd.read_sql("SELECT * FROM companies;", conn)
    jobs_df = pd.read_sql("SELECT * FROM jobs;", conn)
    applications_df = pd.read_sql("SELECT * FROM applications;", conn)
	
    conn.close()

    return users_df, companies_df, jobs_df, applications_df

