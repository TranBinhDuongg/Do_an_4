-- Run once against the existing application database. No account data is changed.
CREATE TABLE IF NOT EXISTS rescue_sessions (
  token_hash CHAR(64) PRIMARY KEY,
  account_id BIGINT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  push_token VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX rescue_session_account (account_id),
  INDEX rescue_session_expiry (expires_at)
);
