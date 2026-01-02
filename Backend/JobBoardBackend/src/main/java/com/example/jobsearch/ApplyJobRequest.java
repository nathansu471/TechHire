package com.example.jobsearch;

import lombok.Data;

@Data
public class ApplyJobRequest {
    private String title;
    private String company;
    private String location;
    private String jobType;
}