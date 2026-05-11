package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.AnalyticsResponse;
import com.company.vendorrisk.service.AnalyticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(
    name = "Vendor Analytics",
    description = "Analytics APIs for vendor intelligence and risk insights"
)
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    @Operation(
        summary = "Get vendor analytics",
        description = "Returns vendor analytics including risk distribution, category insights, trends, and portfolio metrics"
    )
    public ResponseEntity<AnalyticsResponse> getAnalytics() {

        AnalyticsResponse response =
            analyticsService.getAnalytics();

        return ResponseEntity.ok(response);
    }
}