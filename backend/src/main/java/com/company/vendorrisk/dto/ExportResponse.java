package com.company.vendorrisk.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportResponse {

    private String fileName;

    private String fileType;

    private long fileSize;

    private String downloadUrl;

    private LocalDateTime exportedAt;

    private String exportedBy;

    private boolean success;

    private String message;
}