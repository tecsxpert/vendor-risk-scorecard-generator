package com.company.vendorrisk.config;

import io.swagger.v3.oas.models.OpenAPI;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vendorRiskOpenAPI() {

        return new OpenAPI()

            .info(
                new Info()

                    .title(
                        "Vendor Risk Scorecard API"
                    )

                    .description(
                        """
                        Enterprise Vendor Risk Management APIs
                        for analytics, vendor intelligence,
                        exports, uploads, and dashboard insights.
                        """
                    )

                    .version("v1.0.0")

                    .contact(
                        new Contact()

                            .name(
                                "Tool-93 Engineering Team"
                            )

                            .email(
                                "engineering@tool93.com"
                            )
                    )

                    .license(
                        new License()

                            .name("Internal Use")

                            .url(
                                "https://tool93.internal"
                            )
                    )
            );
    }
}