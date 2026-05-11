package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.UploadResponse;
import com.company.vendorrisk.security.JwtUtil;
import com.company.vendorrisk.service.FileUploadService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UploadController.class)
class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FileUploadService fileUploadService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void shouldUploadVendorCsv() throws Exception {
        UploadResponse response = UploadResponse.builder()
                .success(true)
                .fileName("vendors.csv")
                .fileType("text/csv")
                .totalRecords(6)
                .processedRecords(6)
                .failedRecords(0)
                .errors(List.of())
                .message("Vendor file uploaded successfully")
                .uploadedAt(LocalDateTime.now())
                .build();

        when(fileUploadService.processVendorFile(any())).thenReturn(response);

        MockMultipartFile file = new MockMultipartFile(
                "file", "vendors.csv", "text/csv", "name,category".getBytes());

        mockMvc.perform(multipart("/api/upload/vendors")
                        .file(file)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.fileName").value("vendors.csv"));
    }

    @Test
    @WithMockUser
    void shouldReturn400WhenFileIsEmpty() throws Exception {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", "empty.csv", "text/csv", new byte[0]);

        when(fileUploadService.processVendorFile(any()))
                .thenThrow(new com.company.vendorrisk.exception.InvalidRequestException("Upload file is required"));

        mockMvc.perform(multipart("/api/upload/vendors")
                        .file(emptyFile)
                        .with(csrf()))
                .andExpect(status().isBadRequest());
    }
}
