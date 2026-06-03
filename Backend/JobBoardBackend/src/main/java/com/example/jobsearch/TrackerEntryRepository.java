package com.example.jobsearch;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackerEntryRepository extends JpaRepository<TrackerEntry, Long> {
    List<TrackerEntry> findByUserId(Long userId);
}