import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
import remoteok_import

class TestHelperFunctions(unittest.TestCase):
    def test_trim_date_with_valid_date(self):
        self.assertEqual(remoteok_import.trim_date("2025-11-10T12:00:00Z"), "2025-11-10")

    def test_trim_date_with_none(self):
        today = datetime.utcnow().date().isoformat()
        self.assertEqual(remoteok_import.trim_date(None), today)

    def test_infer_job_type_intern(self):
        self.assertEqual(remoteok_import.infer_job_type(["Intern"]), "internship")

    def test_infer_job_type_contract(self):
        self.assertEqual(remoteok_import.infer_job_type(["Freelance"]), "contract")

    def test_infer_job_type_part_time(self):
        self.assertEqual(remoteok_import.infer_job_type(["part time"]), "part-time")

    def test_infer_job_type_default(self):
        self.assertEqual(remoteok_import.infer_job_type(["randomtag"]), "full-time")

    def test_strip_html_tags(self):
        html = "<p>Hello <b>World</b></p>"
        self.assertEqual(remoteok_import.strip_html_tags(html), "Hello World")

class TestFetchRemoteOK(unittest.TestCase):
    @patch("remoteok_import.requests.get")
    def test_fetch_remoteok_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = [
            {"meta": "data"},
            {"position": "Dev", "company": "ACME"}
        ]
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        jobs = remoteok_import.fetch_remoteok()
        self.assertEqual(len(jobs), 1)
        self.assertEqual(jobs[0]["position"], "Dev")
        mock_get.assert_called_once_with(
            "https://remoteok.com/api",
            timeout=30,
            headers={"User-Agent": "jobboard"}
        )

    @patch("remoteok_import.requests.get")
    def test_fetch_remoteok_handles_non_list_response(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"unexpected": "format"}
        mock_get.return_value = mock_response

        result = remoteok_import.fetch_remoteok()
        self.assertEqual(result, [])


class TestMainImport(unittest.TestCase):
    @patch("remoteok_import.fetch_remoteok")
    @patch("remoteok_import.mysql.connector.connect")
    def test_main_inserts_new_company_and_job(self, mock_connect, mock_fetch):
        # Mock API result
        mock_fetch.return_value = [{
            "position": "Software Engineer",
            "company": "TechCorp",
            "location": "Remote",
            "tags": ["Python", "Full-time"],
            "description": "<p>Build great things!</p>",
            "date": "2025-11-10T00:00:00Z"
        }]

        # Mock DB connection and cursor
        mock_cursor = MagicMock()
        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        # No existing company
        mock_cursor.fetchone.side_effect = [None, None]

        # Run main import
        remoteok_import.main()

        # Verify company insert was called
        mock_cursor.execute.assert_any_call(
            "INSERT INTO companies (name) VALUES (%s)", ("TechCorp",)
        )

        # Verify job insert called
        called = False
        for call_args in mock_cursor.execute.call_args_list:
            if "INSERT INTO jobs" in call_args[0][0]:
                called = True
        self.assertTrue(called)

        # Verify commits
        mock_conn.commit.assert_called()

    @patch("remoteok_import.fetch_remoteok")
    @patch("remoteok_import.mysql.connector.connect")
    def test_main_skips_duplicate_job(self, mock_connect, mock_fetch):
        mock_fetch.return_value = [{
            "position": "Software Engineer",
            "company": "TechCorp",
            "location": "Remote",
            "tags": ["Python", "Full-time"],
            "description": "<p>Build great things!</p>",
            "date": "2025-11-10T00:00:00Z"
        }]

        mock_cursor = MagicMock()
        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        # Company exists; duplicate job found
        mock_cursor.fetchone.side_effect = [(1,), (1,)]

        remoteok_import.main()

        # Ensure job insert was never called
        for call_args in mock_cursor.execute.call_args_list:
            self.assertNotIn("INSERT INTO jobs", call_args[0][0])


if __name__ == "__main__":
    unittest.main()
