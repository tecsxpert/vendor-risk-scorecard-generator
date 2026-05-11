package com.company.vendorrisk.config;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CsvConfig {

    @Bean
    public Charset csvCharset() {
        return StandardCharsets.UTF_8;
    }
}