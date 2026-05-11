package com.company.vendorrisk.util;

import com.company.vendorrisk.exception.InvalidRequestException;

import org.springframework.stereotype.Component;

import org.springframework.web.multipart.MultipartFile;

@Component
public class ValidationUtil {

    private static final long MAX_FILE_SIZE =
        5 * 1024 * 1024;

    public void validateVendorFile(
        MultipartFile file
    ) {

        if (
            file == null ||
            file.isEmpty()
        ) {
            throw new InvalidRequestException(
                "Upload file is required"
            );
        }

        validateFileExtension(file);

        validateFileSize(file);
    }

    private void validateFileExtension(
        MultipartFile file
    ) {

        String fileName =
            file.getOriginalFilename();

        if (fileName == null) {

            throw new InvalidRequestException(
                "Invalid file name"
            );
        }

        String lowerCaseName =
            fileName.toLowerCase();

        boolean valid =
            lowerCaseName.endsWith(".csv") ||
            lowerCaseName.endsWith(".xlsx");

        if (!valid) {

            throw new InvalidRequestException(
                "Only CSV and XLSX files are supported"
            );
        }
    }

    private void validateFileSize(
        MultipartFile file
    ) {

        if (
            file.getSize() >
            MAX_FILE_SIZE
        ) {

            throw new InvalidRequestException(
                "File size must not exceed 5MB"
            );
        }
    }
}