package com.company.vendorrisk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorStatsResponse {

    private long totalVendors;

    private long activeVendors;

    private long inactiveVendors;

    private long highRiskVendors;

    private long lowRiskVendors;

    private long moderateRiskVendors;

    private double averageRiskScore;
}