package com.company.vendorrisk.controller;

import com.company.vendorrisk.security.JwtUtil;
import com.company.vendorrisk.service.ExportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExportController.class)
class ExportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExportService exportService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void shouldExportVendorCsv() throws Exception {
        String csvContent = "\"ID\",\"Vendor Name\"\n\"1\",\"Amazon\"\n";
        when(exportService.exportVendorsToCsv()).thenReturn(csvContent.getBytes());

        mockMvc.perform(get("/api/export/vendors"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition",
                        "attachment; filename=vendors.csv"));
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/export/vendors"))
                .andExpect(status().isUnauthorized());
    }
}
