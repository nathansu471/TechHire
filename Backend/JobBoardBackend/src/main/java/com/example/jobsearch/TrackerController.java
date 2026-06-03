package com.example.jobsearch;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tracker")
@CrossOrigin(origins = "*")
public class TrackerController {

    private final TrackerService trackerService;

    public TrackerController(TrackerService trackerService) {
        this.trackerService = trackerService;
    }

    // Called by frontend when user clicks Apply
    @PostMapping("/apply/{userId}")
    public TrackerEntry applyJob(
            @PathVariable Long userId,
            @RequestBody ApplyJobRequest req) {

        return trackerService.addAppliedJob(userId, req);
    }

    // Fetch all tracker entries for a user
    @GetMapping("/{userId}")
    public List<TrackerEntry> getTracker(@PathVariable Long userId) {
        return trackerService.getTracker(userId);
    }
}