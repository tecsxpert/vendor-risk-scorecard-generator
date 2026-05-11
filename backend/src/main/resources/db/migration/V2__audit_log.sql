CREATE TABLE audit_logs (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    action       VARCHAR(255) NOT NULL,
    entity_name  VARCHAR(255) NOT NULL,
    entity_id    BIGINT,
    performed_by VARCHAR(255),
    details      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs (entity_name, entity_id);
