package com.company.vendorrisk.service;

import com.company.vendorrisk.entity.Vendor;
import com.company.vendorrisk.repository.VendorRepository;
import com.company.vendorrisk.util.CsvUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExportServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private CsvUtil csvUtil;

    @InjectMocks
    private ExportService exportService;

    @Test
    void shouldExportCsvSuccessfully() {
        Vendor vendor = Vendor.builder()
                .id(1L).name("Amazon").category("Cloud")
                .status("ACTIVE").riskScore(22.0)
                .description("Cloud provider").build();

        when(vendorRepository.findAll(any(Sort.class))).thenReturn(List.of(vendor));
        when(csvUtil.generateCsv(any())).thenReturn("\"ID\",\"Vendor Name\"\n\"1\",\"Amazon\"\n");

        byte[] result = exportService.exportVendorsToCsv();

        assertNotNull(result);
        assertTrue(result.length > 0);
        String csv = new String(result);
        assertTrue(csv.contains("Vendor Name"));
        verify(vendorRepository).findAll(any(Sort.class));
    }

    @Test
    void shouldExportEmptyListWhenNoVendors() {
        when(vendorRepository.findAll(any(Sort.class))).thenReturn(List.of());
        when(csvUtil.generateCsv(any())).thenReturn("\"ID\",\"Vendor Name\"\n");

        byte[] result = exportService.exportVendorsToCsv();

        assertNotNull(result);
        assertTrue(result.length > 0);
    }
}
