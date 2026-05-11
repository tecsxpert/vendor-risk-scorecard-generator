package com.company.vendorrisk.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Vendor name is required")
    @Size(max = 255, message = "Vendor name must not exceed 255 characters")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 150, message = "Category must not exceed 150 characters")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "Status is required")
    @Pattern(
        regexp = "ACTIVE|INACTIVE|HIGH_RISK",
        message = "Status must be ACTIVE, INACTIVE, or HIGH_RISK"
    )
    @Column(nullable = false)
    private String status;

    @NotNull(message = "Risk score is required")
    @Min(value = 0, message = "Risk score must be at least 0")
    @Max(value = 100, message = "Risk score must not exceed 100")
    @Column(name = "risk_score", nullable = false)
    private Double riskScore;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
