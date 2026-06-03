package com.example.jobsearch;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobCreateRequest {
    private String title;
    private String descriptionMd;
    private String location;
    private String jobType;
    private String workMode;
    private String experienceRequired;
    private String educationLevel;
    private LocalDate datePosted;
    private Boolean remoteOk;
    private Integer salaryMin;
    private Integer salaryMax;
    private String currency;
    private String status;
    private Long companyId;
}