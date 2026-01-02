package com.example.jobsearch;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobFilterService {

    public List<Job> filterByLocation(List<Job> jobs, String location) {
        return jobs.stream()
                .filter(job -> "active".equalsIgnoreCase(job.getStatus()))
                .filter(job -> job.getLocation() != null &&
                        job.getLocation().toLowerCase().contains(location.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Job> filterBySalary(List<Job> jobs, Integer minSalary, Integer maxSalary) {
        return jobs.stream()
                .filter(job -> "active".equalsIgnoreCase(job.getStatus()))
                .filter(job -> minSalary == null ||
                        (job.getSalaryMin() != null && job.getSalaryMin() >= minSalary))
                .filter(job -> maxSalary == null ||
                        (job.getSalaryMax() != null && job.getSalaryMax() <= maxSalary))
                .collect(Collectors.toList());
    }

    public List<Job> filterByJobType(List<Job> jobs, String type) {
        return jobs.stream()
                .filter(job -> "active".equalsIgnoreCase(job.getStatus()))
                .filter(job -> job.getJobType() != null &&
                        job.getJobType().toLowerCase().contains(type.toLowerCase()))
                .collect(Collectors.toList());
    }

    public List<Job> filterByDatePosted(List<Job> jobs, int daysAgo) {
        LocalDate cutoff = LocalDate.now().minusDays(daysAgo);
        return jobs.stream()
                .filter(job -> "active".equalsIgnoreCase(job.getStatus()))
                .filter(job -> job.getDatePosted() != null &&
                        !job.getDatePosted().isBefore(cutoff))
                .collect(Collectors.toList());
    }
}