package com.company.vendorrisk.aspect;

import com.company.vendorrisk.entity.AuditLog;
import com.company.vendorrisk.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditLoggingAspect {

    private final AuditLogRepository auditLogRepository;

    /**
     * Intercept all CUD (Create, Update, Delete) methods on VendorController
     * and write an audit record to the database.
     */
    @AfterReturning(
        "execution(* com.company.vendorrisk.controller.VendorController.createVendor(..)) || " +
        "execution(* com.company.vendorrisk.controller.VendorController.updateVendor(..)) || " +
        "execution(* com.company.vendorrisk.controller.VendorController.deleteVendor(..))"
    )
    public void logVendorCud(JoinPoint joinPoint) {
        try {
            String methodName = joinPoint.getSignature().getName();
            Object[] args     = joinPoint.getArgs();

            String action     = resolveAction(methodName);
            Long   entityId   = extractEntityId(args);
            String details    = "Method: " + methodName + " | Args: " + Arrays.toString(args);
            String performer  = resolvePerformer();

            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .entityName("Vendor")
                    .entityId(entityId)
                    .performedBy(performer)
                    .details(details)
                    .build();

            auditLogRepository.save(auditLog);

            log.info("[AUDIT] {} on Vendor id={} by {}", action, entityId, performer);

        } catch (Exception e) {
            // Audit logging must never break the main flow
            log.warn("Audit logging failed: {}", e.getMessage());
        }
    }

    /**
     * Also log all other controller activity to the console (non-CUD).
     */
    @AfterReturning(
        "execution(* com.company.vendorrisk.controller.*.*(..)) && " +
        "!execution(* com.company.vendorrisk.controller.VendorController.createVendor(..)) && " +
        "!execution(* com.company.vendorrisk.controller.VendorController.updateVendor(..)) && " +
        "!execution(* com.company.vendorrisk.controller.VendorController.deleteVendor(..))"
    )
    public void logControllerActivity(JoinPoint joinPoint) {
        log.info("[AUDIT] {} | {} | {}",
                LocalDateTime.now(),
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName());
    }

    private String resolveAction(String methodName) {
        return switch (methodName) {
            case "createVendor" -> "CREATE";
            case "updateVendor" -> "UPDATE";
            case "deleteVendor" -> "DELETE";
            default             -> methodName.toUpperCase();
        };
    }

    private Long extractEntityId(Object[] args) {
        if (args == null) return null;
        for (Object arg : args) {
            if (arg instanceof Long id) return id;
        }
        return null;
    }

    private String resolvePerformer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "anonymous";
    }
}
