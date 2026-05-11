package com.company.vendorrisk.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private long totalVendors;

    private long activeVendors;

    private long inactiveVendors;

    private long highRiskVendors;

    private double averageRiskScore;

    private List<RiskDistribution> riskDistribution;

    private List<CategoryAnalytics> categoryAnalytics;

    private List<MonthlyTrend> monthlyTrends;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskDistribution {

        private String label;

        private long value;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryAnalytics {

        private String category;

        private long totalVendors;

        private double averageRiskScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrend {

        private String month;

        private double score;
    }
}