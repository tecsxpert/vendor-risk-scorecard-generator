package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.VendorRequest;
import com.company.vendorrisk.dto.VendorResponse;
import com.company.vendorrisk.entity.Vendor;
import com.company.vendorrisk.exception.ResourceNotFoundException;
import com.company.vendorrisk.repository.VendorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @InjectMocks
    private VendorService vendorService;

    private Vendor buildVendor(Long id) {
        return Vendor.builder()
                .id(id).name("Amazon").category("Cloud")
                .status("ACTIVE").riskScore(22.0)
                .description("Cloud provider").build();
    }

    @Test
    void shouldReturnAllVendors() {
        when(vendorRepository.findAll(any(Sort.class)))
                .thenReturn(List.of(buildVendor(1L), buildVendor(2L)));

        List<VendorResponse> result = vendorService.getAllVendors();

        assertEquals(2, result.size());
        assertEquals("Amazon", result.get(0).getName());
    }

    @Test
    void shouldReturnVendorById() {
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(buildVendor(1L)));

        VendorResponse response = vendorService.getVendorById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Amazon", response.getName());
    }

    @Test
    void shouldThrowWhenVendorNotFound() {
        when(vendorRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> vendorService.getVendorById(99L));
    }

    @Test
    void shouldCreateVendor() {
        VendorRequest request = new VendorRequest("Stripe", "Payments", "HIGH_RISK", 74.0, "Payment gateway");
        Vendor saved = buildVendor(5L);
        saved.setName("Stripe");

        when(vendorRepository.save(any(Vendor.class))).thenReturn(saved);

        VendorResponse response = vendorService.createVendor(request);

        assertNotNull(response);
        assertEquals("Stripe", response.getName());
        verify(vendorRepository).save(any(Vendor.class));
    }

    @Test
    void shouldUpdateVendor() {
        Vendor existing = buildVendor(1L);
        VendorRequest request = new VendorRequest("Amazon Updated", "Cloud", "ACTIVE", 25.0, "Updated desc");

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(inv -> inv.getArgument(0));

        VendorResponse response = vendorService.updateVendor(1L, request);

        assertEquals("Amazon Updated", response.getName());
        assertEquals(25.0, response.getRiskScore());
    }

    @Test
    void shouldSoftDeleteVendor() {
        Vendor existing = buildVendor(1L);

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(inv -> inv.getArgument(0));

        vendorService.deleteVendor(1L);

        assertEquals("INACTIVE", existing.getStatus());
        verify(vendorRepository).save(existing);
    }

    @Test
    void shouldSearchVendors() {
        when(vendorRepository.searchByNameOrCategory("cloud"))
                .thenReturn(List.of(buildVendor(1L)));

        List<VendorResponse> result = vendorService.searchVendors("cloud");

        assertEquals(1, result.size());
    }
}
