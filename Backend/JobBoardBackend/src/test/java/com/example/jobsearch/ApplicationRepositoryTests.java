package com.example.jobsearch;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ApplicationRepositoryTest {

    @Autowired
    private ApplicationRepository appRepo;

    @Autowired
    private JobRepository jobRepo;

    @Test
    void testSaveAndFind() {
        Job job = new Job();
        job.setTitle("Backend Dev");
        job.setLocation("Remote");
        job.setJobType("Full-time");
        job = jobRepo.save(job);

        Application a = new Application();
        a.setJob(job);
        a.setSeekerName("John Doe");
        a.setSeekerEmail("john@example.com");
        a.setStatus("received");
        a = appRepo.save(a);

        assertThat(a.getId()).isNotNull();
        assertThat(appRepo.findById(a.getId())).isPresent();
    }

    @Test
    void testFindByJobId() {
        Job job = new Job();
        job.setTitle("Data Analyst");
        job.setLocation("CA");
        job.setJobType("Full-time");
        job = jobRepo.save(job);

        Application a1 = new Application();
        a1.setJob(job);
        a1.setSeekerName("A");
        a1.setSeekerEmail("a@x.com");
        a1.setStatus("received");
        appRepo.save(a1);

        Application a2 = new Application();
        a2.setJob(job);
        a2.setSeekerName("B");
        a2.setSeekerEmail("b@x.com");
        a2.setStatus("received");
        appRepo.save(a2);

        List<Application> result = appRepo.findByJobId(job.getId());

        assertThat(result).hasSize(2);
    }

    @Test
    void testFindBySeekerEmail() {
        Job job = new Job();
        job.setTitle("ML Eng");
        job.setLocation("Remote");
        job.setJobType("Full-time");
        job = jobRepo.save(job);

        Application a = new Application();
        a.setJob(job);
        a.setSeekerName("ZZ");
        a.setSeekerEmail("test@mail.com");
        a.setStatus("received");
        appRepo.save(a);

        List<Application> apps = appRepo.findBySeekerEmail("test@mail.com");

        assertThat(apps).hasSize(1);
    }
}
