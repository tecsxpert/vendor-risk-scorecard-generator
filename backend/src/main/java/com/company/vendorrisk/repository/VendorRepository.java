package com.company.vendorrisk.repository;

import com.company.vendorrisk.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    // Search by name or category (case-insensitive)
    @Query("SELECT v FROM Vendor v WHERE " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(v.category) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Vendor> searchByNameOrCategory(@Param("q") String query);

    // Paginated list
    Page<Vendor> findAll(Pageable pageable);

    // Stats queries
    long countByStatus(String status);

    @Query("SELECT AVG(v.riskScore) FROM Vendor v")
    Double findAverageRiskScore();

    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.riskScore >= 70")
    long countHighRiskVendors();

    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.riskScore >= 40 AND v.riskScore < 70")
    long countModerateRiskVendors();

    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.riskScore < 40")
    long countLowRiskVendors();

    // Category analytics
    @Query("SELECT v.category, COUNT(v), AVG(v.riskScore) FROM Vendor v GROUP BY v.category")
    List<Object[]> findCategoryStats();
}
