-- Padelin schema migration
-- Dialect: MySQL / MariaDB-compatible MySQL mode
--
-- This file is intentionally standalone: run it once against an empty database
-- before running sql/seed.sql.

CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified` boolean NOT NULL DEFAULT false,
  `image` text,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  CONSTRAINT `user_id` PRIMARY KEY (`id`),
  CONSTRAINT `user_email_unique` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `session` (
  `id` varchar(36) NOT NULL,
  `expires_at` timestamp(3) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  `ip_address` text,
  `user_agent` text,
  `user_id` varchar(36) NOT NULL,
  CONSTRAINT `session_id` PRIMARY KEY (`id`),
  CONSTRAINT `session_token_unique` UNIQUE (`token`),
  KEY `session_user_id_idx` (`user_id`),
  CONSTRAINT `session_user_id_user_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `account` (
  `id` varchar(36) NOT NULL,
  `account_id` text NOT NULL,
  `provider_id` text NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `id_token` text,
  `access_token_expires_at` timestamp(3) NULL,
  `refresh_token_expires_at` timestamp(3) NULL,
  `scope` text,
  `password` text,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  CONSTRAINT `account_id` PRIMARY KEY (`id`),
  KEY `account_user_id_idx` (`user_id`),
  CONSTRAINT `account_user_id_user_id_fk`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `verification` (
  `id` varchar(36) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expires_at` timestamp(3) NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  `updated_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  CONSTRAINT `verification_id` PRIMARY KEY (`id`),
  KEY `verification_identifier_idx` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `venues` (
  `id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `address` text,
  `whatsapp` varchar(32),
  `open_hour` int NOT NULL DEFAULT 7,
  `close_hour` int NOT NULL DEFAULT 22,
  `bank_name` varchar(64),
  `bank_number` varchar(64),
  `bank_holder` varchar(255),
  `qris_url` text,
  `payment_notes` text,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  CONSTRAINT `venues_id` PRIMARY KEY (`id`),
  CONSTRAINT `venues_slug_unique` UNIQUE (`slug`),
  KEY `venues_tenant_id_idx` (`tenant_id`),
  CONSTRAINT `venues_tenant_id_user_id_fk`
    FOREIGN KEY (`tenant_id`) REFERENCES `user` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `venues_hours_check`
    CHECK (`open_hour` >= 0 AND `close_hour` <= 24 AND `open_hour` < `close_hour`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `courts` (
  `id` varchar(36) NOT NULL,
  `venue_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Indoor','Outdoor') NOT NULL DEFAULT 'Indoor',
  `price_per_hour` int NOT NULL,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  CONSTRAINT `courts_id` PRIMARY KEY (`id`),
  KEY `courts_venue_id_idx` (`venue_id`),
  CONSTRAINT `courts_venue_id_venues_id_fk`
    FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `courts_price_per_hour_check`
    CHECK (`price_per_hour` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bookings` (
  `id` varchar(36) NOT NULL,
  `code` varchar(16) NOT NULL,
  `court_id` varchar(36) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_wa` varchar(32) NOT NULL,
  `date` date NOT NULL,
  `start_hour` int NOT NULL,
  `duration` int NOT NULL,
  `total_price` int NOT NULL,
  `status` enum('PENDING','PAID','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
  `notes` text,
  `created_at` timestamp(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  CONSTRAINT `bookings_id` PRIMARY KEY (`id`),
  CONSTRAINT `bookings_code_unique` UNIQUE (`code`),
  KEY `bookings_court_date_idx` (`court_id`, `date`),
  CONSTRAINT `bookings_court_id_courts_id_fk`
    FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `bookings_hour_check`
    CHECK (`start_hour` >= 0 AND `start_hour` <= 23),
  CONSTRAINT `bookings_duration_check`
    CHECK (`duration` >= 1 AND `duration` <= 6),
  CONSTRAINT `bookings_total_price_check`
    CHECK (`total_price` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
