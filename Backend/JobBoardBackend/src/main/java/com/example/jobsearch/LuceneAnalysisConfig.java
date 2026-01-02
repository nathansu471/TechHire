package com.example.jobsearch;

import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurationContext;
import org.hibernate.search.backend.lucene.analysis.LuceneAnalysisConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LuceneAnalysisConfig {

    @Bean
    public LuceneAnalysisConfigurer customAnalysisConfigurer() {
        return context -> {
            context.analyzer("english").custom()
                    .tokenizer("standard")
                    .tokenFilter("lowercase")
                    .tokenFilter("stop")
                    .tokenFilter("porterStem");

            context.normalizer("lowercase").custom()
                    .tokenFilter("lowercase");
        };
    }
}