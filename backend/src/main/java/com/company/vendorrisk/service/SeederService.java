package com.company.vendorrisk.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Seeder service — demo data is loaded by Flyway V3__seed_data.sql on startup.
 * This bean just logs a confirmation that the platform is ready.
 */
@Slf4j
@Service
public class SeederService {

    @PostConstruct
    public void onStartup() {
        log.info("""
            =====================================================
             Vendor Risk Platform — Ready
             Demo data loaded via Flyway V3__seed_data.sql
             Swagger UI: http://localhost:8080/swagger-ui.html
             H2 Console: http://localhost:8080/h2-console
             Demo login: admin@company.com / admin123
            =====================================================
            """);
    }
}
