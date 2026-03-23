CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name_ar` text NOT NULL,
	`name_en` text,
	`name_fr` text,
	`description_ar` text,
	`description_en` text,
	`description_fr` text,
	`price` integer NOT NULL,
	`stock_status` text DEFAULT 'in_stock' NOT NULL,
	`producer_name_ar` text,
	`producer_name_en` text,
	`producer_name_fr` text,
	`image_url` text
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text,
	`title_fr` text,
	`slug` text NOT NULL,
	`description_ar` text,
	`description_en` text,
	`description_fr` text,
	`category` text NOT NULL,
	`image_url` text,
	`needs_funding` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`full_name` text,
	`email` text,
	`phone` text
);
