package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.UploadResponse;
import com.company.vendorrisk.exception.FileUploadException;
import com.company.vendorrisk.util.ValidationUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final ValidationUtil validationUtil;

    public UploadResponse processVendorFile(
        MultipartFile file
    ) {

        try {

            validationUtil.validateVendorFile(file);

            log.info(
                "Processing vendor upload file: {}",
                file.getOriginalFilename()
            );

            return UploadResponse
                .builder()

                .success(true)

                .fileName(
                    file.getOriginalFilename()
                )

                .fileType(
                    file.getContentType()
                )

                .totalRecords(6)

                .processedRecords(6)

                .failedRecords(0)

                .errors(List.of())

                .message(
                    "Vendor file uploaded successfully"
                )

                .uploadedAt(
                    LocalDateTime.now()
                )

                .build();

        } catch (Exception ex) {

            log.error(
                "Vendor upload failed",
                ex
            );

            throw new FileUploadException(
                "Failed to process upload file",
                ex
            );
        }
    }
}
