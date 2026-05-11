package com.company.vendorrisk.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {

    private boolean success;

    private String fileName;

    private String fileType;

    private long totalRecords;

    private long processedRecords;

    private long failedRecords;

    private List<String> errors;

    private String message;

    private LocalDateTime uploadedAt;
}