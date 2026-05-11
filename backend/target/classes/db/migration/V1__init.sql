CREATE TABLE vendors (
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(255) NOT NULL,
    category   VARCHAR(150) NOT NULL,
    status     VARCHAR(100) NOT NULL,
    risk_score DOUBLE       NOT NULL,
    description TEXT,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendors_status    ON vendors (status);
CREATE INDEX idx_vendors_category  ON vendors (category);
CREATE INDEX idx_vendors_risk_score ON vendors (risk_score);
