package com.company.vendorrisk.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponse {

    private Long id;
    private String name;
    private String category;
    private String status;
    private Double riskScore;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
