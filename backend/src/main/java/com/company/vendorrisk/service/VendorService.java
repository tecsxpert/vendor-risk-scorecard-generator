package com.company.vendorrisk.service;

import com.company.vendorrisk.dto.VendorRequest;
import com.company.vendorrisk.dto.VendorResponse;
import com.company.vendorrisk.entity.Vendor;
import com.company.vendorrisk.exception.ResourceNotFoundException;
import com.company.vendorrisk.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    // ── READ ──────────────────────────────────────────────────────────────────

    public List<VendorResponse> getAllVendors() {
        return vendorRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<VendorResponse> getAllVendorsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return vendorRepository.findAll(pageable).map(this::toResponse);
    }

    public VendorResponse getVendorById(Long id) {
        Vendor vendor = findOrThrow(id);
        return toResponse(vendor);
    }

    public List<VendorResponse> searchVendors(String query) {
        return vendorRepository
                .searchByNameOrCategory(query)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── WRITE ─────────────────────────────────────────────────────────────────

    @Transactional
    public VendorResponse createVendor(VendorRequest request) {
        Vendor vendor = Vendor.builder()
                .name(request.getName().trim())
                .category(request.getCategory().trim())
                .status(request.getStatus())
                .riskScore(request.getRiskScore())
                .description(request.getDescription())
                .build();

        Vendor saved = vendorRepository.save(vendor);
        log.info("Created vendor id={} name={}", saved.getId(), saved.getName());
        return toResponse(saved);
    }

    @Transactional
    public VendorResponse updateVendor(Long id, VendorRequest request) {
        Vendor vendor = findOrThrow(id);

        vendor.setName(request.getName().trim());
        vendor.setCategory(request.getCategory().trim());
        vendor.setStatus(request.getStatus());
        vendor.setRiskScore(request.getRiskScore());
        vendor.setDescription(request.getDescription());

        Vendor saved = vendorRepository.save(vendor);
        log.info("Updated vendor id={}", saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public void deleteVendor(Long id) {
        Vendor vendor = findOrThrow(id);
        // Soft delete — mark as INACTIVE instead of removing the record
        vendor.setStatus("INACTIVE");
        vendorRepository.save(vendor);
        log.info("Soft-deleted vendor id={}", id);
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private Vendor findOrThrow(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vendor not found with id: " + id));
    }

    public VendorResponse toResponse(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .category(vendor.getCategory())
                .status(vendor.getStatus())
                .riskScore(vendor.getRiskScore())
                .description(vendor.getDescription())
                .createdAt(vendor.getCreatedAt())
                .updatedAt(vendor.getUpdatedAt())
                .build();
    }
}
