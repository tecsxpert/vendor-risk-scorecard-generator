package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.UploadResponse;
import com.company.vendorrisk.service.FileUploadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Tag(
    name = "Vendor Upload",
    description = "APIs for uploading vendor portfolio files"
)
public class UploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/vendors")
    @Operation(
        summary = "Upload vendor CSV",
        description = "Uploads and processes vendor CSV files"
    )
    public ResponseEntity<UploadResponse> uploadVendors(

        @RequestParam("file")
        @NotNull
        MultipartFile file

    ) {

        UploadResponse response =
            fileUploadService.processVendorFile(
                file
            );

        return ResponseEntity.ok(response);
    }
}