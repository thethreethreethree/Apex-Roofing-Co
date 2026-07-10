CREATE TABLE `availability_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`days` text,
	`start_time` text,
	`end_time` text,
	`slot_minutes` integer,
	`capacity_per_slot` integer,
	`weeks_ahead` integer,
	`min_lead_hours` integer
);
--> statement-breakpoint
CREATE TABLE `blackouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`reason` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text DEFAULT 'confirmed',
	`slot` text NOT NULL,
	`slot_label` text,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`address` text,
	`service` text,
	`notes` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `branding` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`logo_id` integer,
	`logo_light_id` integer,
	`favicon_id` integer,
	`primary_color` text,
	`accent_color` text,
	FOREIGN KEY (`logo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`logo_light_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`favicon_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`logo_id` integer,
	`description` text,
	`link` text,
	`order` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`logo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `financing_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`heading` text,
	`intro` text,
	`insurance_claim_help` text
);
--> statement-breakpoint
CREATE TABLE `home_page` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hero_heading` text,
	`hero_subheading` text,
	`hero_background_image_id` integer,
	`hero_primary_cta_label` text,
	`hero_secondary_cta_label` text,
	`trust_badges` text,
	`why_us` text,
	`show_projects` integer DEFAULT true,
	`show_reviews` integer DEFAULT true,
	`show_service_areas` integer DEFAULT true,
	`show_financing` integer DEFAULT true,
	`final_cta_heading` text,
	`final_cta_subheading` text,
	`final_cta_cta_label` text,
	FOREIGN KEY (`hero_background_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`service` text,
	`message` text,
	`source_page` text,
	`status` text DEFAULT 'new',
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alt` text NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text,
	`filesize` integer,
	`width` integer,
	`height` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`terms` text,
	`partner_logo_id` integer,
	`order` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`partner_logo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`service_id` integer,
	`city` text,
	`completed_date` text,
	`before_image_id` integer,
	`after_image_id` integer,
	`gallery` text,
	`description` text,
	`linked_review_id` integer,
	`featured` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`before_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`after_image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`linked_review_id`) REFERENCES `reviews`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`text` text NOT NULL,
	`date` text,
	`location` text,
	`source` text DEFAULT 'Google',
	`service_id` integer,
	`featured` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`summary` text NOT NULL,
	`description` text,
	`price_range` text,
	`icon` text DEFAULT 'groom',
	`image_id` integer,
	`featured` integer DEFAULT false,
	`order` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text,
	`tagline` text,
	`phone` text,
	`emergency_phone` text,
	`email` text,
	`address_street` text,
	`address_city` text,
	`address_state` text,
	`address_zip` text,
	`hours` text,
	`social_google` text,
	`social_facebook` text,
	`social_instagram` text,
	`social_yelp` text,
	`license` text,
	`years_in_business` integer,
	`insurance_statement` text,
	`google_rating` real,
	`google_review_count` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);