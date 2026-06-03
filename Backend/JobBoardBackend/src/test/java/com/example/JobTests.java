package com.example.jobsearch;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobTests {

    @Nested // Unit tests for JobFilterService
    class JobFilterServiceTest {

        private JobFilterService jobFilterService;
        private List<Job> allJobs;

        @BeforeEach
        void setUp() {
            jobFilterService = new JobFilterService();

            Job j1 = new Job();
            j1.setTitle("Backend Developer");
            j1.setLocation("New York");
            j1.setSalaryMin(60000);
            j1.setSalaryMax(90000);
            j1.setJobType("Full-time");
            j1.setStatus("active");
            j1.setDatePosted(LocalDate.now().minusDays(2));

            Job j2 = new Job();
            j2.setTitle("Data Analyst");
            j2.setLocation("Chicago");
            j2.setSalaryMin(40000);
            j2.setSalaryMax(70000);
            j2.setJobType("Part-time");
            j2.setStatus("inactive");
            j2.setDatePosted(LocalDate.now().minusDays(10));

            Job j3 = new Job();
            j3.setTitle("Frontend Engineer");
            j3.setLocation("Remote");
            j3.setSalaryMin(80000);
            j3.setSalaryMax(120000);
            j3.setJobType("Full-time");
            j3.setStatus("active");
            j3.setDatePosted(LocalDate.now().minusDays(1));

            allJobs = List.of(j1, j2, j3);
        }

        @Test
        void testFilterByLocation() {
            List<Job> result = jobFilterService.filterByLocation(allJobs, "remote");
            assertEquals(1, result.size());
            assertEquals("Frontend Engineer", result.get(0).getTitle());
        }

        @Test
        void testFilterBySalary() {
            List<Job> result = jobFilterService.filterBySalary(allJobs, 50000, 100000);
            assertEquals(1, result.size());
            assertEquals("Backend Developer", result.get(0).getTitle());
        }

        @Test
        void testFilterByJobType() {
            List<Job> result = jobFilterService.filterByJobType(allJobs, "full");
            assertEquals(2, result.size());
            assertTrue(result.stream().anyMatch(j -> j.getTitle().equals("Backend Developer")));
            assertTrue(result.stream().anyMatch(j -> j.getTitle().equals("Frontend Engineer")));
        }

        @Test
        void testFilterByDatePosted() {
            List<Job> result = jobFilterService.filterByDatePosted(allJobs, 3);
            assertEquals(2, result.size());
            assertTrue(result.stream().anyMatch(j -> j.getTitle().equals("Backend Developer")));
            assertTrue(result.stream().anyMatch(j -> j.getTitle().equals("Frontend Engineer")));
        }
    }

    @Nested // Unit tests for JobRepository
    class JobRepositoryTest {

        private JobRepository jobRepository;

        @BeforeEach
        void setUp() {
            jobRepository = Mockito.mock(JobRepository.class);
        }

        @Test
        void testFindByTitleContainingIgnoreCaseAndStatus() {
            Job job = new Job();
            job.setTitle("Software Engineer");
            job.setStatus("active");

            when(jobRepository.findByTitleContainingIgnoreCaseAndStatus("engineer", "active"))
                    .thenReturn(List.of(job));

            List<Job> result = jobRepository.findByTitleContainingIgnoreCaseAndStatus("engineer", "active");

            assertEquals(1, result.size());
            assertEquals("Software Engineer", result.get(0).getTitle());
            verify(jobRepository, times(1))
                    .findByTitleContainingIgnoreCaseAndStatus("engineer", "active");
        }

        @Test
        void testFindByLocationContainingIgnoreCaseAndStatus() {
            Job job = new Job();
            job.setTitle("Backend Developer");
            job.setLocation("New York");
            job.setStatus("active");

            when(jobRepository.findByLocationContainingIgnoreCaseAndStatus("new", "active"))
                    .thenReturn(List.of(job));

            List<Job> result = jobRepository.findByLocationContainingIgnoreCaseAndStatus("new", "active");

            assertEquals(1, result.size());
            assertEquals("Backend Developer", result.get(0).getTitle());
            verify(jobRepository, times(1))
                    .findByLocationContainingIgnoreCaseAndStatus("new", "active");
        }

        @Test
        void testFindByJobTypeAndStatus() {
            Job job = new Job();
            job.setJobType("Full-time");
            job.setStatus("active");

            when(jobRepository.findByJobTypeAndStatus("Full-time", "active"))
                    .thenReturn(List.of(job));

            List<Job> result = jobRepository.findByJobTypeAndStatus("Full-time", "active");

            assertEquals(1, result.size());
            assertEquals("Full-time", result.get(0).getJobType());
            verify(jobRepository, times(1))
                    .findByJobTypeAndStatus("Full-time", "active");
        }

        @Test
        void testFilterBySalaryRange() {
            Job job = new Job();
            job.setTitle("Backend Developer");
            job.setSalaryMin(60000);
            job.setSalaryMax(120000);
            job.setStatus("active");

            when(jobRepository.filterBySalaryRange(50000, 150000))
                    .thenReturn(List.of(job));

            List<Job> result = jobRepository.filterBySalaryRange(50000, 150000);

            assertEquals(1, result.size());
            assertEquals("Backend Developer", result.get(0).getTitle());
            verify(jobRepository, times(1))
                    .filterBySalaryRange(50000, 150000);
        }
    }
}


