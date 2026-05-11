package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.AnalyticsResponse;
import com.company.vendorrisk.security.JwtUtil;
import com.company.vendorrisk.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void shouldReturnAnalytics() throws Exception {
        AnalyticsResponse response = AnalyticsResponse.builder()
                .totalVendors(30L)
                .activeVendors(22L)
                .highRiskVendors(3L)
                .averageRiskScore(42.5)
                .riskDistribution(List.of())
                .categoryAnalytics(List.of())
                .monthlyTrends(List.of())
                .build();

        when(analyticsService.getAnalytics()).thenReturn(response);

        mockMvc.perform(get("/api/analytics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVendors").value(30))
                .andExpect(jsonPath("$.activeVendors").value(22))
                .andExpect(jsonPath("$.averageRiskScore").value(42.5));
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/analytics"))
                .andExpect(status().isUnauthorized());
    }
}
