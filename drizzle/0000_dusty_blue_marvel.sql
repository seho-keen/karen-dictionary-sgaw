CREATE TABLE `examples` (
	`id` text PRIMARY KEY NOT NULL,
	`word_id` text NOT NULL,
	`karen_sentence` text NOT NULL,
	`korean_translation` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`word_id` text NOT NULL,
	`media_type` text NOT NULL,
	`media_url` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `relates` (
	`id` text PRIMARY KEY NOT NULL,
	`word_id` text NOT NULL,
	`related_word_id` text NOT NULL,
	`relation_type` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`related_word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `words` (
	`id` text PRIMARY KEY NOT NULL,
	`karen_word` text NOT NULL,
	`korean_word` text NOT NULL,
	`romanization` text,
	`part_of_speech` text,
	`target_audience` text DEFAULT 'all',
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
