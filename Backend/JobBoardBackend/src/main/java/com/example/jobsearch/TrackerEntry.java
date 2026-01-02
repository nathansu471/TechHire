package com.example.jobsearch;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who owns this tracked job
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    private String company;
    private String location;
    private String jobType;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        SAVED,
        APPLIED,
        INTERVIEWING,
        OFFER,
        REJECTED
    }
}