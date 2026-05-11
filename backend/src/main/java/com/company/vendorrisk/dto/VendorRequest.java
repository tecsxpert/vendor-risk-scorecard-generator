package com.company.vendorrisk.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequest {

    @NotBlank(message = "Vendor name is required")
    @Size(max = 255, message = "Vendor name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 150, message = "Category must not exceed 150 characters")
    private String category;

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "ACTIVE|INACTIVE|HIGH_RISK",
        message = "Status must be ACTIVE, INACTIVE, or HIGH_RISK"
    )
    private String status;

    @NotNull(message = "Risk score is required")
    @Min(value = 0, message = "Risk score must be at least 0")
    @Max(value = 100, message = "Risk score must not exceed 100")
    private Double riskScore;

    private String description;
}
