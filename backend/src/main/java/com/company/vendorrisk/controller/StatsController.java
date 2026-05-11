package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.VendorStatsResponse;
import com.company.vendorrisk.service.StatsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Tag(
    name = "Vendor Statistics",
    description = "Dashboard and vendor portfolio statistics APIs"
)
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(
        summary = "Get dashboard statistics",
        description = "Returns vendor portfolio metrics including totals, active vendors, high-risk vendors, and average risk score"
    )
    public ResponseEntity<VendorStatsResponse> getDashboardStats() {

        VendorStatsResponse response =
            statsService.getDashboardStats();

        return ResponseEntity.ok(response);
    }
}