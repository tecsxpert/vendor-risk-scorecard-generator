package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.AnalyticsResponse;
import com.company.vendorrisk.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final VendorRepository vendorRepository;

    public AnalyticsResponse getAnalytics() {

        long total    = vendorRepository.count();
        long active   = vendorRepository.countByStatus("ACTIVE");
        long inactive = vendorRepository.countByStatus("INACTIVE");
        long highRisk = vendorRepository.countHighRiskVendors();

        Double avgRisk = vendorRepository.findAverageRiskScore();
        double averageRiskScore = avgRisk != null
                ? Math.round(avgRisk * 10.0) / 10.0
                : 0.0;

        // Risk distribution buckets
        long low      = vendorRepository.countLowRiskVendors();
        long moderate = vendorRepository.countModerateRiskVendors();

        List<AnalyticsResponse.RiskDistribution> riskDistribution = List.of(
                AnalyticsResponse.RiskDistribution.builder().label("Low Risk").value(low).build(),
                AnalyticsResponse.RiskDistribution.builder().label("Moderate Risk").value(moderate).build(),
                AnalyticsResponse.RiskDistribution.builder().label("High Risk").value(highRisk).build()
        );

        // Category analytics from DB
        List<AnalyticsResponse.CategoryAnalytics> categoryAnalytics =
                vendorRepository.findCategoryStats().stream()
                        .map(row -> AnalyticsResponse.CategoryAnalytics.builder()
                                .category((String) row[0])
                                .totalVendors((Long) row[1])
                                .averageRiskScore(row[2] != null
                                        ? Math.round(((Double) row[2]) * 10.0) / 10.0
                                        : 0.0)
                                .build())
                        .toList();

        // Monthly trends — static for now (would need a time-series table in production)
        List<AnalyticsResponse.MonthlyTrend> monthlyTrends = List.of(
                AnalyticsResponse.MonthlyTrend.builder().month("Jan").score(Math.max(35, averageRiskScore - 10)).build(),
                AnalyticsResponse.MonthlyTrend.builder().month("Feb").score(Math.max(38, averageRiskScore - 6)).build(),
                AnalyticsResponse.MonthlyTrend.builder().month("Mar").score(Math.max(42, averageRiskScore - 2)).build(),
                AnalyticsResponse.MonthlyTrend.builder().month("Apr").score(Math.max(45, averageRiskScore + 1)).build(),
                AnalyticsResponse.MonthlyTrend.builder().month("May").score(averageRiskScore).build()
        );

        return AnalyticsResponse.builder()
                .totalVendors(total)
                .activeVendors(active)
                .inactiveVendors(inactive)
                .highRiskVendors(highRisk)
                .averageRiskScore(averageRiskScore)
                .riskDistribution(riskDistribution)
                .categoryAnalytics(categoryAnalytics)
                .monthlyTrends(monthlyTrends)
                .build();
    }
}
