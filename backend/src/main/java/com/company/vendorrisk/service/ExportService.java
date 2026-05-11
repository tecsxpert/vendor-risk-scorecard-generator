package com.company.vendorrisk.service;

import com.company.vendorrisk.entity.Vendor;
import com.company.vendorrisk.repository.VendorRepository;
import com.company.vendorrisk.util.CsvUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final CsvUtil csvUtil;
    private final VendorRepository vendorRepository;

    public byte[] exportVendorsToCsv() {

        List<Vendor> vendors = vendorRepository.findAll(
                Sort.by(Sort.Direction.ASC, "id"));

        List<String[]> rows = new ArrayList<>();

        // Header row
        rows.add(new String[]{"ID", "Vendor Name", "Category", "Status", "Risk Score", "Description"});

        // Data rows
        for (Vendor v : vendors) {
            rows.add(new String[]{
                    String.valueOf(v.getId()),
                    v.getName(),
                    v.getCategory(),
                    v.getStatus(),
                    String.valueOf(v.getRiskScore()),
                    v.getDescription() != null ? v.getDescription() : ""
            });
        }

        String csvContent = csvUtil.generateCsv(rows);
        return csvContent.getBytes(StandardCharsets.UTF_8);
    }
}
