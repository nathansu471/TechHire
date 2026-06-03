package com.example.jobsearch;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class JobDTO {
    private Long id;
    private String title;
    private String companyName;
    private Long companyId;
    private String location;
    private String description;
    private String jobType;
    private String workMode;
    private String experienceRequired;
    private String educationLevel;
    private Boolean remoteOk;
    private Integer salaryMin;
    private Integer salaryMax;
    private String currency;
    private String status;
    private String datePosted;

    public JobDTO(Job job) {
        this.id = job.getId();
        this.title = job.getTitle();
        this.location = job.getLocation();
        this.description = job.getDescriptionMd();
        this.jobType = job.getJobType();
        this.workMode = job.getWorkMode();
        this.experienceRequired = job.getExperienceRequired();
        this.educationLevel = job.getEducationLevel();
        this.remoteOk = job.getRemoteOk();
        this.salaryMin = job.getSalaryMin();
        this.salaryMax = job.getSalaryMax();
        this.currency = job.getCurrency();
        this.status = job.getStatus();

        if (job.getCompany() != null) {
            this.companyName = job.getCompany().getName();
            this.companyId = job.getCompany().getId();
        } else {
            this.companyName = "N/A";
            this.companyId = null;
        }

        if (job.getDatePosted() != null) {
            this.datePosted = job.getDatePosted().format(DateTimeFormatter.ISO_LOCAL_DATE);
        } else {
            this.datePosted = null;
        }
    }
}