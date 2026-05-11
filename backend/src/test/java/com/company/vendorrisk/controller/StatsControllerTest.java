package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.VendorStatsResponse;
import com.company.vendorrisk.security.JwtUtil;
import com.company.vendorrisk.service.StatsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StatsController.class)
class StatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StatsService statsService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void shouldReturnDashboardStats() throws Exception {
        VendorStatsResponse response = VendorStatsResponse.builder()
                .totalVendors(30L)
                .activeVendors(22L)
                .inactiveVendors(5L)
                .highRiskVendors(3L)
                .moderateRiskVendors(10L)
                .lowRiskVendors(17L)
                .averageRiskScore(42.5)
                .build();

        when(statsService.getDashboardStats()).thenReturn(response);

        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalVendors").value(30))
                .andExpect(jsonPath("$.activeVendors").value(22))
                .andExpect(jsonPath("$.averageRiskScore").value(42.5));
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isUnauthorized());
    }
}
