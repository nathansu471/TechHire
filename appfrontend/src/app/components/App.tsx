/*
import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import JobBoard from "../job_board/page";
import Tracker from "../tracker/page";
import HomePage from "../page";


const App: React.FC = () => {
  return (
    <Router>
      <nav className="p-4 flex gap-6 bg-[var(--background)] text-[var(--foreground)] border-b border-gray-300">
        <Link to="/" className="hover:text-[var(--primary)] font-semibold">Home</Link>
        <Link to="/job-board" className="hover:text-[var(--primary)] font-semibold">Job Board</Link>
        <Link to="/tracker" className="hover:text-[var(--primary)] font-semibold">Tracker</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </Router>
  );
};

export default App;
*/