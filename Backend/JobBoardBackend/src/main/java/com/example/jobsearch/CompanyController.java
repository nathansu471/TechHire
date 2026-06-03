package com.example.jobsearch;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepository companyRepo;
    private final FuzzySearchService fuzzy;

    public CompanyController(CompanyRepository companyRepo, FuzzySearchService fuzzy) {
        this.companyRepo = companyRepo;
        this.fuzzy = fuzzy;
    }

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable Long id) {
        return companyRepo.findById(id)
                .map(company -> ResponseEntity.ok((Object) company))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Company not found")));
    }

    @PostMapping
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        Company saved = companyRepo.save(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody Company company) {
        return companyRepo.findById(id)
                .map(existing -> {
                    existing.setName(company.getName());
                    existing.setWebsite(company.getWebsite());
                    existing.setLocation(company.getLocation());
                    existing.setLogoUrl(company.getLogoUrl());
                    return ResponseEntity.ok((Object) companyRepo.save(existing));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Company not found")));
    }

    @GetMapping("/search")
    public List<Company> searchByName(@RequestParam String name) {
        return companyRepo.findByNameContainingIgnoreCase(name);
    }

    @GetMapping("/search/fuzzy")
    public List<Company> searchFuzzy(@RequestParam("q") String q,
                                     @RequestParam(value = "limit", defaultValue = "25") int limit) {
        return fuzzy.searchCompanies(q, limit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        if (!companyRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Company not found"));
        }
        companyRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
    }
}