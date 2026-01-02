package com.example.jobsearch;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepo;
    private final CompanyRepository companyRepo;
    private final FuzzySearchService fuzzy;
    private final JobFilterService filterService;

    public JobController(JobRepository jobRepo, CompanyRepository companyRepo,
                         FuzzySearchService fuzzy, JobFilterService filterService) {
        this.jobRepo = jobRepo;
        this.companyRepo = companyRepo;
        this.fuzzy = fuzzy;
        this.filterService = filterService;
    }

    @PostConstruct
    public void init() {
        try {
            Thread.sleep(3000);
            fuzzy.reindexAll();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @GetMapping
    public List<JobDTO> getAll() {
        return jobRepo.findAll().stream()
                .map(JobDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobRepo.findById(id)
                .map(job -> ResponseEntity.ok((Object) new JobDTO(job)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Job not found")));
    }

    @GetMapping("/active")
    public List<JobDTO> getActive() {
        return jobRepo.findByStatus("active").stream()
                .map(JobDTO::new)
                .collect(Collectors.toList());
    }

    // Unified search with optional filters
    @GetMapping("/search")
    @Transactional
    public List<JobDTO> search(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "jobType", required = false) String jobType,
            @RequestParam(value = "minSalary", required = false) Integer minSalary,
            @RequestParam(value = "maxSalary", required = false) Integer maxSalary,
            @RequestParam(value = "daysAgo", required = false) Integer daysAgo,
            @RequestParam(value = "limit", defaultValue = "25") int limit) {

        List<Job> jobs;

        // Start with fuzzy search or all active jobs
        if (q != null && !q.isBlank()) {
            // Fuzzy search returns DTOs, so we need to work differently
            List<JobDTO> results = fuzzy.searchJobs(q, limit);

            // If no additional filters, return fuzzy results directly
            if (location == null && jobType == null && minSalary == null && maxSalary == null && daysAgo == null) {
                return results;
            }

            // Otherwise, get jobs to filter (less efficient but allows combined search+filter)
            jobs = jobRepo.findByStatus("active");
        } else {
            jobs = jobRepo.findByStatus("active");
        }

        // Apply filters
        if (location != null && !location.isBlank()) {
            jobs = filterService.filterByLocation(jobs, location);
        }
        if (jobType != null && !jobType.isBlank()) {
            jobs = filterService.filterByJobType(jobs, jobType);
        }
        if (minSalary != null || maxSalary != null) {
            jobs = filterService.filterBySalary(jobs, minSalary, maxSalary);
        }
        if (daysAgo != null) {
            jobs = filterService.filterByDatePosted(jobs, daysAgo);
        }

        return jobs.stream()
                .limit(limit)
                .map(JobDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/title")
    public List<JobDTO> searchByTitle(@RequestParam String title) {
        return jobRepo.findByTitleContainingIgnoreCaseAndStatus(title, "active").stream()
                .map(JobDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/filter/salary")
    public List<JobDTO> filterBySalary(@RequestParam Integer min, @RequestParam Integer max) {
        return jobRepo.filterBySalaryRange(min, max).stream()
                .map(JobDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody JobCreateRequest request) {
        // Validate company exists
        Company company = companyRepo.findById(request.getCompanyId()).orElse(null);
        if (company == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Company not found"));
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescriptionMd(request.getDescriptionMd());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setWorkMode(request.getWorkMode());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setEducationLevel(request.getEducationLevel());
        job.setDatePosted(request.getDatePosted());
        job.setRemoteOk(request.getRemoteOk());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setCurrency(request.getCurrency());
        job.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        job.setCompany(company);

        Job saved = jobRepo.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(new JobDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody JobCreateRequest request) {
        return jobRepo.findById(id)
                .map(job -> {
                    if (request.getCompanyId() != null) {
                        Company company = companyRepo.findById(request.getCompanyId()).orElse(null);
                        if (company == null) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body((Object) Map.of("error", "Company not found"));
                        }
                        job.setCompany(company);
                    }
                    if (request.getTitle() != null) job.setTitle(request.getTitle());
                    if (request.getDescriptionMd() != null) job.setDescriptionMd(request.getDescriptionMd());
                    if (request.getLocation() != null) job.setLocation(request.getLocation());
                    if (request.getJobType() != null) job.setJobType(request.getJobType());
                    if (request.getWorkMode() != null) job.setWorkMode(request.getWorkMode());
                    if (request.getExperienceRequired() != null) job.setExperienceRequired(request.getExperienceRequired());
                    if (request.getEducationLevel() != null) job.setEducationLevel(request.getEducationLevel());
                    if (request.getDatePosted() != null) job.setDatePosted(request.getDatePosted());
                    if (request.getRemoteOk() != null) job.setRemoteOk(request.getRemoteOk());
                    if (request.getSalaryMin() != null) job.setSalaryMin(request.getSalaryMin());
                    if (request.getSalaryMax() != null) job.setSalaryMax(request.getSalaryMax());
                    if (request.getCurrency() != null) job.setCurrency(request.getCurrency());
                    if (request.getStatus() != null) job.setStatus(request.getStatus());

                    return ResponseEntity.ok((Object) new JobDTO(jobRepo.save(job)));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Job not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!jobRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Job not found"));
        }
        jobRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }
}