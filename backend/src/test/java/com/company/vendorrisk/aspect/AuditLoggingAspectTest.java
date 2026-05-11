package com.company.vendorrisk.aspect;

import com.company.vendorrisk.entity.AuditLog;
import com.company.vendorrisk.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLoggingAspectTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private JoinPoint joinPoint;

    @Mock
    private Signature signature;

    @InjectMocks
    private AuditLoggingAspect auditLoggingAspect;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private void setupJoinPoint(String methodName, Object[] args) {
        // Use lenient() for getDeclaringTypeName — only used by the non-CUD advice
        lenient().when(joinPoint.getSignature()).thenReturn(signature);
        lenient().when(signature.getDeclaringTypeName()).thenReturn("VendorController");
        when(signature.getName()).thenReturn(methodName);
        when(joinPoint.getArgs()).thenReturn(args);
        // Re-stub getSignature strictly for the calls that matter
        when(joinPoint.getSignature()).thenReturn(signature);
    }

    private void setAuthenticatedUser(String email) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, List.of())
        );
    }

    @Test
    void shouldSaveAuditLogOnCreate() {
        setAuthenticatedUser("admin@company.com");
        setupJoinPoint("createVendor", new Object[]{});

        auditLoggingAspect.logVendorCud(joinPoint);

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository, times(1)).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertEquals("CREATE", saved.getAction());
        assertEquals("Vendor", saved.getEntityName());
        assertEquals("admin@company.com", saved.getPerformedBy());
    }

    @Test
    void shouldSaveAuditLogOnUpdate() {
        setAuthenticatedUser("admin@company.com");
        setupJoinPoint("updateVendor", new Object[]{5L});

        auditLoggingAspect.logVendorCud(joinPoint);

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertEquals("UPDATE", saved.getAction());
        assertEquals(5L, saved.getEntityId());
    }

    @Test
    void shouldSaveAuditLogOnDelete() {
        setAuthenticatedUser("admin@company.com");
        setupJoinPoint("deleteVendor", new Object[]{3L});

        auditLoggingAspect.logVendorCud(joinPoint);

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());

        AuditLog saved = captor.getValue();
        assertEquals("DELETE", saved.getAction());
        assertEquals(3L, saved.getEntityId());
    }

    @Test
    void shouldNotThrowWhenRepositoryFails() {
        setAuthenticatedUser("admin@company.com");
        setupJoinPoint("createVendor", new Object[]{});
        doThrow(new RuntimeException("DB error")).when(auditLogRepository).save(any());

        // Audit logging must never break the main flow
        assertDoesNotThrow(() -> auditLoggingAspect.logVendorCud(joinPoint));
    }

    @Test
    void shouldUseAnonymousWhenNoAuth() {
        // No security context — should fall back to "anonymous"
        setupJoinPoint("deleteVendor", new Object[]{42L});

        auditLoggingAspect.logVendorCud(joinPoint);

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository).save(captor.capture());
        assertEquals("anonymous", captor.getValue().getPerformedBy());
        assertEquals(42L, captor.getValue().getEntityId());
    }
}
