package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.VendorStatsResponse;
import com.company.vendorrisk.repository.VendorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private StatsService statsService;

    @Test
    void shouldReturnDashboardStats() {
        when(vendorRepository.count()).thenReturn(30L);
        when(vendorRepository.countByStatus("ACTIVE")).thenReturn(22L);
        when(vendorRepository.countByStatus("INACTIVE")).thenReturn(5L);
        when(vendorRepository.countHighRiskVendors()).thenReturn(3L);
        when(vendorRepository.countModerateRiskVendors()).thenReturn(10L);
        when(vendorRepository.countLowRiskVendors()).thenReturn(17L);
        when(vendorRepository.findAverageRiskScore()).thenReturn(42.5);

        VendorStatsResponse response = statsService.getDashboardStats();

        assertNotNull(response);
        assertEquals(30L, response.getTotalVendors());
        assertEquals(22L, response.getActiveVendors());
        assertEquals(5L, response.getInactiveVendors());
        assertEquals(3L, response.getHighRiskVendors());
        assertEquals(42.5, response.getAverageRiskScore());
    }

    @Test
    void shouldHandleNullAverageRiskScore() {
        when(vendorRepository.count()).thenReturn(0L);
        when(vendorRepository.countByStatus(any())).thenReturn(0L);
        when(vendorRepository.countHighRiskVendors()).thenReturn(0L);
        when(vendorRepository.countModerateRiskVendors()).thenReturn(0L);
        when(vendorRepository.countLowRiskVendors()).thenReturn(0L);
        when(vendorRepository.findAverageRiskScore()).thenReturn(null);

        VendorStatsResponse response = statsService.getDashboardStats();

        assertNotNull(response);
        assertEquals(0.0, response.getAverageRiskScore());
    }
}
