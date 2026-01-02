package com.example.jobsearch;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class FuzzySearchTester {

    @Autowired
    private EntityManager em;

    @Autowired
    private FuzzySearchService fuzzySearchService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private Company acme;
    private Company globex;

    @BeforeEach
    void setUp() throws InterruptedException {
        jobRepository.deleteAll();
        companyRepository.deleteAll();

        acme = new Company();
        acme.setName("Acme Corporation");
        companyRepository.save(acme);

        globex = new Company();
        globex.setName("Globex LLC");
        companyRepository.save(globex);

        Job activeJob1 = new Job();
        activeJob1.setTitle("Senior Backend Engineer");
        activeJob1.setDescriptionMd("Work on backend services in Java and Spring.");
        activeJob1.setLocation("Austin, Texas");
        activeJob1.setJobType("FULL_TIME");
        activeJob1.setWorkMode("REMOTE");
        activeJob1.setDatePosted(LocalDate.now().minusDays(3));
        activeJob1.setStatus("active");
        activeJob1.setCompany(acme);
        jobRepository.save(activeJob1);

        Job activeJob2 = new Job();
        activeJob2.setTitle("Frontend Developer");
        activeJob2.setDescriptionMd("React and TypeScript for modern UIs.");
        activeJob2.setLocation("New York City");
        activeJob2.setJobType("FULL_TIME");
        activeJob2.setWorkMode("HYBRID");
        activeJob2.setDatePosted(LocalDate.now().minusDays(1));
        activeJob2.setStatus("active");
        activeJob2.setCompany(globex);
        jobRepository.save(activeJob2);

        Job inactiveJob = new Job();
        inactiveJob.setTitle("Senior Backend Engineer (Legacy)");
        inactiveJob.setDescriptionMd("Work on legacy backend systems.");
        inactiveJob.setLocation("Austin, Texas");
        inactiveJob.setJobType("FULL_TIME");
        inactiveJob.setWorkMode("ONSITE");
        inactiveJob.setDatePosted(LocalDate.now().minusDays(10));
        inactiveJob.setStatus("inactive");
        inactiveJob.setCompany(acme);
        jobRepository.save(inactiveJob);

        em.flush();
        fuzzySearchService.reindexAll();
        em.clear();
    }

    @Test
    void searchJobs_shouldReturnOnlyActiveJobs() {
        List<Job> results = fuzzySearchService.searchJobs("backend", 20);

        assertThat(results)
            .isNotEmpty()
            .allMatch(job -> "active".equals(job.getStatus()));

        assertThat(results)
            .extracting(Job::getTitle)
            .doesNotContain("Senior Backend Engineer (Legacy)");
    }

    @Test
    void searchJobs_shouldBeTypoTolerantAndBoostTitleAndCompanyAndLocation() {
        String query = "Backnd Austn Akme";

        List<Job> results = fuzzySearchService.searchJobs(query, 20);

        assertThat(results)
            .extracting(Job::getTitle)
            .contains("Senior Backend Engineer");

        assertThat(results.get(0).getCompany().getName())
            .isEqualTo("Acme Corporation");
    }

    @Test
    void searchJobs_simpleQueryStringShouldHandleMultiTokenQueries() {
        String query = "frontend \"New York\"";

        List<Job> results = fuzzySearchService.searchJobs(query, 20);

        assertThat(results)
            .extracting(Job::getTitle)
            .contains("Frontend Developer");
    }

    @Test
    void searchJobs_respectsLimitBounds() {
        List<Job> results = fuzzySearchService.searchJobs("engineer", 1000);
        assertThat(results.size()).isLessThanOrEqualTo(50);

        List<Job> minResults = fuzzySearchService.searchJobs("engineer", 0);
        assertThat(minResults.size()).isGreaterThanOrEqualTo(1);
    }

    @Test
    void searchCompanies_shouldBeTypoTolerantOnName() {
        String query = "Acne Corp";

        List<Company> results = fuzzySearchService.searchCompanies(query, 10);

        assertThat(results)
            .extracting(Company::getName)
            .contains("Acme Corporation");
    }

    @Test
    void searchCompanies_simpleQueryStringShouldAlsoMatch() {
        String query = "Globex";

        List<Company> results = fuzzySearchService.searchCompanies(query, 10);

        assertThat(results)
            .extracting(Company::getName)
            .contains("Globex LLC");
    }
}