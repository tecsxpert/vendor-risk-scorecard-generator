package com.company.vendorrisk.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.company.vendorrisk.dto.UploadResponse;
import com.company.vendorrisk.util.ValidationUtil;

import org.junit.jupiter.api.Test;

import org.springframework.mock.web.MockMultipartFile;

public class FileUploadServiceTest {

    private final ValidationUtil validationUtil =
        new ValidationUtil();

    private final FileUploadService
        fileUploadService =
            new FileUploadService(
                validationUtil
            );

    @Test
    void shouldUploadFileSuccessfully() {

        MockMultipartFile file =
            new MockMultipartFile(
                "file",
                "vendors.csv",
                "text/csv",
                "name,category"
                    .getBytes()
            );

        UploadResponse response =
            fileUploadService
                .processVendorFile(file);

        assertNotNull(response);

        assertTrue(
            response.isSuccess()
        );

        assertEquals(
            "vendors.csv",
            response.getFileName()
        );
    }
}