CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text,
	`title_fr` text,
	`content_ar` text NOT NULL,
	`content_en` text,
	`content_fr` text,
	`date` text,
	`image_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
