package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.VendorRequest;
import com.company.vendorrisk.dto.VendorResponse;
import com.company.vendorrisk.exception.ResourceNotFoundException;
import com.company.vendorrisk.security.JwtUtil;
import com.company.vendorrisk.service.VendorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VendorController.class)
class VendorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VendorService vendorService;

    @MockBean
    private JwtUtil jwtUtil;

    private VendorResponse buildResponse(Long id) {
        return VendorResponse.builder()
                .id(id).name("Amazon").category("Cloud")
                .status("ACTIVE").riskScore(22.0)
                .description("Cloud provider").build();
    }

    @Test
    @WithMockUser
    void shouldGetAllVendors() throws Exception {
        when(vendorService.getAllVendors()).thenReturn(List.of(buildResponse(1L), buildResponse(2L)));

        mockMvc.perform(get("/api/vendors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Amazon"));
    }

    @Test
    @WithMockUser
    void shouldGetVendorById() throws Exception {
        when(vendorService.getVendorById(1L)).thenReturn(buildResponse(1L));

        mockMvc.perform(get("/api/vendors/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Amazon"));
    }

    @Test
    @WithMockUser
    void shouldReturn404WhenVendorNotFound() throws Exception {
        when(vendorService.getVendorById(99L))
                .thenThrow(new ResourceNotFoundException("Vendor not found with id: 99"));

        mockMvc.perform(get("/api/vendors/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void shouldCreateVendor() throws Exception {
        VendorRequest request = new VendorRequest("Stripe", "Payments", "HIGH_RISK", 74.0, "Payment gateway");
        VendorResponse response = buildResponse(5L);
        response.setName("Stripe");

        when(vendorService.createVendor(any(VendorRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/vendors")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Stripe"));
    }

    @Test
    @WithMockUser
    void shouldReturn400OnInvalidVendorRequest() throws Exception {
        VendorRequest invalid = new VendorRequest("", "", "ACTIVE", -5.0, null);

        mockMvc.perform(post("/api/vendors")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void shouldUpdateVendor() throws Exception {
        VendorRequest request = new VendorRequest("Amazon Updated", "Cloud", "ACTIVE", 25.0, "Updated");
        VendorResponse response = buildResponse(1L);
        response.setName("Amazon Updated");

        when(vendorService.updateVendor(eq(1L), any(VendorRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/vendors/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Amazon Updated"));
    }

    @Test
    @WithMockUser
    void shouldDeleteVendor() throws Exception {
        doNothing().when(vendorService).deleteVendor(1L);

        mockMvc.perform(delete("/api/vendors/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void shouldSearchVendors() throws Exception {
        when(vendorService.searchVendors("cloud")).thenReturn(List.of(buildResponse(1L)));

        mockMvc.perform(get("/api/vendors/search").param("q", "cloud"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/vendors"))
                .andExpect(status().isUnauthorized());
    }
}
