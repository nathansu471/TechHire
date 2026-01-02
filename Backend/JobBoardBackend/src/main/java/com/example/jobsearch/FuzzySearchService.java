package com.example.jobsearch;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuzzySearchService {

    private final EntityManager em;

    public FuzzySearchService(EntityManager em) {
        this.em = em;
    }

    @Transactional
    public void reindexAll() throws InterruptedException {
        Search.session(em)
                .massIndexer()
                .typesToIndexInParallel(1)
                .startAndWait();
    }

    // Fuzzy job search with ranking
        @Transactional
    public List<JobDTO> searchJobs(String raw, int limit) {
        final String q = raw == null ? "" : raw.trim();
        final int safeLimit = Math.max(1, Math.min(50, limit));

        SearchSession session = Search.session(em);

        List<Job> hits = session.search(Job.class)
                .where(f -> f.bool(b -> {
                    // status is a Keyword field normalized to lowercase; match exact normalized
                    // value
                    b.must(f.match().field("status").matching("active").fuzzy(1));

                    if (!q.isEmpty()) {
                        // Fuzzy matches with boosts
                        b.should(f.match().field("title").matching(q).fuzzy(2).boost(5.0f));
                        b.should(f.match().field("company.name").matching(q).fuzzy(2).boost(4.0f));
                        b.should(f.match().field("location").matching(q).fuzzy(2).boost(2.0f));

                        // Use the alias "description" defined by @FullTextField(name = "description")
                        b.should(f.match().field("description").matching(q).fuzzy(1).boost(1.0f));

                        // simpleQueryString across all fields in one builder
                        b.should(
                                f.simpleQueryString()
                                        .fields("title", "company.name", "location", "description")
                                        .matching(q));
                    }
                }))
                .sort(f -> f.score())
                .fetchHits(safeLimit);

        return hits.stream().map(JobDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public List<Company> searchCompanies(String raw, int limit) {
        final String q = raw == null ? "" : raw.trim();
        final int safeLimit = Math.max(1, Math.min(50, limit));

        SearchSession session = Search.session(em);

        return session.search(Company.class)
                .where(f -> f.bool(b -> {
                    b.should(f.match().field("name").matching(q).fuzzy(2).boost(5.0f));
                    b.should(f.simpleQueryString().fields("name").matching(q));
                }))
                .sort(f -> f.score())
                .fetchHits(safeLimit);
    }
}