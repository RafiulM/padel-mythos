CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
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
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `courts` (
	`id` varchar(36) NOT NULL,
	`venue_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('Indoor','Outdoor') NOT NULL DEFAULT 'Indoor',
	`price_per_hour` int NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `courts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `venues` (
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
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `venues_id` PRIMARY KEY(`id`),
	CONSTRAINT `venues_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_court_id_courts_id_fk` FOREIGN KEY (`court_id`) REFERENCES `courts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courts` ADD CONSTRAINT `courts_venue_id_venues_id_fk` FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `venues` ADD CONSTRAINT `venues_tenant_id_user_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookings_court_date_idx` ON `bookings` (`court_id`,`date`);--> statement-breakpoint
CREATE INDEX `courts_venue_id_idx` ON `courts` (`venue_id`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `venues_tenant_id_idx` ON `venues` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);