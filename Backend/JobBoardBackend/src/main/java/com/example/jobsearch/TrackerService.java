package com.example.jobsearch;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrackerService {

    private final TrackerEntryRepository trackerRepo;
    private final UserRepository userRepo;

    public TrackerService(TrackerEntryRepository trackerRepo, UserRepository userRepo) {
        this.trackerRepo = trackerRepo;
        this.userRepo = userRepo;
    }

    // Called when a user applies to a job
    public TrackerEntry addAppliedJob(Long userId, ApplyJobRequest req) {

        User user = userRepo.findById(userId).orElseThrow();

        TrackerEntry entry = TrackerEntry.builder()
                .user(user)
                .title(req.getTitle())
                .company(req.getCompany())
                .location(req.getLocation())
                .jobType(req.getJobType())
                .status(TrackerEntry.Status.APPLIED)
                .build();

        return trackerRepo.save(entry);
    }

    public List<TrackerEntry> getTracker(Long userId) {
        return trackerRepo.findByUserId(userId);
    }
}