package com.company.vendorrisk.controller;

import com.company.vendorrisk.service.ExportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.core.io.ByteArrayResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@Tag(
    name = "Vendor Export",
    description = "APIs for exporting vendor portfolio data"
)
public class ExportController {

    private final ExportService exportService;

    @GetMapping(
        value = "/vendors",
        produces = "text/csv"
    )
    @Operation(
        summary = "Export vendors as CSV",
        description = "Downloads the vendor portfolio as a CSV file"
    )
    public ResponseEntity<ByteArrayResource> exportVendors() {

        byte[] csvData =
            exportService.exportVendorsToCsv();

        ByteArrayResource resource =
            new ByteArrayResource(csvData);

        return ResponseEntity.ok()

            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=vendors.csv"
            )

            .contentType(
                MediaType.parseMediaType(
                    "text/csv"
                )
            )

            .contentLength(csvData.length)

            .body(resource);
    }
}