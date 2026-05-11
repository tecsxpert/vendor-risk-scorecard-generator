package com.company.vendorrisk.controller;

import com.company.vendorrisk.dto.VendorRequest;
import com.company.vendorrisk.dto.VendorResponse;
import com.company.vendorrisk.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendor Management", description = "CRUD operations for vendor records")
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    @Operation(summary = "Get all vendors", description = "Returns all vendors sorted by newest first")
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/paginated")
    @Operation(summary = "Get vendors paginated")
    public ResponseEntity<Page<VendorResponse>> getAllVendorsPaginated(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(vendorService.getAllVendorsPaginated(page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vendor by ID")
    public ResponseEntity<VendorResponse> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search vendors by name or category")
    public ResponseEntity<List<VendorResponse>> searchVendors(
            @Parameter(description = "Search query") @RequestParam String q
    ) {
        return ResponseEntity.ok(vendorService.searchVendors(q));
    }

    @PostMapping
    @Operation(summary = "Create a new vendor")
    public ResponseEntity<VendorResponse> createVendor(@Valid @RequestBody VendorRequest request) {
        VendorResponse created = vendorService.createVendor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing vendor")
    public ResponseEntity<VendorResponse> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request
    ) {
        return ResponseEntity.ok(vendorService.updateVendor(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft-delete a vendor (sets status to INACTIVE)")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
