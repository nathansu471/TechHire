package com.example.jobsearch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByTitleContainingIgnoreCaseAndStatus(String title, String status);

    List<Job> findByLocationContainingIgnoreCaseAndStatus(String location, String status);

    List<Job> findByJobTypeAndStatus(String jobType, String status);

    List<Job> findByStatus(String status);

    @Query("SELECT j FROM Job j WHERE (j.salaryMin >= :min OR j.salaryMin IS NULL) AND (j.salaryMax <= :max OR j.salaryMax IS NULL) AND j.status = 'active'")
    List<Job> filterBySalaryRange(Integer min, Integer max);
}