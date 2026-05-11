package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.AnalyticsResponse;
import com.company.vendorrisk.repository.VendorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void shouldReturnAnalyticsData() {
        when(vendorRepository.count()).thenReturn(30L);
        when(vendorRepository.countByStatus("ACTIVE")).thenReturn(22L);
        when(vendorRepository.countByStatus("INACTIVE")).thenReturn(5L);
        when(vendorRepository.countHighRiskVendors()).thenReturn(3L);
        when(vendorRepository.countModerateRiskVendors()).thenReturn(10L);
        when(vendorRepository.countLowRiskVendors()).thenReturn(17L);
        when(vendorRepository.findAverageRiskScore()).thenReturn(42.5);
        when(vendorRepository.findCategoryStats()).thenReturn(List.of(
                new Object[]{"Cloud", 5L, 30.0},
                new Object[]{"Security", 8L, 55.0}
        ));

        AnalyticsResponse response = analyticsService.getAnalytics();

        assertNotNull(response);
        assertEquals(30L, response.getTotalVendors());
        assertEquals(22L, response.getActiveVendors());
        assertEquals(3L, response.getHighRiskVendors());
        assertNotNull(response.getRiskDistribution());
        assertEquals(3, response.getRiskDistribution().size());
        assertNotNull(response.getCategoryAnalytics());
        assertEquals(2, response.getCategoryAnalytics().size());
        assertNotNull(response.getMonthlyTrends());
        assertEquals(5, response.getMonthlyTrends().size());
    }

    @Test
    void shouldHandleEmptyDatabase() {
        when(vendorRepository.count()).thenReturn(0L);
        when(vendorRepository.countByStatus(any())).thenReturn(0L);
        when(vendorRepository.countHighRiskVendors()).thenReturn(0L);
        when(vendorRepository.countModerateRiskVendors()).thenReturn(0L);
        when(vendorRepository.countLowRiskVendors()).thenReturn(0L);
        when(vendorRepository.findAverageRiskScore()).thenReturn(null);
        when(vendorRepository.findCategoryStats()).thenReturn(List.of());

        AnalyticsResponse response = analyticsService.getAnalytics();

        assertNotNull(response);
        assertEquals(0L, response.getTotalVendors());
        assertEquals(0.0, response.getAverageRiskScore());
        assertTrue(response.getCategoryAnalytics().isEmpty());
    }
}
