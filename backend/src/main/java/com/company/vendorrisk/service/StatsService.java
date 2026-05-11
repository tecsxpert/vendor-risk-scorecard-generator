package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.VendorStatsResponse;
import com.company.vendorrisk.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final VendorRepository vendorRepository;

    public VendorStatsResponse getDashboardStats() {

        long total    = vendorRepository.count();
        long active   = vendorRepository.countByStatus("ACTIVE");
        long inactive = vendorRepository.countByStatus("INACTIVE");
        long highRisk = vendorRepository.countHighRiskVendors();
        long moderate = vendorRepository.countModerateRiskVendors();
        long low      = vendorRepository.countLowRiskVendors();

        Double avgRisk = vendorRepository.findAverageRiskScore();
        double averageRiskScore = avgRisk != null
                ? Math.round(avgRisk * 10.0) / 10.0
                : 0.0;

        return VendorStatsResponse.builder()
                .totalVendors(total)
                .activeVendors(active)
                .inactiveVendors(inactive)
                .highRiskVendors(highRisk)
                .moderateRiskVendors(moderate)
                .lowRiskVendors(low)
                .averageRiskScore(averageRiskScore)
                .build();
    }
}
